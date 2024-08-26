import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Signal,
  signal,
  ViewChild,
  type OnInit
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Expense } from '@app/models/expense.model';
import {
  Pagination,
  TableFilter
} from '@app/models/global.model';
import { Income } from '@app/models/income.model';
import { CommonTableComponent } from '@app/shared/components/common-table/common-table.component';
import { PreventSpaceTriggerDirectiveDirective } from '@app/shared/directives/prevent-space-trigger-directive.directive';
import { ExpenseStore } from '@app/shared/store/expense.store';
import { IncomeStore } from '@app/shared/store/income.store';

@Component({
  selector: 'app-list-expense',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    PreventSpaceTriggerDirectiveDirective,
    MatPaginator,
    MatPaginatorModule,
    MatTooltipModule,
    CommonTableComponent,
  ],
  templateUrl: './list-expense.component.html',
  styleUrl: './list-expense.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListExpenseComponent implements OnInit {
  readonly store = inject(ExpenseStore);
  private _router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  #defaultColumns = [
    { column: 'date', header: 'Date', type: 'date' },
    { column: 'description', header: 'Description' },
    { column: 'amount', header: 'Amount' },
  ];
  #additionalColumn = { column: 'remarks', header: 'Remarks' };

  displayedColumns = signal(this.#defaultColumns);
  itemsPerPage = signal(5);
  pageSizeOptions = signal([5, 10, 25]);
  dataSource: Signal<Expense[]> = signal([]);
  filter = computed(() => this.store.filter());
  tooltipColumn = signal('remarks');

  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.#setMobileQuery();
    this._mobileQueryListener = () => {
      this.#setMobileQuery();
      changeDetectorRef.detectChanges()
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.dataSource = this.store.filteredEntities;
  }


  #setMobileQuery(){
    if(this.mobileQuery.matches) {
      this.displayedColumns.set(this.#defaultColumns);
      this.tooltipColumn.set('remarks');
    }else{
      this.displayedColumns.set(this.#defaultColumns.concat(this.#additionalColumn))
      this.tooltipColumn.set('');
    }
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  rowClick = (id: number) => this._router.navigate(['/expense/update', id]);

  onPageChange({ current, pageSize }: Pagination) {
    this.store.setCurrentPage(current);
    this.store.setItemsPerPage(pageSize);
  }

  setFilter = ({ type, value }: TableFilter) =>
    type == 'search'
      ? this.store.setQueryFilter(value)
      : this.store.setDateRangeFilter(value.start!, value.end!);

}
