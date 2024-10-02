import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';
import { ExpenseStore } from '@app/shared/store/expense.store';
import { ExpenseFeatureService } from './expense-feature.service';
import { AddUpdateExpenseComponent } from './pages/add-update-expense/add-update-expense.component';
import { ListExpenseComponent } from './pages/list-expense/list-expense.component';


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
