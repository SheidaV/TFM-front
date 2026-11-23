import { ProposalStatus, ProposalType } from './proposal.dto';

export interface ItineraryProposal {
  id: string;
  title: string;
  type: ProposalType;
  location: string | null;
  cost: number | null;
  status: ProposalStatus;
}

export interface ItineraryItem {
  id: string;
  start_time: string;
  end_time: string;
  proposal: ItineraryProposal;
}

export interface ItineraryDay {
  date: string;
  outside_trip: boolean;
  items: ItineraryItem[];
}

export interface ItineraryDto {
  can_edit: boolean;
  days: ItineraryDay[];
  available: ItineraryProposal[];
}

export interface ItinerarySlot {
  date: string;
  start_time: string;
  end_time: string;
}
