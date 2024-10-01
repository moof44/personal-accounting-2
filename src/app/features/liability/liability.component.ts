import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { LiabilityStore } from '@app/shared/store/liability.store'; // Import LiabilityStore
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { ListLiabilityComponent } from './pages/list-liability/list-liability.component'; // Import ListLiabilityComponent
import { AddUpdateLiabilityComponent } from './pages/add-update-liability/add-update-liability.component'; // Import AddUpdateLiabilityComponent
import { LiabilityFeatureService } from './liability-feature.service';
import { MatIconModule } from '@angular/material/icon';
import { PageType } from '@app/models/global.model';
import { PageStateStore } from '@app/global/store/page-state.store';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';


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
  animations: [
    pageComponentAnimation,
  ],
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

  getCurrentPage(page:string): PageType {
    if (page === '/liability/add') return 'add'; // Update route check
    if (page.startsWith('/liability/update/')) return 'update'; // Update route check
    return 'list';
  }

  triggerDelete(){
    this.liabilityFeatureService.setDeleteState();
  }

}
