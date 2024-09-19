import { Injectable, signal } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { messagePatterns, NotificationType } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = signal<{
    message: string;
    type: NotificationType;
    config?: MatSnackBarConfig;
  } | null>(null);

  constructor(private snackBar: MatSnackBar) {}

  showNotification(
    patternKey: string,
    type: NotificationType,
    config?: MatSnackBarConfig,
    subject?: string
  ) {
    const messageFn = messagePatterns[patternKey]?.[type];
    const message = messageFn ? messageFn(subject) : 'Unknown action';
    this.notification.set({ message, type, config });
  }
}


// type of notification
// 