import { Injectable } from '@angular/core';
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
import { Capital } from '@app/models/capital.model';
import { finalize, from, Observable } from 'rxjs';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { inject } from '@angular/core';
import { NotificationService } from '@app/global/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing capital with Firestore.
 */
export class CapitalService {
  private _capitalCollectionName = 'capital'; // Assuming 'capital' is your collection name
  private _capitalCollection!: CollectionReference;

  readonly capitalCollectionData$: Observable<Capital[]>;
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Constructor for CapitalService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._capitalCollection = collection(
      this._firestore,
      this._capitalCollectionName
    );
    this.capitalCollectionData$ = collectionData(this._capitalCollection, {
      idField: 'id',
    }) as Observable<Capital[]>;
  }

  /**
   * Saves a new capital entry to Firestore.
   * @param data - Partial capital data to save.
   * @returns An observable that emits the DocumentReference of the saved capital entry.
   */
  save(data: Partial<Capital>) {
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._capitalCollection, data)
        .then((documentReference: DocumentReference) => documentReference)
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing capital entry in Firestore.
   * @param id - ID of the capital entry to update.
   * @param data - Partial capital data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Capital>) {
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._capitalCollectionName, id);
    return from(
      updateDoc(docRef, data)
        .catch((e) => {
          this.#notificationService.showNotification('update', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes a capital entry from Firestore.
   * @param id - ID of the capital entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._capitalCollectionName, id);
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
