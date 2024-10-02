import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PurchaseStore } from '@app/shared/store/purchase.store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ListPurchaseComponent } from './pages/list-purchase/list-purchase.component';
import { AddUpdatePurchaseComponent } from './pages/add-update-purchase/add-update-purchase.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { PurchaseFeatureService } from './purchase-feature.service';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';


@Component({
  selector: 'feature-purchase',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListPurchaseComponent,
    AddUpdatePurchaseComponent,
    CommonButtonComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    PurchaseFeatureService,
  ],
  templateUrl: './purchase.component.html',
  styleUrls: [
    './purchase.component.scss', 
    '/src/app/core/page-parent/page-parent.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent extends PageParentComponent implements OnInit {
  readonly store = inject(PurchaseStore);
  readonly purchaseFeatureService = inject(PurchaseFeatureService);
  title = 'Purchase';

  constructor(
    private route: ActivatedRoute,
  ){
    super();
  }

  ngOnInit(): void { 
    this.setPageType();
  }

  triggerDelete(){
    this.purchaseFeatureService.setDeleteState();
  }

}
