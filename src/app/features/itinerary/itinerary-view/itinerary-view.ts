import { DatePipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItineraryDto, ItineraryItem, ItineraryProposal } from '../../../core/models/itinerary.dto';
import { proposalTypeLabels } from '../../../core/models/proposal.dto';
import { Itinerary } from '../../../core/services/itinerary';
import { getErrorMessage } from '../../../core/utils/api-error';

// what the form is doing: adding a proposal or editing a scheduled item
type Editing = { kind: 'add'; proposal: ItineraryProposal } | { kind: 'edit'; item: ItineraryItem };

@Component({
  imports: [DatePipe, ReactiveFormsModule],
  selector: 'app-itinerary-view',
  styleUrl: './itinerary-view.scss',
  templateUrl: './itinerary-view.html',
})
export class ItineraryView implements OnInit {
  tripId = input.required<string>();

  itinerary = signal<ItineraryDto | null>(null);
  editing = signal<Editing | null>(null);
  errorMessage = signal<string | null>(null);
  saving = signal(false);

  typeLabels = proposalTypeLabels;

  tripDays = computed(() => this.itinerary()?.days.filter((d) => !d.outside_trip) ?? []);
  isEmpty = computed(() => {
    const itinerary = this.itinerary();
    return (
      !!itinerary &&
      itinerary.available.length === 0 &&
      itinerary.days.every((d) => d.items.length === 0)
    );
  });

  date = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  startTime = new FormControl('10:00', { nonNullable: true, validators: [Validators.required] });
  endTime = new FormControl('11:00', { nonNullable: true, validators: [Validators.required] });
  slotForm = new FormGroup({
    date: this.date,
    start_time: this.startTime,
    end_time: this.endTime,
  });

  constructor(private itineraryService: Itinerary) {}

  async ngOnInit() {
    try {
      this.itinerary.set(await this.itineraryService.get(this.tripId()));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  startAdd(proposal: ItineraryProposal): void {
    this.errorMessage.set(null);
    this.slotForm.setValue({
      date: this.tripDays()[0]?.date ?? '',
      start_time: '10:00',
      end_time: '11:00',
    });
    this.editing.set({ kind: 'add', proposal });
  }

  startEdit(item: ItineraryItem, date: string): void {
    this.errorMessage.set(null);
    this.slotForm.setValue({ date, start_time: item.start_time, end_time: item.end_time });
    this.editing.set({ kind: 'edit', item });
  }

  cancel(): void {
    this.editing.set(null);
    this.errorMessage.set(null);
  }

  editingTitle(editing: Editing): string {
    return editing.kind === 'add' ? editing.proposal.title : editing.item.proposal.title;
  }

  async save(): Promise<void> {
    const editing = this.editing();
    if (!editing || this.slotForm.invalid) {
      return;
    }

    this.errorMessage.set(null);
    this.saving.set(true);
    try {
      const slot = this.slotForm.getRawValue();
      const itinerary =
        editing.kind === 'add'
          ? await this.itineraryService.add(this.tripId(), editing.proposal.id, slot)
          : await this.itineraryService.update(this.tripId(), editing.item.id, slot);
      this.itinerary.set(itinerary);
      this.editing.set(null);
    } catch (error) {
      // overlaps, dates outside the trip... come from the backend
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async remove(item: ItineraryItem): Promise<void> {
    if (!confirm(`¿Quitar "${item.proposal.title}" del itinerario?`)) {
      return;
    }
    this.errorMessage.set(null);
    try {
      this.itinerary.set(await this.itineraryService.remove(this.tripId(), item.id));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }
}
