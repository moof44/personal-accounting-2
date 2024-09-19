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
import { Liability } from '../models/liability.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { NotificationService } from '@app/core/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing liability with Firestore.
 */
export class LiabilityService {
  private _liabilityCollectionName = 'liability';
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
  constructor(private _firestore: Firestore) {
    this._liabilityCollection = collection(
      this._firestore,
      this._liabilityCollectionName
    );
    this.liabilityCollectionData$ = collectionData(
      this._liabilityCollection,
      {
        idField: 'id',
      }
    ) as Observable<Liability[]>;
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
}
