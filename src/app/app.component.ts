import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorizedLayoutComponent } from '@shared/layout/authorized-layout/authorized-layout.component';
import { IncomeStore } from './shared/store/income.store';
import { Firestore } from '@angular/fire/firestore';
import { ShortcutCommandComponent } from './shared/components/shortcut-command/shortcut-command.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthorizedLayoutComponent,
    ShortcutCommandComponent,
  ],
  providers: [
    IncomeStore,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  readonly store = inject(IncomeStore);
  title = 'personal-accounting-2';

  constructor(private _firestore: Firestore){
  }

  ngOnInit(): void {
    this.store.loadIncome('');
    
  }
}
