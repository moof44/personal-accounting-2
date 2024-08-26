import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ExpenseStore } from '@app/shared/store/expense.store';

@Component({
  selector: 'app-add-update-expense',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-update-expense.component.html',
  styleUrl: './add-update-expense.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateExpenseComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _expenseStore = inject(ExpenseStore);

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ["Meralo", Validators.required],
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.expenseId = id;
    const expense = this._expenseStore.entities().find((v) => v.id === id)!;
    this.formGroup.patchValue(expense as any);
  }

  expenseId = '';

  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/expense']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.expenseId) {
        this._expenseStore
          .updateExpense(this.expenseId, this.formGroup.value as any)
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._expenseStore
          .addExpense(this.formGroup.value as any)
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
    }
  }

  deleteExpense() {
    if (this.expenseId) {
      this._expenseStore.deleteExpense(this.expenseId).subscribe((v) => {
        this.goBack();
      })
    }
  }

}
