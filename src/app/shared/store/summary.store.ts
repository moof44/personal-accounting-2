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

import { computed, inject } from '@angular/core';
import { ParsedSummary, Summary } from '@app/models/summary.model';
import { SummaryService } from '@app/services/summary.service';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, Observable, pipe, switchMap } from 'rxjs';

export const SummaryStore = signalStore(
  withState<Summary>({
    netIncome: 0,
    remainingCapital: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalPurchases: 0,
    totalCapital: 0,
  }),
  withHooks({
    onInit(store) {
      //watchState(store, (state) => console.log);
    },
    onDestroy(store) {},
  }),
  withComputed((store)=>({
    parsedSummary: computed(()=>{
      const summary: ParsedSummary[] = [];
      summary.push({item: 'Total Income', total: store.totalIncome()});
      summary.push({item: 'Total Expense', total: store.totalExpense()});
      summary.push({item: 'Net Income', total: store.netIncome(), class: 'net-item'});
      summary.push({item: 'Total Capital', total: store.totalCapital()});
      summary.push({item: 'Total Purchases', total: store.totalPurchases()});
      summary.push({item: 'Remaining Capital', total: store.remainingCapital(), class: 'net-item'});

      return summary;
    })
  })),
  withMethods((store, summaryService = inject(SummaryService)) => ({
    loadSummary: rxMethod<any>( 
      pipe(
        switchMap(() => {
          return summaryService.summaryCollectionData$.pipe(
            tapResponse({
              next: (summary: Summary[]) => {
                console.log('summary', summary)
                patchState(store, summary[0]);
              },
              error: () => console.error,
              complete: () => {},
            })
          );
        })
      )
    ),
  }))
);
