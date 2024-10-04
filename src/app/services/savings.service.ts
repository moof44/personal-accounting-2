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
  WriteBatch,
  writeBatch,
} from '@angular/fire/firestore';
import { Savings } from '@app/models/savings.model'; // Update import
import { catchError, finalize, from, Observable } from 'rxjs';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { NotificationService } from '@app/global/notification/notification.service';
import { CollectionNames } from '@app/models/global.model';
import { Purchase } from '@app/models/purchase.model';
import { Expense } from '@app/models/expense.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing savings with Firestore.
 */
export class SavingsService {
  // Update class name
  private _savingsCollectionName = CollectionNames.savings; // Update collection name
  private _purchaseCollectionName = CollectionNames.purchase;
  private _expenseCollectionName = CollectionNames.expense;
  private _savingsCollection!: CollectionReference; // Update variable name
  private _batch!: WriteBatch;

  readonly savingsCollectionData$: Observable<Savings[]>; // Update observable name and type
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Constructor for SavingsService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._savingsCollection = collection(
      // Update variable name
      this._firestore,
      this._savingsCollectionName
    );
    this.savingsCollectionData$ = collectionData(this._savingsCollection, {
      // Update variable name
      idField: 'id',
    }) as Observable<Savings[]>; // Update type
  }

  /**
   * Saves a new savings entry to Firestore.
   * @param data - Partial savings data to save.
   * @returns An observable that emits the DocumentReference of the saved savings entry.
   */
  save(data: Partial<Savings>) {
    // Update method name and type
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._savingsCollection, data) // Update variable name
        .then((documentReference: DocumentReference) => documentReference)
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing savings entry in Firestore.
   * @param id - ID of the savings entry to update.
   * @param data - Partial savings data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Savings>) {
    // Update method name and type
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._savingsCollectionName, id); // Update variable name
    return from(
      updateDoc(docRef, data).catch((e) => {
        this.#notificationService.showNotification('update', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes a savings entry from Firestore.
   * @param id - ID of the savings entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    // Update method name
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._savingsCollectionName, id); // Update variable name
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

  // BASIC BATCH CODES

  startBatch() {
    this._batch = writeBatch(this._firestore);
  }

  // Savings Batch Operations

  setBatchSavings(data: Partial<Savings>) {
    const docRef = doc(collection(this._firestore, this._savingsCollectionName));
    this._batch.set(docRef, data);
    return docRef.id;
  }

  updateBatchSavings(id: string, data: Partial<Savings>) {
    const docRef = doc(this._firestore, this._savingsCollectionName, id);
    this._batch.update(docRef, data);
  }

  deleteBatchSavings(id: string) {
    const docRef = doc(this._firestore, this._savingsCollectionName, id);
    this._batch.delete(docRef);
  }

  // Expense Batch Operations
  setBatchExpense(data: Partial<Expense>) {
    const docRef = doc(collection(this._firestore, this._expenseCollectionName));
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
    const docRef = doc(collection(this._firestore, this._purchaseCollectionName));
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

  endBatch(type: 'create' | 'update' | 'delete' = 'create') {
    return from(
        this._batch.commit()
        .then((resp: any) => resp)
        .catch((e) => {
          this.#notificationService.showNotification(type, 'error');
        })
      )
      .pipe(this.#finalize());
  }

  // END BASIC BATCH CODES

  // BATCH CODES COMBINATIONS
  saveExpenseAndSavings(expense: Partial<Expense>, savings: Partial<Savings>){
    this.startBatch();
    const expenseId = this.setBatchExpense(expense);
    savings.foreignId = expenseId;
    this.setBatchSavings(savings);
    return this.endBatch('create');
  }

  savePurchaseAndSavings(purchase: Partial<Purchase>, savings: Partial<Savings>){
    this.startBatch();
    const purchaseId = this.setBatchPurchase(purchase);
    savings.foreignId = purchaseId;
    this.setBatchSavings(savings);
    return this.endBatch('create');
  }

  updateExpenseAndSavings(expenseId: string, expense: Partial<Expense>, savingsId: string, savings: Partial<Savings>){
    this.startBatch();
    this.updateBatchExpense(expenseId, expense);
    savings.foreignId = expenseId;
    this.updateBatchSavings(savingsId, savings)
    return this.endBatch('update');
  }

  updatePurchaseAndSavings(purchaseId: string, purchase: Partial<Purchase>, savingsId: string, savings: Partial<Savings>){
    this.startBatch();
    this.updateBatchPurchase(purchaseId, purchase);
    savings.foreignId = purchaseId;
    this.updateBatchSavings(savingsId, savings)
    return this.endBatch('update');
  }

  deleteExpenseAndSavings(expenseId: string, savingsId: string){
    this.startBatch();
    this.deleteBatchExpense(expenseId);
    this.deleteBatchSavings(savingsId);
    return this.endBatch('delete');
  }

  deletePurchaseAndSavings(purchaseId:string, savingsId: string){
    this.startBatch();
    this.deleteBatchPurchase(purchaseId);
    this.deleteBatchSavings(savingsId);
    return this.endBatch('delete');
  }

  // END BATCH CODES COMBINATIONS
}
