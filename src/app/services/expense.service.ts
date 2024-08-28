import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Expense } from '@app/models/expense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private _expenseCollectionName = 'expense';
  private _expenseCollection!: CollectionReference;

  readonly expenseCollectionData$:any;

  constructor(private _firestore: Firestore) { 
    this._expenseCollection = collection(this._firestore, this._expenseCollectionName)
    this.expenseCollectionData$ = (collectionData(this._expenseCollection, {idField: 'id'}) as Observable<Expense[]>)
  }

  save(data:Partial<Expense>){
    //if(!data) return;
    return addDoc(this._expenseCollection, data).then((documentReference: DocumentReference) => {
      return documentReference;
    }).catch(e=>{return null})
  }

  update(id: string, data: Partial<Expense>){ // Add id parameter
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
    return updateDoc(docRef, data)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

  delete(id:string){
    const docRef = doc(this._firestore, this._expenseCollectionName, id);
    return deleteDoc(docRef)
      .then(e=>{return e})
      .catch(e=>{return null}); // Use the DocumentReference in updateDoc
  }

}
