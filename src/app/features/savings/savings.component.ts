import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';
import { SavingsStore } from '@app/shared/store/savings.store'; // Import SavingsStore
import { ListSavingsComponent } from './pages/list-savings/list-savings.component'; // Import ListSavingsComponent
import { AddUpdateSavingsComponent } from './pages/add-update-savings/add-update-savings.component'; // Import AddUpdateSavingsComponent
import { SavingsFeatureService } from './savings-feature.service'; // Import SavingsFeatureService

@Component({
  selector: 'feature-savings', // Update selector
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListSavingsComponent, // Add ListSavingsComponent
    AddUpdateSavingsComponent, // Add AddUpdateSavingsComponent
    CommonButtonComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    SavingsFeatureService, // Provide SavingsFeatureService
  ],
  templateUrl: './savings.component.html', // Update templateUrl
  styleUrls: [
    './savings.component.scss', // Update styleUrls
    '/src/app/core/page-parent/page-parent.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingsComponent extends PageParentComponent implements OnInit { // Update component name
  readonly store = inject(SavingsStore); // Inject SavingsStore
  readonly savingsFeatureService = inject(SavingsFeatureService); // Inject SavingsFeatureService
  title = 'Savings'; // Update title

  constructor(
    private route: ActivatedRoute,
  ){
    super();
  }

  ngOnInit(): void { 
    this.setPageType();
  }

  triggerDelete(){
    this.savingsFeatureService.setDeleteState(); // Update method call
  }

}
