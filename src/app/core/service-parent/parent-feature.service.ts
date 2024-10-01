import { Injectable, computed, signal } from '@angular/core';
import { ServiceFeatureState } from '@app/models/global.model';

/**
 * @class ParentService
 * @description A service that manages the state of a feature.
 */
@Injectable()
export class ParentFeatureService {
  /**
   * @property {Signal<ServiceFeatureState>} pageState - A signal that holds the state of the feature.
   * @description The initial state is set to `{delete:false}`.
   */
  readonly pageState = signal<ServiceFeatureState>({delete:false});

  /**
   * @property {ComputedRef<boolean>} deleteTrigger - A computed property that returns the value of the `delete` property of the `pageState` signal.
   */
  deleteTrigger = computed(()=>this.pageState().delete)

  /**
   * @method setDeleteState
   * @description Sets the `delete` property of the `pageState` signal to `true` for 1 second, then sets it back to `false`.
   */
  setDeleteState(){
    this.pageState.set({delete:true})
    setTimeout(()=>{ // automatically set it to false
      this.pageState.set({delete:false})
    }, 300)
  }
}
