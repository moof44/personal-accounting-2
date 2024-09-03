import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Summary } from '@app/models/summary.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService { 

  private _summaryCollectionName = 'summary';
  private _summaryCollection!: CollectionReference;
  readonly summaryCollectionData$:Observable<Summary[]>;


  constructor(private _firestore: Firestore) { 
    this._summaryCollection = collection(this._firestore, this._summaryCollectionName)
    this.summaryCollectionData$ = (collectionData(this._summaryCollection, {idField: 'id'}) as Observable<Summary[]>)
  }

}
