import { Component, input, output, signal } from '@angular/core';
import { ProposalDto, proposalStatusLabels } from '../../../core/models/proposal.dto';
import { Votes } from '../../../core/services/votes';
import { getErrorMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-proposal-vote',
  styleUrl: './proposal-vote.scss',
  templateUrl: './proposal-vote.html',
})
export class ProposalVote {
  proposal = input.required<ProposalDto>();
  changed = output<ProposalDto>();

  statusLabels = proposalStatusLabels;
  sending = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private votes: Votes) {}

  // clicking the same option again removes the vote
  async vote(value: 1 | -1): Promise<void> {
    const proposal = this.proposal();
    this.sending.set(true);
    this.errorMessage.set(null);
    try {
      const updated =
        proposal.my_vote === value
          ? await this.votes.remove(proposal.id)
          : await this.votes.vote(proposal.id, value);
      this.changed.emit(updated);
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.sending.set(false);
    }
  }
}
