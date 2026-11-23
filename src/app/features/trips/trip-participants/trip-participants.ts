import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { ParticipantDto } from '../../../core/models/participant.dto';
import { Participants } from '../../../core/services/participants';
import { getErrorMessage } from '../../../core/utils/api-error';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-trip-participants',
  styleUrl: './trip-participants.scss',
  templateUrl: './trip-participants.html',
})
export class TripParticipants implements OnInit {
  tripId = input.required<string>();
  isOwner = input(false);
  changed = output<void>();

  participants = signal<ParticipantDto[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  inviting = signal(false);

  identifier = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  inviteForm = new FormGroup({ identifier: this.identifier });

  currentUserId: string | null;

  constructor(
    private participantsService: Participants,
    private auth: Auth,
    private router: Router,
  ) {
    this.currentUserId = this.auth.getUserId();
  }

  async ngOnInit() {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      this.participants.set(await this.participantsService.getAll(this.tripId()));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  async invite(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (this.identifier.invalid) {
      this.identifier.markAsTouched();
      return;
    }

    this.inviting.set(true);
    try {
      const participant = await this.participantsService.invite(
        this.tripId(),
        this.identifier.value.trim(),
      );
      this.participants.update((list) => [...list, participant]);
      this.successMessage.set(`${participant.name} ya forma parte del viaje`);
      this.identifier.reset();
      this.changed.emit();
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.inviting.set(false);
    }
  }

  async remove(participant: ParticipantDto): Promise<void> {
    if (!confirm(`¿Quitar a ${participant.name} ${participant.surname} del viaje?`)) {
      return;
    }
    await this.delete(participant.user_id, () => {
      this.participants.update((list) => list.filter((p) => p.user_id !== participant.user_id));
      this.changed.emit();
    });
  }

  async leave(): Promise<void> {
    if (!confirm('¿Seguro que quieres salir del viaje? Dejarás de verlo.')) {
      return;
    }
    await this.delete(this.currentUserId!, () => this.router.navigateByUrl('/dashboard'));
  }

  isMe(participant: ParticipantDto): boolean {
    return participant.user_id === this.currentUserId;
  }

  initials(participant: ParticipantDto): string {
    return (participant.name[0] + participant.surname[0]).toUpperCase();
  }

  private async delete(userId: string, onSuccess: () => void): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    try {
      await this.participantsService.remove(this.tripId(), userId);
      onSuccess();
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }
}
