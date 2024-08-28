import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Capital } from '@app/models/capital.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapitalService {
  private _capitalCollectionName = 'capital'; // Assuming 'capital' is your collection name
  private _capitalCollection!: CollectionReference;

  readonly capitalCollectionData$:any;
  

  constructor(private _firestore: Firestore) { 
    this._capitalCollection = collection(this._firestore, this._capitalCollectionName)
    this.capitalCollectionData$ = (collectionData(this._capitalCollection, {idField: 'id'}) as Observable<Capital[]>)
  }

  save(data:Partial<Capital>){
    //if(!data) return;
    return addDoc(this._capitalCollection, data).then((documentReference: DocumentReference) => {
      return documentReference;
    }).catch(e=>{return null})
  }

  update(id: string, data: Partial<Capital>){ // Add id parameter
    const docRef = doc(this._firestore, this._capitalCollectionName, id);
    return updateDoc(docRef, data)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

  delete(id:string){
    const docRef = doc(this._firestore, this._capitalCollectionName, id);
    return deleteDoc(docRef)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

}
