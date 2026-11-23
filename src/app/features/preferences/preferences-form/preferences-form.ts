import { Component, computed, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  activityOptions,
  foodOptions,
  GroupPreferencesDto,
  PreferenceOption,
} from '../../../core/models/preference.dto';
import { Preferences } from '../../../core/services/preferences';
import { getErrorMessage } from '../../../core/utils/api-error';

interface SummaryRow {
  label: string;
  count: number;
  percent: number;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-preferences-form',
  styleUrl: './preferences-form.scss',
  templateUrl: './preferences-form.html',
})
export class PreferencesForm implements OnInit {
  tripId = input.required<string>();

  foodOptions = foodOptions;
  activityOptions = activityOptions;

  food = new FormControl<string[]>([], { nonNullable: true });
  activities = new FormControl<string[]>([], { nonNullable: true });
  preferencesForm = new FormGroup({ food: this.food, activities: this.activities });

  group = signal<GroupPreferencesDto | null>(null);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  foodSummary = computed(() => this.summary(this.group()?.food, foodOptions));
  activitySummary = computed(() => this.summary(this.group()?.activities, activityOptions));

  constructor(private preferences: Preferences) {}

  async ngOnInit() {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      const group = await this.preferences.get(this.tripId());
      this.group.set(group);
      if (group.mine) {
        this.preferencesForm.setValue({
          food: group.mine.food,
          activities: group.mine.activities,
        });
      }
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  isChecked(control: FormControl<string[]>, value: string): boolean {
    return control.value.includes(value);
  }

  toggle(control: FormControl<string[]>, value: string): void {
    const values = control.value;
    control.setValue(
      values.includes(value) ? values.filter((v) => v !== value) : [...values, value],
    );
    this.successMessage.set(null);
  }

  async save(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.saving.set(true);

    try {
      await this.preferences.save(this.tripId(), this.preferencesForm.getRawValue());
      this.successMessage.set('Preferencias guardadas');
      await this.load();
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  // most chosen first, percent over the people who answered
  private summary(
    counts: Record<string, number> | undefined,
    options: PreferenceOption[],
  ): SummaryRow[] {
    const responses = this.group()?.responses ?? 0;
    if (!counts || responses === 0) {
      return [];
    }
    return options
      .filter((o) => counts[o.value])
      .map((o) => ({
        label: o.label,
        count: counts[o.value],
        percent: Math.round((counts[o.value] / responses) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }
}
