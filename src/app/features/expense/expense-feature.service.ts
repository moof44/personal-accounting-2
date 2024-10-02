import { Injectable } from '@angular/core';
import { ParentFeatureService } from '@app/core/service-parent/parent-feature.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseFeatureService extends ParentFeatureService{

  constructor() { 
    super();
  }

}
