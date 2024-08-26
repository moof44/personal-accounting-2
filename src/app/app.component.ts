import { Component, inject, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { AuthorizedLayoutComponent } from '@shared/layout/authorized-layout/authorized-layout.component';
import { pageComponentAnimation } from '@shared/animations/general-animations';
import { ShortcutCommandComponent } from '@shared/components/shortcut-command/shortcut-command.component';
import { IncomeStore } from '@shared/store/income.store';
import { ExpenseStore } from './shared/store/expense.store';

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
    ExpenseStore,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    pageComponentAnimation,
  ],
})
export class AppComponent implements OnInit{
  readonly incomeStore = inject(IncomeStore);
  readonly expenseStore = inject(ExpenseStore);
  title = 'personal-accounting-2';

  constructor(private _firestore: Firestore){
  }

  ngOnInit(): void {
    this.#loadStores();
  }

  #loadStores(){
    this.incomeStore.loadIncome('');
    this.expenseStore.loadExpense('');
  }
}
