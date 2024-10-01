import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'common-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './common-button.component.html',
  styleUrl: './common-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonButtonComponent implements OnInit {
  type = input('submit');
  routerLink = input('');
  ngOnInit(): void { }

}
