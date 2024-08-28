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
import { CapitalStore } from '@app/shared/store/capital.store';

@Component({
  selector: 'app-add-update-capital',
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
  templateUrl: './add-update-capital.component.html',
  styleUrl: './add-update-capital.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateCapitalComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _capitalStore = inject(CapitalStore);

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Meralo', Validators.required], // Consider changing the default value
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.capitalId = id;
    const capital = this._capitalStore.entities().find((v) => v.id === id)!;
    this.formGroup.patchValue(capital as any);
  }

  capitalId = '';

  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/capital']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.capitalId) {
        this._capitalStore
          .updateCapital(this.capitalId, this.formGroup.value as any)
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._capitalStore
          .addCapital(this.formGroup.value as any)
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
      // Handle form errors if needed
    }
  }

  deleteCapital() {
    if (this.capitalId) {
      this._capitalStore.deleteCapital(this.capitalId).subscribe((v) => {
        this.goBack();
      });
    }
  }
}
