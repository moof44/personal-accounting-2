import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Purchase } from '@app/models/purchase.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private _purchaseCollectionName = 'purchase'; // Assuming 'purchase' is your collection name
  private _purchaseCollection!: CollectionReference;

  readonly purchaseCollectionData$:any;
  

  constructor(private _firestore: Firestore) { 
    this._purchaseCollection = collection(this._firestore, this._purchaseCollectionName)
    this.purchaseCollectionData$ = (collectionData(this._purchaseCollection, {idField: 'id'}) as Observable<Purchase[]>)
  }

  save(data:Partial<Purchase>){
    //if(!data) return;
    return addDoc(this._purchaseCollection, data).then((documentReference: DocumentReference) => {
      return documentReference;
    }).catch(e=>{return null})
  }

  update(id: string, data: Partial<Purchase>){ // Add id parameter
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
    return updateDoc(docRef, data)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

  delete(id:string){
    const docRef = doc(this._firestore, this._purchaseCollectionName, id);
    return deleteDoc(docRef)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

}
