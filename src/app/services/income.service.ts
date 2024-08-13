import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
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


}
