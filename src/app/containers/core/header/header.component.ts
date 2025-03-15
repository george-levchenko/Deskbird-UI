import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
