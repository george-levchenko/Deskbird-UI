import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
