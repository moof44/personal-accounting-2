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
import { Income, IncomeSettings } from '@app/models/global.model';
import { IncomeService } from '@app/services/income.service';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, map, pipe, switchMap, take } from 'rxjs';

function withIncomeSettings() {
  return signalStoreFeature(
    withState<IncomeSettings>({
      title: 'Income',
      filter: { 
        query: '', 
        order: 'asc', 
        startDate: null, 
        endDate: null,
        currentPage: 1,
        itemsPerPage: 5
      },
    })
  );
}

export const IncomeStore = signalStore(
  withEntities<Income>(),
  withIncomeSettings(),
  withHooks({
    onInit(store) {
      watchState(store, (state) => console.log);
    },
    onDestroy(store) {},
  }),
  withComputed(({ entities, filter }) => ({
    count: computed(() => entities().length),
    filteredEntities: computed(() => {
      const allEntities = entities().filter(v=>{
        const search = v.incomeSource + v.remarks;
        const isQuery = search.toLowerCase().includes(filter.query().toLowerCase())
        let isDateRange = true;

        const normalizeDate = (date: Date) => {
          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          return normalized;
        };

        if (filter.startDate() && filter.endDate()) {
          const startDate = normalizeDate(filter.startDate()!);
          const endDate = normalizeDate(filter.endDate()!);
          const incomeDate = normalizeDate(v.date as Date);
          isDateRange = incomeDate >= startDate && incomeDate <= endDate;
        };

        return isQuery && isDateRange;
      });
      const startIndex = (filter.currentPage() - 1) * filter.itemsPerPage();
      const endIndex = startIndex + filter.itemsPerPage();
      return allEntities.slice(startIndex, endIndex);
    }),
  })),
  withMethods((store, incomeService = inject(IncomeService)) => ({
    loadIncome: rxMethod<any>(
      pipe(
        switchMap(() => {
          return incomeService.incomeCollectionData$.pipe(
            map((incomes: any[]) =>
              incomes.map((v) => ({ ...v, date: v.date.toDate() }))
            ),
            tapResponse({
              next: (incomes) => {
                patchState(store, setAllEntities(incomes as any[]));
              },
              error: () => console.error,
              complete: () => {},
            })
          );
        })
      )
    ),
    addIncome: (data: Partial<Income>) => {
      return from(incomeService.save(data)).pipe(take(1));
    },
    updateIncome: (id: string, data: Partial<Income>) => {
      return from(incomeService.update(id, data)).pipe(take(1));
    },
    deleteIncome: (id: string) => {
      return from(incomeService.delete(id)).pipe(take(1));
    },
    setQueryFilter: (query: string) => {
      patchState(store, { filter: { ...store.filter(), query } }); // Using spread operator
    },
    setOrderFilter: (order: 'asc' | 'desc') => {
      patchState(store, { filter: { ...store.filter(), order } });
    },
    setDateRangeFilter: (startDate: Date | null, endDate: Date | null) => {
      patchState(store, { filter: { ...store.filter(), startDate, endDate } });
    },
    setCurrentPage: (currentPage: number) => {
      patchState(store, { filter: { ...store.filter(), currentPage } });
    },
    setItemsPerPage: (itemsPerPage: number) => {
      patchState(store, { filter: { ...store.filter(), itemsPerPage } });
    }
  }))
);
