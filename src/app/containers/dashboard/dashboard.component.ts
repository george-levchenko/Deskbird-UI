import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { EllipsisPipe } from '../../utils/pipes/ellipsis.pipe';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, TableModule, Tooltip, EllipsisPipe, ButtonDirective, ConfirmPopupModule, DialogModule],
  providers: [ConfirmationService],
})
export class DashboardComponent implements OnInit {
  readonly isAdmin = signal(false);
  readonly users = signal<User[]>([]);

  readonly confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    //   @Todo Receive isAdmin from Auth
    this.isAdmin.set(true);

    //   @Todo Action to receive users and receive them throw select
    this.users.set([
      { id: '1', username: 'George', password: '123456dsadasdsadsadadsadasda123456dsadasdsadsadadsadasdasdasdasdassdasdasdas', isAdmin: true },
      { id: '2', username: 'George2', password: '1234567', isAdmin: true },
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '5', username: 'Omgmgmgmg', password: '1234563', isAdmin: false },
    ]);
  }

  createUser(): void {
    // @ToDo open dialog
  }

  editUser(user: User): void {
    console.log(user);
    // @ToDo open dialog
  }

  deleteUser(event: Event, user: User): void {
    // Known issue with miss-alignment of popup on smaller screens
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        console.log(user);
        //ToDo delete user action
      },
    });
  }
}
