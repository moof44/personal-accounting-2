import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CapitalStore } from '@app/shared/store/capital.store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { ListCapitalComponent } from './pages/list-capital/list-capital.component';
import { AddUpdateCapitalComponent } from './pages/add-update-capital/add-update-capital.component';


@Component({
  selector: 'feature-capital',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListCapitalComponent,
    AddUpdateCapitalComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './capital.component.html',
  styleUrl: './capital.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapitalComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;

  readonly store = inject(CapitalStore);
  title = 'Capital';
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void { 
    const currentUrl = this.route.snapshot?.url[0]?.path;
    if(currentUrl === '/capital/add'){
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
    if (page === '/capital/add') return 'add';
    if (page.startsWith('/capital/update/')) return 'update';
    return 'list';
  }

}
