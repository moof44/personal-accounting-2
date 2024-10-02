import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
import { PageStateStore } from '@app/global/store/page-state.store';
import { IncomeStore } from '@app/shared/store/income.store';
import { IncomeFeatureService } from '../../income-feature.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/global/notification/notification.service';
import { DeleteConfirmationComponent } from '@app/shared/dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-add-update-income',
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
  templateUrl: './add-update-income.component.html',
  styleUrls: [
    './add-update-income.component.scss', 
    '/src/app/core/page-parent/add-update-page.component.scss'
  ], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateIncomeComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _incomeStore = inject(IncomeStore);
  readonly #dialog = inject(MatDialog);
  readonly #incomeFeatureService = inject(IncomeFeatureService);
  readonly pageStateStore = inject(PageStateStore);


  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    incomeSource: ["Aga's Detailing", Validators.required],
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.incomeId = id;
    const income = this._incomeStore.entities().find((v) => v.id === id)!;
    this.formGroup.patchValue(income as any);
  }

  incomeId = '';

  constructor(){
    effect(()=>{
      if(this.#incomeFeatureService.deleteTrigger() === true)
        this.deleteDialog();
    })
  }

  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/income']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.incomeId) {
        this._incomeStore
          .updateIncome(this.incomeId, this.formGroup.value as any)
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._incomeStore
          .addIncome(this.formGroup.value as any)
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
    }
  }

  deleteIncome() {
    if (this.incomeId) {
      this._incomeStore.deleteIncome(this.incomeId).subscribe((v) => {
        this.goBack();
      })
    }
  }

  deleteDialog() {
    const dialogRef = this.#dialog.open(DeleteConfirmationComponent, {
      data: this.formGroup.value.incomeSource,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.deleteIncome();
      }
    });
  }
}
