export type ProposalType = 'activity' | 'restaurant';

export interface ProposalRequest {
  type: ProposalType;
  title: string;
  description: string | null;
  cost: number | null;
  location: string | null;
  location_lat: number | null;
  location_lon: number | null;
  diet_tags: string[];
}

export interface ProposalDto extends ProposalRequest {
  id: string;
  created_by: { id: string; name: string; surname: string; alias: string };
  created_at: string;
  can_delete: boolean;
  incompatible_diets: { tag: string; people: number }[];
  votes_for: number;
  votes_against: number;
  my_vote: 1 | -1 | null;
  status: ProposalStatus;
}

export type ProposalStatus = 'accepted' | 'rejected' | 'pending';

export const proposalStatusLabels: Record<ProposalStatus, string> = {
  accepted: 'Aceptada',
  pending: 'Pendiente',
  rejected: 'Rechazada',
};

export const proposalTypeLabels: Record<ProposalType, string> = {
  activity: 'Actividad',
  restaurant: 'Restaurante',
};
