import { computed, inject, Signal } from '@angular/core';
import { TableSettings } from '@app/models/global.model';
import { Purchase } from '@app/models/purchase.model';
import { PurchaseService } from '@app/services/purchase.service'; 
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
import { from, map, pipe, switchMap, take } from 'rxjs';

function withPurchaseSettings() {
  return signalStoreFeature(
    withState<TableSettings>({
      title: 'Purchase',
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
  entities: Signal<Purchase[]>, 
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

    if (filter.startDate() && filter.endDate()) {
      const startDate = normalizeDate(filter.startDate()!);
      const endDate = normalizeDate(filter.endDate()!);
      const purchaseDate = normalizeDate(v.date as Date); 
      isDateRange = purchaseDate >= startDate && purchaseDate <= endDate;
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

export const PurchaseStore = signalStore(
  withEntities<Purchase>(),
  withPurchaseSettings(),
  withHooks({
    onInit(store) {
      // You can add initialization logic here if needed
    },
    onDestroy(store) {},
  }),
  withComputed(({ entities, filter }) => ({
    count: computed(() => withFilterEntities(entities, filter, false).length),
    filteredEntities: computed(() => {
      return withFilterEntities(entities, filter);
    }),
  })),
  withMethods((store, purchaseService = inject(PurchaseService)) => ({ 
    loadPurchase: rxMethod<any>( 
      pipe(
        switchMap(() => {
          return purchaseService.purchaseCollectionData$.pipe( 
            map((purchases: any[]) =>
              purchases.map((v) => ({ ...v, date: v.date.toDate() })) 
            ),
            tapResponse({
              next: (purchases) => {
                patchState(store, setAllEntities(purchases as any[]));
              },
              error: () => console.error,
              complete: () => {},
            })
          );
        })
      )
    ),
    addPurchase: (data: Partial<Purchase>) => {
      return purchaseService.save(data); 
    },
    updatePurchase: (id: string, data: Partial<Purchase>) => {
      return purchaseService.update(id, data); 
    },
    deletePurchase: (id: string) => {
      return purchaseService.delete(id);
    },
    setQueryFilter: (query: string) => {
      patchState(store, { filter: { ...store.filter(), query } }); 
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
