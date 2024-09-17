import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewChild, type OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DisplayedColumns, FilterSettings, TableFilter } from '@app/models/global.model';
import { PreventSpaceTriggerDirectiveDirective } from '@app/shared/directives/prevent-space-trigger-directive.directive';
import { AutoFormatPipe } from '@app/shared/pipe/auto-format.pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'shared-common-table',
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
    AutoFormatPipe,
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonTableComponent implements OnInit, AfterViewInit {
  
  private _fb = inject(FormBuilder);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // TABLE RELATED
  dataSource = input.required<any[]>();
  displayedColumns = input.required<DisplayedColumns[]>();
  dataCount = input.required<number>();
  pageSizeOptions = input([5, 10, 25]);
  rowClick = input<(args?:any)=>void>(()=>{});
  tooltipColumn = input<string>();
  columns = computed(() =>
    this.displayedColumns().map((col) => col.column)
  );
  // PAGINATION RELATED
  itemsPerPage = signal(5)
  screensize = input<'mobile'|'desktop'>('desktop');
  pagination = output<{current: number, pageSize: number}>();
  // SEARCH RELATED
  filter = input<FilterSettings>();
  #searchInput = computed(()=>{
    this.search.setValue(this.filter()?.query || '');
    this.range.patchValue({
      start: this.filter()?.startDate as any,
      end: this.filter()?.endDate as any,
    });
  });
  search = this._fb.control('');
  readonly range = this._fb.group({
    start: null,
    end: null,
  });
  setFilter = output<TableFilter>();


  constructor(){
  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(event => {
      this.pagination.emit({current: event.pageIndex + 1, pageSize: event.pageSize});
    });
  }


  ngOnInit(): void { 
    this.#eventListener();
  }

  onRowClick(id:string){}

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  clearDatePicker() {
    this.range.patchValue({ start: null, end: null });
  }


  #eventListener(){
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(v => {
        this.setFilter.emit({type: 'search', value: v});
      });

    this.range.valueChanges.subscribe(value => {
      this.setFilter.emit({type: 'date-range', value: value});
    });

    this.#searchInput(); // this is to trigger the computed property
  }


}