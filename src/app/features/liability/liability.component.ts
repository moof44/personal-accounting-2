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


@Component({
  selector: 'feature-liability', // Update selector
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListLiabilityComponent, // Use ListLiabilityComponent
    AddUpdateLiabilityComponent, // Use AddUpdateLiabilityComponent
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './liability.component.html', // Update templateUrl
  styleUrl: './liability.component.scss', // Update styleUrl
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiabilityComponent implements OnInit { // Update component name
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;

  readonly store = inject(LiabilityStore); // Inject LiabilityStore
  title = 'Liability'; // Update title
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void { 
    const currentUrl = this.route.snapshot?.url[0]?.path;
    if(currentUrl === '/liability/add'){ // Update route check
      this.currentPage.set('add');
    }else{
      this.currentPage.set('list');
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        const currentPage = this.getCurrentPage(currentRoute);
        this.currentPage.set(currentPage);
      }
    });
  }

  getCurrentPage(page:string): 'add'|'update'|'list' {
    if (page === '/liability/add') return 'add'; // Update route check
    if (page.startsWith('/liability/update/')) return 'update'; // Update route check
    return 'list';
  }

}
