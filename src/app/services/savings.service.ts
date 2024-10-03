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
import { Savings } from '@app/models/savings.model'; // Update import
import { finalize, from, Observable } from 'rxjs';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { NotificationService } from '@app/global/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing savings with Firestore.
 */
export class SavingsService { // Update class name
  private _savingsCollectionName = 'savings'; // Update collection name
  private _savingsCollection!: CollectionReference; // Update variable name

  readonly savingsCollectionData$: Observable<Savings[]>; // Update observable name and type
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Constructor for SavingsService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._savingsCollection = collection( // Update variable name
      this._firestore,
      this._savingsCollectionName
    );
    this.savingsCollectionData$ = collectionData(this._savingsCollection, { // Update variable name
      idField: 'id',
    }) as Observable<Savings[]>; // Update type
  }

  /**
   * Saves a new savings entry to Firestore.
   * @param data - Partial savings data to save.
   * @returns An observable that emits the DocumentReference of the saved savings entry.
   */
  save(data: Partial<Savings>) { // Update method name and type
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
  update(id: string, data: Partial<Savings>) { // Update method name and type
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._savingsCollectionName, id); // Update variable name
    return from(
      updateDoc(docRef, data)
        .catch((e) => {
          this.#notificationService.showNotification('update', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes a savings entry from Firestore.
   * @param id - ID of the savings entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) { // Update method name
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
}
