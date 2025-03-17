import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './utils/services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);

  ngOnInit(): void {
    if (!this.authService.isTokenExpired()) {
      const token = this.authService.getSessionToken() as string;
      const decodedToken = this.authService.decodeToken(this.authService.getSessionToken()!);
      this.store.dispatch(AuthActions.userLoginSuccess({ token, username: decodedToken?.username, isAdmin: decodedToken?.isAdmin }));
    }
  }
}
