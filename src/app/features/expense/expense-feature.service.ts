import { Injectable } from '@angular/core';
import { ParentFeatureService } from '@app/core/service-parent/parent-feature.service';

@Injectable()
export class ExpenseFeatureService extends ParentFeatureService{

  constructor() { 
    super();
  }

}
