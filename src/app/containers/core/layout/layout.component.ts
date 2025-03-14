import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [FooterComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
