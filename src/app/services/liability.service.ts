import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { finalize, from, Observable } from 'rxjs';
import { Liability, PaymentHistory } from '../models/liability.model';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { NotificationService } from '@app/global/notification/notification.service';
import { CollectionNames } from '@app/models/global.model';
import { ParentBatchExpensePurchaseService } from '@app/core/service-parent/parent-batch-expense-purchase.service';
import { Expense } from '@app/models/expense.model';
import { Purchase } from '@app/models/purchase.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing liability with Firestore.
 */
export class LiabilityService extends ParentBatchExpensePurchaseService {
  private _liabilityCollectionName = CollectionNames.liability;
  private _liabilityCollection!: CollectionReference;
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Observable stream of liability data from Firestore.
   */
  readonly liabilityCollectionData$: Observable<Liability[]>;

  /**
   * Constructor for LiabilityService.
   * @param _firestore - Firestore instance.
   */
  constructor() {
    super();
    this._liabilityCollection = collection(
      this._firestore,
      this._liabilityCollectionName
    );
    this.liabilityCollectionData$ = collectionData(this._liabilityCollection, {
      idField: 'id',
    }) as Observable<Liability[]>;
  }

  /**
   * Saves a new liability entry to Firestore.
   * @param data - Partial liability data to save.
   * @returns An observable that emits the DocumentReference of the saved liability entry.
   */
  save(data: Partial<Liability>) {
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._liabilityCollection, data)
        .then((documentReference: DocumentReference) => {
          return documentReference;
        })
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing liability entry in Firestore.
   * @param id - ID of the liability entry to update.
   * @param data - Partial liability data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Liability>) {
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._liabilityCollectionName, id);
    return from(
      updateDoc(docRef, data).catch((e) => {
        this.#notificationService.showNotification('update', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes a liability entry from Firestore.
   * @param id - ID of the liability entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._liabilityCollectionName, id);
    return from(
      deleteDoc(docRef).catch((e) => {
        this.#notificationService.showNotification('delete', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Finalizes the observable stream by resetting the loading state.
   * @returns An observable with finalize logic applied.
   */
  #finalize() {
    return finalize(() => this.#loadingService.setLoading(false));
  }

  // SAVINGS BATCH OPERATION

  setBatchLiability(data: Partial<Liability>) {
    const docRef = doc(
      collection(this._firestore, this._liabilityCollectionName)
    );
    this._batch.set(docRef, data);
    return docRef.id;
  }

  updateBatchLiability(id: string, data: Partial<Liability>) {
    const docRef = doc(this._firestore, this._liabilityCollectionName, id);
    this._batch.update(docRef, data);
  }

  deleteBatchLiability(id: string) {
    const docRef = doc(this._firestore, this._liabilityCollectionName, id);
    this._batch.delete(docRef);
  }

  // END SAVINGS BATCH OPERATION

  // BATCH CODES COMBINATIONS
  saveExpenseAndSavings(
    expense: Partial<Expense>,
    liability: Partial<Liability>,
    paymentHistory: PaymentHistory
  ) {
    this.startBatch();
    const expenseId = this.setBatchExpense(expense);
    paymentHistory.foreignId = expenseId;
    liability.paymentHistory!.push(paymentHistory);
    //this.setBatchLiability(liability);
    this.updateBatchLiability(liability.id!, liability);
    return this.endBatch('create');
  }

  savePurchaseAndSavings(
    purchase: Partial<Purchase>,
    liability: Partial<Liability>,
    paymentHistory: PaymentHistory
  ) {
    this.startBatch();
    const purchaseId = this.setBatchPurchase(purchase);
    paymentHistory.foreignId = purchaseId;
    liability.paymentHistory!.push(paymentHistory);
    this.updateBatchLiability(liability.id!, liability);
    return this.endBatch('create');
  }

  updateExpenseAndSavings(
    expenseId: string,
    expense: Partial<Expense>,
    savingsId: string,
    savings: Partial<Liability>
  ) {
    this.startBatch();
    this.updateBatchExpense(expenseId, expense);
    this.updateBatchLiability(savingsId, savings);
    return this.endBatch('update');
  }

  updatePurchaseAndSavings(
    purchaseId: string,
    purchase: Partial<Purchase>,
    savingsId: string,
    savings: Partial<Liability>
  ) {
    this.startBatch();
    this.updateBatchPurchase(purchaseId, purchase);
    this.updateBatchLiability(savingsId, savings);
    return this.endBatch('update');
  }

  deleteExpenseAndSavings(expenseId: string, savingsId: string) {
    this.startBatch();
    this.deleteBatchExpense(expenseId);
    this.deleteBatchLiability(savingsId);
    return this.endBatch('delete');
  }

  deletePurchaseAndSavings(purchaseId: string, savingsId: string) {
    this.startBatch();
    this.deleteBatchPurchase(purchaseId);
    this.deleteBatchLiability(savingsId);
    return this.endBatch('delete');
  }

  // END BATCH CODES COMBINATIONS
}
