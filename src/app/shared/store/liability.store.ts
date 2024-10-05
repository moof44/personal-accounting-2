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

import { computed, inject, Signal } from '@angular/core';
import { Expense } from '@app/models/expense.model';
import { TableSettings } from '@app/models/global.model';
import { Liability, PaymentHistory } from '@app/models/liability.model';
import { Purchase } from '@app/models/purchase.model';
import { LiabilityService } from '@app/services/liability.service';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap } from 'rxjs';

function withLiabilitySettings() {
  return signalStoreFeature(
    withState<TableSettings>({
      title: 'Liability',
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

function withFilterEntities(
  entities: Signal<Liability[]>, 
  filter:any,
  withPagination=true,
) {
  const allEntities = entities().filter(v=>{
    const search = v.description + v.remarks;
    const isQuery = search.toLowerCase().includes(filter.query().toLowerCase())
    let isDateRange = true;

    const normalizeDate = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    // Assuming Liability model has a 'date' property, adjust accordingly if not
    if (filter.startDate() && filter.endDate()) {
      const startDate = normalizeDate(filter.startDate()!);
      const endDate = normalizeDate(filter.endDate()!);
      const liabilityDate = normalizeDate(v.date as Date); 
      isDateRange = liabilityDate >= startDate && liabilityDate <= endDate;
    };

    return isQuery && isDateRange;
  });

  if(withPagination){
    const startIndex = (filter.currentPage() - 1) * filter.itemsPerPage();
    const endIndex = startIndex + filter.itemsPerPage();
    return allEntities.slice(startIndex, endIndex);
  }
  return allEntities;
}

export const LiabilityStore = signalStore(
  withEntities<Liability>(),
  withLiabilitySettings(),
  withHooks({
    onInit(store) {},
    onDestroy(store) {},
  }),
  withComputed(({ entities, filter }) => ({
    count: computed(() => withFilterEntities(entities, filter, false).length),
    filteredEntities: computed(() => {
      return withFilterEntities(entities, filter);
    }),
  })),
  withMethods((store, liabilityService = inject(LiabilityService)) => ({ // Inject LiabilityService
    loadLiability: rxMethod<any>( 
      pipe(
        switchMap(() => {
          return liabilityService.liabilityCollectionData$.pipe( // Assuming liabilityCollectionData$ exists
            map((liabilities: any[]) =>
              liabilities.map((v) => ({ ...v, date: v.date.toDate() })) // Adjust if 'date' is not a property
            ),
            tapResponse({
              next: (liabilities) => {
                patchState(store, setAllEntities(liabilities as any[]));
              },
              error: () => console.error,
              complete: () => {},
            })
          );
        })
      )
    ),
    addLiability: (data: Partial<Liability>) => {
      return liabilityService.save(data); 
    },
    updateLiability: (id: string, data: Partial<Liability>) => {
      return liabilityService.update(id, data); 
    },
    deleteLiability: (id: string) => {
      return liabilityService.delete(id); 
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
    },
    saveExpenseAndLiability: (expense: Partial<Expense>, liability: Partial<Liability>, paymentHistory: PaymentHistory) => {
      return liabilityService.saveExpenseAndSavings(expense, liability, paymentHistory);
    },
    savePurchaseAndLiability: (purchase: Partial<Purchase>, liability: Partial<Liability>, paymentHistory: PaymentHistory) => {
      return liabilityService.savePurchaseAndSavings(purchase, liability, paymentHistory);
    },
    updateExpenseAndLiability: (expenseId: string, expense: Partial<Expense>, liabilityId: string, liability: Partial<Liability>) => {
      return liabilityService.updateExpenseAndSavings(expenseId, expense, liabilityId, liability);
    },
    updatePurchaseAndLiability: (purchaseId: string, purchase: Partial<Purchase>, liabilityId: string, liability: Partial<Liability>) => {
      return liabilityService.updatePurchaseAndSavings(purchaseId, purchase, liabilityId, liability);
    },
    deleteExpenseAndLiability: (expenseId: string, liabilityId: string) => {
      return liabilityService.deleteExpenseAndSavings(expenseId, liabilityId);
    },
    deletePurchaseAndLiability: (purchaseId: string, liabilityId: string) => {
      return liabilityService.deletePurchaseAndSavings(purchaseId, liabilityId);
    },
  }))
);
