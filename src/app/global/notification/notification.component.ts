import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div *ngIf="notification()" [ngClass]="notification()?.type">
      {{ notification()?.message }}
    </div>
  `,
  styles: [
    `
      .success {
        color: lightgreen;
      }
      .error {
        color: lightcoral;
      }
      .warning {
        color: lightyellow;
      }
      .info {
        color: lightblue;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {
  notification = inject(NotificationService).notification;
  // snackBar = inject(MatSnackBar);
  
  ngOnInit(): void { }

}
