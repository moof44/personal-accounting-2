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
import { Purchase } from '@app/models/purchase.model';
import { finalize, from, Observable } from 'rxjs';
import { LoadingService } from '@app/global/directives/loading/loading.service';
import { NotificationService } from '@app/global/notification/notification.service';
import { CollectionNames } from '@app/models/global.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing purchases with Firestore.
 */
export class PurchaseService {
  private _purchaseCollectionName = CollectionNames.purchase;
  private _purchaseCollection!: CollectionReference;
  #loadingService = inject(LoadingService);
  #notificationService = inject(NotificationService);

  /**
   * Observable stream of purchase data from Firestore.
   */
  readonly purchaseCollectionData$: Observable<Purchase[]>;

  /**
   * Constructor for PurchaseService.
   * @param _firestore - Firestore instance.
   */
  constructor(private _firestore: Firestore) {
    this._purchaseCollection = collection(
      this._firestore,
      this._purchaseCollectionName
    );
    this.purchaseCollectionData$ = collectionData(
      this._purchaseCollection,
      {
        idField: 'id',
      }
    ) as Observable<Purchase[]>;
  }

  /**
   * Saves a new purchase entry to Firestore.
   * @param data - Partial purchase data to save.
   * @returns An observable that emits the DocumentReference of the saved purchase entry.
   */
  save(data: Partial<Purchase>) {
    this.#loadingService.setLoading(true, 'Saving...');
    return from(
      addDoc(this._purchaseCollection, data)
        .then((documentReference: DocumentReference) => {
          return documentReference;
        })
        .catch((e) => {
          this.#notificationService.showNotification('create', 'error');
        })
    ).pipe(this.#finalize());
  }

  /**
   * Updates an existing purchase entry in Firestore.
   * @param id - ID of the purchase entry to update.
   * @param data - Partial purchase data to update.
   * @returns An observable that emits void on successful update.
   */
  update(id: string, data: Partial<Purchase>) {
    this.#loadingService.setLoading(true, 'Updating...');
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
    return from(
      updateDoc(docRef, data).catch((e) => {
        this.#notificationService.showNotification('update', 'error');
      })
    ).pipe(this.#finalize());
  }

  /**
   * Deletes a purchase entry from Firestore.
   * @param id - ID of the purchase entry to delete.
   * @returns An observable that emits void on successful deletion.
   */
  delete(id: string) {
    this.#loadingService.setLoading(true, 'Deleting...');
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
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
