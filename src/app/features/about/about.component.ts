import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, type OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';

@Component({
  selector: 'feature-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;


  ngOnInit(): void { }

}
