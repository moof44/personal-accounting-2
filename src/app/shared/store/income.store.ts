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

export interface Income{ 
    date: Date | string;
    incomeSource: string;
    amount: number;
    remarks: string;
}