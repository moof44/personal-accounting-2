import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Income } from '@app/models/global.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private _incomeCollectionName = 'income';
  private _incomeCollection!: CollectionReference;

  readonly incomeCollectionData$:any;
  

  constructor(private _firestore: Firestore) { 
    this._incomeCollection = collection(this._firestore, this._incomeCollectionName)
    this.incomeCollectionData$ = (collectionData(this._incomeCollection, {idField: 'id'}) as Observable<Income[]>)
  }

  save(data:Partial<Income>){
    //if(!data) return;
    return addDoc(this._incomeCollection, data).then((documentReference: DocumentReference) => {
      console.log('save docRef', documentReference);
      return documentReference;
    }).catch(e=>{return null})
  }

  update(id: string, data: Partial<Income>){ // Add id parameter
    const docRef = doc(this._firestore, this._incomeCollectionName, id);
    return updateDoc(docRef, data)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

  delete(id:string){
    const docRef = doc(this._firestore, this._incomeCollectionName, id);
    return deleteDoc(docRef)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

}
