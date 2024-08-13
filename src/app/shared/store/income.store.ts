/**
 * How to create a signalStore
 * 1. create a model / type / interface
 * 2. create an initial state
 * 3. create a signalStore variable (for export)
 *      * in signalStore, add the following
 *      3.1 withState - this is the initial state
 *      3.2 withComputed - this is where we will get the state as computed (processed)
 *      3.3 withMethods - this is where we will define the actions or operations that we want our store to execute
 *          * note of the patchState, we often use it here in methods
 *      3.4 withHooks - use this if you want to have a lifecycle tracing like onInit and onDestroy
 *      3.5 watchState - you can use this for tracking all the changes that happens in the store
 *          * can be used inside lifeCycle or outside as well
 *      3.6 effect - use when there is an effect needed but will only track the latest changed value not all if multiple changes was done in one tick
 *      3.7 withEntities - use this to create enity like this: withEntities<Todo>()
 *          * google entity updaters for this
 *      3.8 rxMethod - rxjs way of managing sideEffects see (https://ngrx.io/guide/signals/rxjs-integration#reactive-methods-without-arguments)
 *      3.9 conside the ff: tapResponse
 */

import { inject, Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Income, IncomeSettings } from '@app/models/global.model';
import { patchState, signalStore, signalStoreFeature, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { addEntity, setAllEntities, updateAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, map, Observable, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { IncomeService } from '@app/services/income.service';

let _incomeCollection!: CollectionReference;

function withIncomeSettings(){
    return signalStoreFeature(
        withState<IncomeSettings>({title: 'Income'})
    )
}

// const loadIncome = rxMethod<void>(
//     pipe(
//         tap(),
//         exhaustMap(()=>{

//         }) 
//     )
// )

export const IncomeStore = signalStore(
    withEntities<Income>(),
    withIncomeSettings(),
    withHooks({
        onInit(store){
            watchState(store, (state)=> console.log)
        },
        onDestroy(store){}
    }),
    withMethods((store, incomeService = inject(IncomeService))=>({
        loadIncome: rxMethod<any>(
            pipe(
                switchMap(()=>{
                    return incomeService.incomeCollectionData$
                        .pipe(
                            map((incomes:any[])=>incomes.map(v=>({...v, date: v.date.toDate()}))),
                            tapResponse({
                                next: (incomes)=>{
                                    patchState(store, setAllEntities(incomes as any[]))
                                },
                                error: ()=>{},
                                complete: ()=>{},
                            })
                        )
                })
            )
        )
    })
    )
)
