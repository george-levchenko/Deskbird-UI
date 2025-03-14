import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
