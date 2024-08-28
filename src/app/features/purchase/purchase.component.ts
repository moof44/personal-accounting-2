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
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;

  readonly store = inject(PurchaseStore);
  title = 'Purchase';
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void { 
    const currentUrl = this.route.snapshot?.url[0]?.path;
    if(currentUrl === '/purchase/add'){
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
    if (page === '/purchase/add') return 'add';
    if (page.startsWith('/purchase/update/')) return 'update';
    return 'list';
  }

}
