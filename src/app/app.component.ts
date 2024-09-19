import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { pageComponentAnimation } from '@shared/animations/general-animations';
import { ShortcutCommandComponent } from '@shared/components/shortcut-command/shortcut-command.component';
import { AuthorizedLayoutComponent } from '@shared/layout/authorized-layout/authorized-layout.component';
import { IncomeStore } from '@shared/store/income.store';
import { NotificationService } from './core/notification/notification.service';
import { PageNotFoundComponent } from "./features/page-not-found/page-not-found.component";
import { CapitalStore } from './shared/store/capital.store';
import { ExpenseStore } from './shared/store/expense.store';
import { LiabilityStore } from './shared/store/liability.store';
import { PurchaseStore } from './shared/store/purchase.store';
import { SummaryStore } from './shared/store/summary.store';
import { NotificationComponent } from './core/notification/notification.component';
import { LoadingSpinnerComponent } from './core/loading/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AuthorizedLayoutComponent,
    ShortcutCommandComponent,
    PageNotFoundComponent,
    LoadingSpinnerComponent,
],
  providers: [
    IncomeStore,
    ExpenseStore,
    CapitalStore,
    PurchaseStore, 
    SummaryStore,
    LiabilityStore,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    pageComponentAnimation,
  ],
})
export class AppComponent implements OnInit{
  readonly #incomeStore = inject(IncomeStore);
  readonly #expenseStore = inject(ExpenseStore);
  readonly #capitalStore = inject(CapitalStore);
  readonly #purchaseStore = inject(PurchaseStore);
  readonly #summaryStore = inject(SummaryStore);
  readonly #liabilityStore = inject(LiabilityStore);
  readonly #notification = inject(NotificationService);
  #snackBar = inject(MatSnackBar);
  //title = 'personal-accounting-2';

  isNotFound = true;

  constructor(
    private _router: Router,
  ){
    this._router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.isNotFound =  event.urlAfterRedirects === '/page-not-found'; 
      }
    });

    effect(()=>{
      const currentNotification = this.#notification.notification();
      if(currentNotification){
        //this.#snackBar.open(currentNotification.message, undefined, currentNotification.config);
        // check if config has duration property
        let config = currentNotification.config;
        if(!config) config = {};
        if(!currentNotification.config?.duration) config.duration = 4000;
        this.#snackBar.openFromComponent(NotificationComponent, {
          ...config,
          data: currentNotification,
        })
      }
    })

  }

  ngOnInit(): void {
    this.#loadStores();
  }

  #loadStores(){
    this.#incomeStore.loadIncome('');
    this.#expenseStore.loadExpense('');
    this.#capitalStore.loadCapital('');
    this.#purchaseStore.loadPurchase('');
    this.#summaryStore.loadSummary('');
    this.#liabilityStore.loadLiability('');
  }
}
