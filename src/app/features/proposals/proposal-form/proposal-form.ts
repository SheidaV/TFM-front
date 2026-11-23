import { Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Place } from '../../../core/models/place';
import { foodOptions } from '../../../core/models/preference.dto';
import { ProposalDto, ProposalRequest, ProposalType } from '../../../core/models/proposal.dto';
import { Proposals } from '../../../core/services/proposals';
import { getErrorMessage } from '../../../core/utils/api-error';
import { PlaceAutocomplete } from '../../../shared/components/place-autocomplete/place-autocomplete';

@Component({
  imports: [ReactiveFormsModule, PlaceAutocomplete],
  selector: 'app-proposal-form',
  styleUrl: './proposal-form.scss',
  templateUrl: './proposal-form.html',
})
export class ProposalForm {
  tripId = input.required<string>();
  near = input<{ lat: number; lon: number } | null>(null);
  created = output<ProposalDto>();
  cancelled = output<void>();

  foodOptions = foodOptions;

  type = new FormControl<ProposalType>('activity', { nonNullable: true });
  title = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
  });
  description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(1000)],
  });
  cost = new FormControl<number | null>(null, { validators: [Validators.min(0)] });
  location = new FormControl<Place | null>(null);
  dietTags = new FormControl<string[]>([], { nonNullable: true });

  proposalForm = new FormGroup({
    type: this.type,
    title: this.title,
    description: this.description,
    cost: this.cost,
    location: this.location,
    diet_tags: this.dietTags,
  });

  isValidForm = signal<boolean | null>(null);
  saving = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private proposals: Proposals) {}

  toggleDiet(value: string): void {
    const values = this.dietTags.value;
    this.dietTags.setValue(
      values.includes(value) ? values.filter((v) => v !== value) : [...values, value],
    );
  }

  async save(): Promise<void> {
    this.isValidForm.set(false);
    this.errorMessage.set(null);
    if (this.proposalForm.invalid) {
      return;
    }

    this.isValidForm.set(true);
    this.saving.set(true);
    try {
      const proposal = await this.proposals.create(this.tripId(), this.toRequest());
      this.created.emit(proposal);
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  private toRequest(): ProposalRequest {
    const value = this.proposalForm.getRawValue();
    return {
      type: value.type,
      title: value.title,
      description: value.description || null,
      cost: value.cost,
      location: value.location?.name ?? null,
      location_lat: value.location?.lat ?? null,
      location_lon: value.location?.lon ?? null,
      diet_tags: value.type === 'restaurant' ? value.diet_tags : [],
    };
  }
}
