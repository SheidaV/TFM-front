export interface ParticipantDto {
  user_id: string;
  name: string;
  surname: string;
  alias: string;
  role: 'owner' | 'participant';
  joined_at: string;
}
