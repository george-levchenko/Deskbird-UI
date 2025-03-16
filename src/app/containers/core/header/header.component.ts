import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUsername } from '../../../store/auth/auth.selectors';
import { Tooltip } from 'primeng/tooltip';
import { userLogout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, Tooltip],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly store = inject(Store);

  readonly username = this.store.selectSignal(selectUsername);

  logout(): void {
    this.store.dispatch(userLogout());
  }
}
