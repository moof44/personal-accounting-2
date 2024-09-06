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
import { LiabilityStore } from '@app/shared/store/liability.store'; // Import LiabilityStore

@Component({
  selector: 'app-add-update-liability', // Update selector
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
  templateUrl: './add-update-liability.component.html', // Update templateUrl
  styleUrl: './add-update-liability.component.scss', // Update styleUrl
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateLiabilityComponent implements OnInit { // Update component name
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _liabilityStore = inject(LiabilityStore); // Inject LiabilityStore

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Meralo', Validators.required], 
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.liabilityId = id; // Update property name
    const liability = this._liabilityStore.entities().find((v) => v.id === id)!; // Use _liabilityStore
    this.formGroup.patchValue(liability as any);
  }

  liabilityId = ''; // Update property name

  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/liability']); // Update navigation path
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.liabilityId) { // Check liabilityId
        this._liabilityStore // Use _liabilityStore
          .updateLiability(this.liabilityId, this.formGroup.value as any) // Use updateLiability
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._liabilityStore // Use _liabilityStore
          .addLiability(this.formGroup.value as any) // Use addLiability
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
      // Handle form errors if needed
    }
  }

  deleteLiability() { // Update method name
    if (this.liabilityId) { // Check liabilityId
      this._liabilityStore.deleteLiability(this.liabilityId).subscribe((v) => { // Use _liabilityStore and deleteLiability
        this.goBack();
      });
    }
  }
}
