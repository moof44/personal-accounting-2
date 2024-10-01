import { computed, inject, Injectable, signal } from '@angular/core';
import { Expense } from '@app/models/expense.model';
import { Purchase } from '@app/models/purchase.model';
import { ExpenseStore } from '@app/shared/store/expense.store';
import { PurchaseStore } from '@app/shared/store/purchase.store';
import { LiabilityFeatureState } from './liability-feature.model';

@Injectable()
export class LiabilityFeatureService {

  private expenseStore = inject(ExpenseStore);
  private purchaseStore = inject(PurchaseStore);
  readonly pageState = signal<LiabilityFeatureState>({delete:false});
  deleteTrigger = computed(()=>this.pageState().delete)

  constructor() { }

  createExpense(expenseData: Expense) {
    return this.expenseStore.addExpense(expenseData);
  }

  createPurchase(purchaseData: Purchase) {
    return this.purchaseStore.addPurchase(purchaseData);
  }
  
  createWidthdraw(){} // to add

  setDeleteState(){
    this.pageState.set({delete:true})
    setTimeout(()=>{ // automatically set it to false
      this.pageState.set({delete:false})
    }, 1000)
  }
}
