import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IncomeStore } from '@app/shared/store/income.store';
import { AddUpdateIncomeComponent } from './pages/add-update-income/add-update-income.component';
import { ListIncomeComponent } from './pages/list-income/list-income.component';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';

@Component({
  selector: 'feature-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListIncomeComponent,
    AddUpdateIncomeComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;

  // displayedColumns: string[] = ['date', 'incomeSource', 'amount', 'remarks'];
  readonly store = inject(IncomeStore);
  title = 'Income';
  //currentRoute = '';
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){
  }

  ngOnInit(): void {
    const currentUrl = this.route.snapshot?.url[0]?.path;
    if(currentUrl === '/income/add'){
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
    if (page === '/income/add') return 'add';
    if (page.startsWith('/income/update/')) return 'update';
    return 'list';
  }

}
