import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  writeBatch,
  WriteBatch,
} from '@angular/fire/firestore';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { NotificationService } from '@app/global/notification/notification.service';
import { Expense } from '@app/models/expense.model';
import { CollectionNames } from '@app/models/global.model';
import { Purchase } from '@app/models/purchase.model';
import { finalize, from } from 'rxjs';

@Injectable()
export class ParentBatchExpensePurchaseService {
  protected _firestore = inject(Firestore);
  protected _purchaseCollectionName = CollectionNames.purchase;
  protected _expenseCollectionName = CollectionNames.expense;
  protected _batch!: WriteBatch;
  #notificationService = inject(NotificationService);
  #loadingService = inject(LoadingService);

  constructor() {}

  /**
   * Finalizes the observable stream by resetting the loading state.
   * @returns An observable with finalize logic applied.
   */
  #finalize() {
    return finalize(() => this.#loadingService.setLoading(false));
  }

  startBatch() {
    this._batch = writeBatch(this._firestore);
  }

  endBatch(type: 'create' | 'update' | 'delete' = 'create') {
    return from(
      this._batch
        .commit()
        .then((resp: any) => resp)
        .catch((e) => {
          this.#notificationService.showNotification(type, 'error');
        })
    ).pipe(this.#finalize());
  }

  // Expense Batch Operations
  setBatchExpense(data: Partial<Expense>) {
    const docRef = doc(
      collection(this._firestore, this._expenseCollectionName)
    );
    this._batch.set(docRef, data);
    return docRef.id;
  }

  updateBatchExpense(id: string, data: Partial<Expense>) {
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
    this._batch.update(docRef, data);
  }

  deleteBatchExpense(id: string) {
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
    this._batch.delete(docRef);
  }

  // Purchase Batch Operations
  setBatchPurchase(data: Partial<Purchase>) {
    const docRef = doc(
      collection(this._firestore, this._purchaseCollectionName)
    );
    this._batch.set(docRef, data);
    return docRef.id;
  }

  updateBatchPurchase(id: string, data: Partial<Purchase>) {
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
    this._batch.update(docRef, data);
  }

  deleteBatchPurchase(id: string) {
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
    this._batch.delete(docRef);
  }
}
