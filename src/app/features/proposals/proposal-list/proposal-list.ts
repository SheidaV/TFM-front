import { DecimalPipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { foodOptions } from '../../../core/models/preference.dto';
import { ProposalDto, ProposalType, proposalTypeLabels } from '../../../core/models/proposal.dto';
import { Places } from '../../../core/services/places';
import { Proposals } from '../../../core/services/proposals';
import { getErrorMessage } from '../../../core/utils/api-error';
import { ProposalVote } from '../../votes/proposal-vote/proposal-vote';
import { ProposalForm } from '../proposal-form/proposal-form';

type ProposalFilter = 'all' | ProposalType;

const dietLabels = Object.fromEntries(foodOptions.map((o) => [o.value, o.label]));

@Component({
  imports: [DecimalPipe, ProposalForm, ProposalVote],
  selector: 'app-proposal-list',
  styleUrl: './proposal-list.scss',
  templateUrl: './proposal-list.html',
})
export class ProposalList implements OnInit {
  tripId = input.required<string>();
  near = input<{ lat: number; lon: number } | null>(null);

  proposals = signal<ProposalDto[]>([]);
  filter = signal<ProposalFilter>('all');
  showForm = signal(false);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  typeLabels = proposalTypeLabels;

  visibleProposals = computed(() => {
    const filter = this.filter();
    return filter === 'all' ? this.proposals() : this.proposals().filter((p) => p.type === filter);
  });

  constructor(private proposalsService: Proposals) {}

  async ngOnInit() {
    try {
      this.proposals.set(await this.proposalsService.getAll(this.tripId()));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  count(type: ProposalType): number {
    return this.proposals().filter((p) => p.type === type).length;
  }

  onCreated(proposal: ProposalDto): void {
    this.proposals.update((list) => [proposal, ...list]);
    this.showForm.set(false);
  }

  replace(updated: ProposalDto): void {
    this.proposals.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }

  async remove(proposal: ProposalDto): Promise<void> {
    if (!confirm(`¿Eliminar la propuesta "${proposal.title}"?`)) {
      return;
    }
    this.errorMessage.set(null);
    try {
      await this.proposalsService.delete(this.tripId(), proposal.id);
      this.proposals.update((list) => list.filter((p) => p.id !== proposal.id));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  dietLabel(tag: string): string {
    return dietLabels[tag] ?? tag;
  }

  mapsUrl(proposal: ProposalDto): string | null {
    return proposal.location_lat !== null && proposal.location_lon !== null
      ? Places.googleMapsUrl(proposal.location_lat, proposal.location_lon)
      : null;
  }
}
