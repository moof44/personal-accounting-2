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
import { LoadingService } from '@app/core/loading/loading.service';
import { NotificationService } from '@app/core/notification/notification.service';
import { Expense } from '@app/models/expense.model';
import { finalize, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing expenses with Firestore.
 */
export class ExpenseService {
  private _expenseCollectionName = 'expense';
  private _expenseCollection!: CollectionReference;
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Observable stream of expense data from Firestore.
   */
  readonly expenseCollectionData$: Observable<Expense[]>;

  /**
   * Constructor for ExpenseService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._expenseCollection = collection(
      this._firestore,
      this._expenseCollectionName
    );
    this.expenseCollectionData$ = collectionData(this._expenseCollection, {
      idField: 'id',
    }) as Observable<Expense[]>;
  }

  /**
   * Saves a new expense to Firestore.
   * @param data - Partial expense data to save.
   * @returns An observable that emits the DocumentReference of the saved expense.
   */
  save(data: Partial<Expense>) {
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._expenseCollection, data)
        .then((documentReference: DocumentReference) => {
          return documentReference;
        })
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing expense in Firestore.
   * @param id - ID of the expense to update.
   * @param data - Partial expense data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Expense>) {
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
    return from(
      updateDoc(docRef, data).catch((e) => {
        this.#notificationService.showNotification('update', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes an expense from Firestore.
   * @param id - ID of the expense to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
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
}
