import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { EllipsisPipe } from '../../utils/pipes/ellipsis.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [Card, TableModule, ButtonDirective, Tooltip, EllipsisPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly isAdmin = signal(false);
  readonly users = signal<User[]>([]);

  ngOnInit() {
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
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '5', username: 'Omgmgmgmg', password: '1234563', isAdmin: false },
    ]);
  }

  editUser(user: User) {
    console.log(user);
    // @ToDo open dialog
  }
}
