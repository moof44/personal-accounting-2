import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { PageType } from '@app/models/global.model';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { LiabilityStore } from '@app/shared/store/liability.store'; // Import LiabilityStore
import { LiabilityFeatureService } from './liability-feature.service';
import { AddUpdateLiabilityComponent } from './pages/add-update-liability/add-update-liability.component'; // Import AddUpdateLiabilityComponent
import { ListLiabilityComponent } from './pages/list-liability/list-liability.component'; // Import ListLiabilityComponent

@Component({
  selector: 'feature-liability', // Update selector
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule, 
    ListLiabilityComponent, // Use ListLiabilityComponent
    AddUpdateLiabilityComponent, // Use AddUpdateLiabilityComponent
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    LiabilityFeatureService,
  ],
  templateUrl: './liability.component.html', // Update templateUrl
  styleUrl: './liability.component.scss', // Update styleUrl
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiabilityComponent extends PageParentComponent implements OnInit { // Update component name
  readonly store = inject(LiabilityStore); // Inject LiabilityStore
  title = 'Liability'; // Update title
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private router: Router,
    private liabilityFeatureService: LiabilityFeatureService,
  ){
    super();
  }

  ngOnInit(): void { 
    //this.currentPage.set(this.getCurrentPage(this.router.url))
    this.pageStateStore.setType(this.getCurrentPage(this.router.url))

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //this.currentPage.set(this.getCurrentPage(event.urlAfterRedirects));
        this.pageStateStore.setType(this.getCurrentPage(event.urlAfterRedirects))
      }
    });
  }

  triggerDelete(){
    this.liabilityFeatureService.setDeleteState();
  }

}
