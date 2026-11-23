import { Component, computed, input, OnInit, signal } from '@angular/core';
import {
  ProposalDto,
  ProposalStatus,
  proposalStatusLabels,
  proposalTypeLabels,
} from '../../../core/models/proposal.dto';
import { Proposals } from '../../../core/services/proposals';
import { getErrorMessage } from '../../../core/utils/api-error';
import { ProposalVote } from '../proposal-vote/proposal-vote';

@Component({
  imports: [ProposalVote],
  selector: 'app-vote-results',
  styleUrl: './vote-results.scss',
  templateUrl: './vote-results.html',
})
export class VoteResults implements OnInit {
  tripId = input.required<string>();
  participants = input(1);

  proposals = signal<ProposalDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  statuses: ProposalStatus[] = ['pending', 'accepted', 'rejected'];
  statusLabels = proposalStatusLabels;
  typeLabels = proposalTypeLabels;

  missingVotes = computed(() => this.proposals().filter((p) => p.my_vote === null).length);

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

  byStatus(status: ProposalStatus): ProposalDto[] {
    return this.proposals()
      .filter((p) => p.status === status)
      .sort((a, b) => b.votes_for - a.votes_for);
  }

  percent(votes: number): number {
    return Math.round((votes / Math.max(this.participants(), 1)) * 100);
  }

  replace(updated: ProposalDto): void {
    this.proposals.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }
}
