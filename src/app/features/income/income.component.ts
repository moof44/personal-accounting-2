import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IncomeStore } from '@app/shared/store/income.store';
import { AddIncomeComponent } from './pages/add-income/add-income.component';
import { ListIncomeComponent } from './pages/list-income/list-income.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'feature-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListIncomeComponent,
    AddIncomeComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;

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
    console.log('currentUrl', this.route.snapshot?.url);
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
