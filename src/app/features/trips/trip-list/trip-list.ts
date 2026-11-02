import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDto } from '../../../core/models/user.dto';
import { Users } from '../../../core/services/users';

@Component({
  imports: [RouterLink],
  selector: 'app-trip-list',
  styleUrl: './trip-list.scss',
  templateUrl: './trip-list.html',
})
export class TripList implements OnInit {
  user = signal<UserDto | null>(null);
  constructor(private users: Users) {}
  async ngOnInit() {
    this.user.set(await this.users.getMe());
  }
}
