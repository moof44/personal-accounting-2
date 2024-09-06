import { Component, inject, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { NavigationEnd, Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { AuthorizedLayoutComponent } from '@shared/layout/authorized-layout/authorized-layout.component';
import { pageComponentAnimation } from '@shared/animations/general-animations';
import { ShortcutCommandComponent } from '@shared/components/shortcut-command/shortcut-command.component';
import { IncomeStore } from '@shared/store/income.store';
import { ExpenseStore } from './shared/store/expense.store';
import { CapitalStore } from './shared/store/capital.store';
import { PurchaseStore } from './shared/store/purchase.store';
import { SummaryStore } from './shared/store/summary.store';
import { PageNotFoundComponent } from "./features/page-not-found/page-not-found.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AuthorizedLayoutComponent,
    ShortcutCommandComponent,
    PageNotFoundComponent,
],
  providers: [
    IncomeStore,
    ExpenseStore,
    CapitalStore,
    PurchaseStore, 
    SummaryStore,
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
  readonly capitalStore = inject(CapitalStore);
  readonly purchaseStore = inject(PurchaseStore);
  readonly summaryStore = inject(SummaryStore);

  title = 'personal-accounting-2';
  isNotFound = true;

  constructor(
    private _router: Router,
  ){
    console.log('isNotfound', this.isNotFound);
    this._router.events.subscribe(event => {
      console.log(event);
      if (event instanceof RoutesRecognized) {
        this.isNotFound =  event.urlAfterRedirects === '/page-not-found'; 
        console.log('isNotfound', this.isNotFound);
      }
    });
  }

  ngOnInit(): void {
    console.log('isNotfound', this.isNotFound);
    this.#loadStores();
  }

  #loadStores(){
    this.incomeStore.loadIncome('');
    this.expenseStore.loadExpense('');
    this.capitalStore.loadCapital('');
    this.purchaseStore.loadPurchase('');
    this.summaryStore.loadSummary('');
  }
}
