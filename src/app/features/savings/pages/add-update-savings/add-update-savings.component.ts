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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SavingsStore } from '@app/shared/store/savings.store'; // Update import
import { SavingsFeatureService } from '../../savings-feature.service'; // Update import
import { PageStateStore } from '@app/global/store/page-state.store';
import { DeleteConfirmationComponent } from '@app/shared/dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-add-update-savings', // Update selector
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
  templateUrl: './add-update-savings.component.html', // Update templateUrl
  styleUrls: [
    './add-update-savings.component.scss',
    '/src/app/core/page-parent/add-update-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateSavingsComponent implements OnInit { // Update component name
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _savingsStore = inject(SavingsStore); // Inject SavingsStore
  readonly #dialog = inject(MatDialog);
  readonly #savingsFeatureService = inject(SavingsFeatureService); // Inject SavingsFeatureService
  readonly pageStateStore = inject(PageStateStore);

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Meralo', Validators.required], // Consider changing the default value
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.savingsId = id; // Update property name
  }

  savingsId = ''; // Update property name

  constructor() {
    effect(() => {
      if (this.#savingsFeatureService.deleteTrigger() === true) // Update method call
        this.deleteDialog();
      this.initFormGroup();
    });
  }

  initFormGroup() {
    const savings = this._savingsStore // Use _savingsStore
      .entities()
      .find((v) => v.id === this.savingsId)!; // Use savingsId
    this.formGroup.patchValue(savings as any);
  }

  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/savings']); // Update navigation path
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.savingsId) { // Check savingsId
        this._savingsStore // Use _savingsStore
          .updateSavings(this.savingsId, this.formGroup.value as any) // Use updateSavings
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._savingsStore // Use _savingsStore
          .addSavings(this.formGroup.value as any) // Use addSavings
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
      // Handle form errors if needed
    }
  }

  deleteSavings() { // Update method name
    if (this.savingsId) { // Check savingsId
      this._savingsStore.deleteSavings(this.savingsId).subscribe((v) => { // Use deleteSavings
        this.goBack();
      });
    }
  }

  deleteDialog() {
    const dialogRef = this.#dialog.open(DeleteConfirmationComponent, {
      data: this.formGroup.value.description,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.deleteSavings(); // Update method call
      }
    });
  }
}
