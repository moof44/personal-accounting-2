import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ExpenseStore } from '@app/shared/store/expense.store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ListExpenseComponent } from './pages/list-expense/list-expense.component';
import { AddUpdateExpenseComponent } from './pages/add-update-expense/add-update-expense.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';


@Component({
  selector: 'feature-expense',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListExpenseComponent,
    AddUpdateExpenseComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;

  readonly store = inject(ExpenseStore);
  title = 'Expense';
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void { 
    const currentUrl = this.route.snapshot?.url[0]?.path;
    if(currentUrl === '/expense/add'){
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
    if (page === '/expense/add') return 'add';
    if (page.startsWith('/expense/update/')) return 'update';
    return 'list';
  }

}
