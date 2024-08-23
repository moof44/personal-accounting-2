import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, type OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'feature-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;

  ngOnInit(): void { }

}
