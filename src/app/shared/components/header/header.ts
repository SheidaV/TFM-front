import { Component, effect, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { UserDto } from '../../../core/models/user.dto';
import { Users } from '../../../core/services/users';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  loggedIn: Signal<boolean>;
  user = signal<UserDto | null>(null);

  constructor(
    private users: Users,
    private auth: Auth,
    private router: Router,
  ) {
    this.loggedIn = this.auth.loggedIn;

    effect(() => {
      if (this.loggedIn()) {
        this.loadUser();
      } else {
        this.user.set(null);
      }
    });
  }

  private async loadUser(): Promise<void> {
    try {
      this.user.set(await this.users.getMe());
    } catch {
      this.logout();
    }
  }

  get initials(): string {
    const user = this.user();
    return user ? (user.name[0] + user.surname[0]).toUpperCase() : '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
