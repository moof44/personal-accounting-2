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
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { ExpenseFeatureService } from './expense-feature.service';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';


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
    CommonButtonComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    ExpenseFeatureService,
  ],
  templateUrl: './expense.component.html',
  styleUrls: [
    './expense.component.scss', 
    '/src/app/core/page-parent/page-parent.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent extends PageParentComponent implements OnInit {
  readonly store = inject(ExpenseStore);
  readonly expenseFeatureService = inject(ExpenseFeatureService);
  title = 'Expense';

  constructor(
    private route: ActivatedRoute,
  ){
    super();
  }

  ngOnInit(): void { 
    this.setPageType();
  }

  triggerDelete(){
    this.expenseFeatureService.setDeleteState();
  }
}
