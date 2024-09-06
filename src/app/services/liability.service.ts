import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Liability } from '../models/liability';

@Injectable({
  providedIn: 'root',
})
export class LiabilityService {
  liabilityCollection: any;

  constructor(private firestore: Firestore) {
    this.liabilityCollection = collection(this.firestore, 'liability');
  }

  get liabilityCollectionData$(): Observable<Liability[]> {
    return collectionData(this.liabilityCollection, { idField: 'id' }) as Observable<
      Liability[]
    >;
  }

  getLiabilityById(id: string): Observable<Liability> {
    const liabilityDocRef = doc(this.firestore, `liability/${id}`);
    return docData(liabilityDocRef, { idField: 'id' }) as Observable<Liability>;
  }

  save(liability: Partial<Liability>) {
    return from(addDoc(this.liabilityCollection, liability));
  }

  update(id: string, data: Partial<Liability>) {
    const liabilityDocRef = doc(this.firestore, `liability/${id}`);
    return from(updateDoc(liabilityDocRef, data));
  }

  delete(id: string) {
    const liabilityDocRef = doc(this.firestore, `liability/${id}`);
    return from(deleteDoc(liabilityDocRef));
  }
}
