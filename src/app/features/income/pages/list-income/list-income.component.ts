import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
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
  ],
  templateUrl: './list-income.component.html',
  styleUrl: './list-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListIncomeComponent implements OnInit {
  readonly store = inject(IncomeStore);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  search = this._fb.control('');

  displayedColumns: string[] = ['date', 'incomeSource', 'amount'/* , 'remarks' */];
  dataSource = this.store.filteredEntities; // dataSource = input.required<Income[]>() // in case this will be a separate component
  readonly range = this._fb.group({
    start: null,
    end: null,
  });

  ngOnInit(): void {
    //this.dataSource.set(this.store.entities());
    this.#_eventListener();
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
