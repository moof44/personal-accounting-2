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
  viewChild,
  type OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncomeStore } from '@app/shared/store/income.store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { PreventSpaceTriggerDirectiveDirective } from '@app/shared/directives/prevent-space-trigger-directive.directive';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonTableComponent } from '@app/shared/components/common-table/common-table.component';
import {
  FilterSettings,
  Income,
  IncomeSettings,
  Pagination,
  TableFilter,
} from '@app/models/global.model';

@Component({
  selector: 'page-list-income',
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
  templateUrl: './list-income.component.html',
  styleUrl: './list-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListIncomeComponent implements OnInit, AfterViewInit {
  readonly store = inject(IncomeStore);
  private _router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  itemsPerPage = signal(5);
  pageSizeOptions = signal([5, 10, 25]);

  #defaultColumns = [
    { column: 'date', header: 'Date', type: 'date' },
    { column: 'incomeSource', header: 'Income Source' },
    { column: 'amount', header: 'Amount' },
  ];
  #additionalColumn = { column: 'remarks', header: 'Remarks' };
  displayedColumns = signal(this.#defaultColumns);

  dataSource: Signal<Income[]> = signal([]);
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

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {}

  rowClick = (id: number) => this._router.navigate(['/income/update', id]);

  onPageChange({ current, pageSize }: Pagination) {
    this.store.setCurrentPage(current);
    this.store.setItemsPerPage(pageSize);
  }

  setFilter = ({ type, value }: TableFilter) =>
    type == 'search'
      ? this.store.setQueryFilter(value)
      : this.store.setDateRangeFilter(value.start!, value.end!);


}
