import { inject, Injectable } from '@angular/core';
import { ParentFeatureService } from '@app/core/service-parent/parent-feature.service';
import { Expense } from '@app/models/expense.model';
import { Purchase } from '@app/models/purchase.model';
import { ExpenseStore } from '@app/shared/store/expense.store';
import { PurchaseStore } from '@app/shared/store/purchase.store';

@Injectable()
export class LiabilityFeatureService extends ParentFeatureService{

  private expenseStore = inject(ExpenseStore);
  private purchaseStore = inject(PurchaseStore);

  constructor() { 
    super();
  }

  createExpense(expenseData: Expense) {
    return this.expenseStore.addExpense(expenseData);
  }

  createPurchase(purchaseData: Purchase) {
    return this.purchaseStore.addPurchase(purchaseData);
  }
  
  createWidthdraw(){} // to add
}
