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
import { UserFormComponent } from './user-form/user-form.component';
import { Store } from '@ngrx/store';
import { addUser, deleteUser, loadUsers, updateUser } from '../../store/users/users.actions';
import { selectUsers, selectUsersLoading } from '../../store/users/users.selectors';
import { Skeleton } from 'primeng/skeleton';
import { NgTemplateOutlet } from '@angular/common';
import { selectIsAdmin } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    TableModule,
    Tooltip,
    EllipsisPipe,
    ButtonDirective,
    ConfirmPopupModule,
    DialogModule,
    UserFormComponent,
    Skeleton,
    NgTemplateOutlet,
  ],
  providers: [ConfirmationService],
})
export class DashboardComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);

  // Get call delayed for 1s just to show this
  skeletonPlaceholder = new Array(5).fill({});

  readonly users = this.store.selectSignal(selectUsers);
  readonly selectUsersLoading = this.store.selectSignal(selectUsersLoading);
  readonly isAdmin = this.store.selectSignal(selectIsAdmin);
  readonly selectedUser = signal<User | null>(null);
  readonly userModalVisible = signal(false);

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
  }

  openUserModal(user?: User): void {
    this.selectedUser.set(user || null);
    this.userModalVisible.set(true);
  }

  closeUserModal(): void {
    this.userModalVisible.set(false);
    this.selectedUser.set(null);
  }

  createUser(user: User): void {
    this.store.dispatch(addUser({ user }));
    this.userModalVisible.set(false);
  }

  editUser(user: User): void {
    this.store.dispatch(updateUser({ user }));
    this.userModalVisible.set(false);
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
        this.store.dispatch(deleteUser({ id: user.id as string }));
      },
    });
  }
}
