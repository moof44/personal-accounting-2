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
import { Income } from '@app/models/income.model';
import { finalize, from, Observable } from 'rxjs';
import { LoadingService } from '@app/core/loading/loading.service';
import { NotificationService } from '@app/core/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing income with Firestore.
 */
export class IncomeService {
  private _incomeCollectionName = 'income';
  private _incomeCollection!: CollectionReference;
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Observable stream of income data from Firestore.
   */
  readonly incomeCollectionData$: Observable<Income[]>;

  /**
   * Constructor for IncomeService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._incomeCollection = collection(
      this._firestore,
      this._incomeCollectionName
    );
    this.incomeCollectionData$ = collectionData(this._incomeCollection, {
      idField: 'id',
    }) as Observable<Income[]>;
  }

  /**
   * Saves a new income entry to Firestore.
   * @param data - Partial income data to save.
   * @returns An observable that emits the DocumentReference of the saved income entry.
   */
  save(data: Partial<Income>) {
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._incomeCollection, data)
        .then((documentReference: DocumentReference) => {
          return documentReference;
        })
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing income entry in Firestore.
   * @param id - ID of the income entry to update.
   * @param data - Partial income data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Income>) {
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._incomeCollectionName, id);
    return from(
      updateDoc(docRef, data).catch((e) => {
        this.#notificationService.showNotification('update', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes an income entry from Firestore.
   * @param id - ID of the income entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._incomeCollectionName, id);
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
