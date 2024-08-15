import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-income',
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
  templateUrl: './add-income.component.html',
  styleUrl: './add-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIncomeComponent implements OnInit {

  private _fb = inject(FormBuilder);
  private _router = inject(Router)

  formGroup = this._fb.group({
    date: [new Date(), Validators.required],
    incomeSource: ['', Validators.required],
    amount: [0, Validators.required],
    remarks: '',
  })

  ngOnInit(): void { }

  goBack(){
    this._router.navigate(['/income']);
  }

}
