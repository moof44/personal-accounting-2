import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, ViewChild, viewChild, type OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncomeStore } from '@app/shared/store/income.store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { PreventSpaceTriggerDirectiveDirective } from '@app/shared/directives/prevent-space-trigger-directive.directive';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MediaMatcher } from '@angular/cdk/layout';


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
  ],
  templateUrl: './list-income.component.html',
  styleUrl: './list-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListIncomeComponent implements OnInit, AfterViewInit {
  readonly store = inject(IncomeStore);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  search = this._fb.control('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  itemsPerPage = signal(5)
  pageSizeOptions = signal([5, 10, 25]);

  displayedColumns: string[] = ['date', 'incomeSource', 'amount'/* , 'remarks' */];
  dataSource = this.store.filteredEntities; // dataSource = input.required<Income[]>() // in case this will be a separate component
  readonly range = this._fb.group({
    start: null,
    end: null,
  });

  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    //this.dataSource.set(this.store.entities());
    this.#_eventListener();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(event => {
      this.store.setCurrentPage(event.pageIndex + 1);
      this.store.setItemsPerPage(event.pageSize);
    });
  }

  #_eventListener(){
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(v => {
        this.store.setQueryFilter(v ?? '');
      });

    this.range.valueChanges.subscribe(value => {
      this.store.setDateRangeFilter(value.start!, value.end!);
    });
  }

  onRowClick(id: number) {
    this._router.navigate(['/income/update', id]);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  clearDatePicker() {
    this.range.patchValue({ start: null, end: null });
  }

}
