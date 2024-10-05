import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
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
import { Savings } from '@app/models/savings.model'; // Update import
import {
  Pagination,
  TableFilter
} from '@app/models/global.model';
import { CommonTableComponent } from '@app/shared/components/common-table/common-table.component';
import { PreventSpaceTriggerDirectiveDirective } from '@app/shared/directives/prevent-space-trigger-directive.directive';
import { SavingsStore } from '@app/shared/store/savings.store'; // Update import

@Component({
  selector: 'app-list-savings', // Update selector
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
  templateUrl: './list-savings.component.html', // Update templateUrl
  styleUrl: './list-savings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSavingsComponent implements OnInit { // Update component name
  readonly store = inject(SavingsStore); // Inject SavingsStore
  private _router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Update columns based on Savings model
  #defaultColumns = [
    { column: 'date', header: 'Date', type: 'date' },
    { column: 'description', header: 'Source' },
    { column: 'amount', header: 'Amount' },
  ];
  #additionalColumn = { column: 'remarks', header: 'Remarks' };

  displayedColumns = signal(this.#defaultColumns);
  itemsPerPage = signal(5);
  pageSizeOptions = signal([5, 10, 25]);
  dataSource: Signal<Savings[]> = signal([]); // Update type
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

  rowClick = (id: number) => this._router.navigate(['/savings/update', id]); // Update navigation path

  onPageChange({ current, pageSize }: Pagination) {
    this.store.setCurrentPage(current);
    this.store.setItemsPerPage(pageSize);
  }

  setFilter = ({ type, value }: TableFilter) =>
    type == 'search'
      ? this.store.setQueryFilter(value)
      : this.store.setDateRangeFilter(value.start!, value.end!);

}
