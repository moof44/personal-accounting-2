import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorizedLayoutComponent } from '@shared/layout/authorized-layout/authorized-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthorizedLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'personal-accounting-2';
}
