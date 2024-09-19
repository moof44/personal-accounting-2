import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PayLiabilityInputData, PayLiabilityOutputData } from '../dialog.model';

@Component({
  selector: 'app-pay-liability',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonToggleModule,
  ],
  templateUrl: './pay-liability.component.html',
  styleUrl: './pay-liability.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayLiabilityComponent implements OnInit {
  #fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<PayLiabilityComponent>);
  readonly data = inject<PayLiabilityInputData>(MAT_DIALOG_DATA);

  formGroup = this.#fb.group<PayLiabilityOutputData>({
    amount: 0,
    payFrom: 'cash',
  });

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  pay() {
    console.log('pay liability: ', this.formGroup.value);
    this.dialogRef.close(this.formGroup.value);
  }
}
