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
import { MatSelectModule } from '@angular/material/select';
import { Savings, SavingsSource } from '@app/models/savings.model';
import { catchError, switchMap } from 'rxjs';
import { NotificationService } from '@app/global/notification/notification.service';

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
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-update-savings.component.html', // Update templateUrl
  styleUrls: [
    './add-update-savings.component.scss',
    '/src/app/core/page-parent/add-update-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateSavingsComponent implements OnInit {
  // Update component name
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _savingsStore = inject(SavingsStore); // Inject SavingsStore
  readonly #dialog = inject(MatDialog);
  readonly #savingsFeatureService = inject(SavingsFeatureService); // Inject SavingsFeatureService
  readonly #notificationService = inject(NotificationService);
  readonly pageStateStore = inject(PageStateStore);

  sourceOption: SavingsSource[] = [
    SavingsSource.Income,
    SavingsSource.Capital,
    SavingsSource.Others,
  ];

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['income', Validators.required], // Consider changing the default value
    amount: [1000, Validators.required],
    remarks: '',
    foreignId: '',
  });

  @Input()
  set id(id: string) {
    this.savingsId = id; // Update property name
  }

  savingsId = ''; // Update property name

  constructor() {
    effect(() => {
      if (this.#savingsFeatureService.deleteTrigger() === true)
        // Update method call
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
      const description = this.formGroup.value.description;
      const date = this.formGroup.value.date as Date;
      const amount = this.formGroup.value.amount as number;
      const remarks = this.formGroup.value.remarks as string;
      const foreignId = this.formGroup.value.foreignId as string;
      const foreignDescription = `Savings from ${description}`;

      if (this.savingsId) {
        if (description === SavingsSource.Income) {
          this._savingsStore
            .updateExpenseAndSavings(
              foreignId,
              { date, description: foreignDescription, amount, remarks },
              this.savingsId,
              this.formGroup.value as unknown as Partial<Savings>
            )
            .subscribe(() => {
              this.handleNotification('update');
              this.goBack();
            });
        } else if (description === SavingsSource.Capital) {
          this._savingsStore
            .updatePurchaseAndSavings(
              foreignId,
              { date, description: foreignDescription, amount, remarks },
              this.savingsId,
              this.formGroup.value as unknown as Partial<Savings>
            )
            .subscribe(() => {
              this.handleNotification('update');
              this.goBack()
            });
        } else {
          this._savingsStore
            .updateSavings(this.savingsId, this.formGroup.value as any)
            .subscribe(() => {
              this.handleNotification('update');
              this.goBack();
            });
        }
      } else {
        if (description === SavingsSource.Income) {
          this._savingsStore
            .saveExpenseAndSavings(
              { date, description: foreignDescription, amount, remarks },
              this.formGroup.value as unknown as Partial<Savings>
            )
            .subscribe(() => {
              this.handleNotification('create');
              this.goBack()
            });
        } else if (description === SavingsSource.Capital) {
          this._savingsStore
            .savePurchaseAndSavings(
              { date, description: foreignDescription, amount, remarks },
              this.formGroup.value as unknown as Partial<Savings>
            )
            .subscribe(() => {
              this.handleNotification('create');
              this.goBack()
            });
        } else {
          this._savingsStore
            .addSavings(this.formGroup.value as any)
            .subscribe(() => {
              this.handleNotification('create');
              this.goBack()
            });
        }
      }
    } else {
      // Handle form errors if needed
    }
  }

  deleteSavings() {
    // Update method name
    if (this.savingsId) {
      const description = this.formGroup.value.description;
      
      if(description == 'income'){
        this._savingsStore.deleteExpenseAndSavings(this.formGroup.value.foreignId!, this.savingsId).subscribe((v) => {
          this.handleNotification('delete');
          this.goBack();
        });
      }else if(description == 'purchase'){
        this._savingsStore.deletePurchaseAndSavings(this.formGroup.value.foreignId!, this.savingsId).subscribe((v) => {
          this.handleNotification('delete');
          this.goBack();
        })
      }else{
        this._savingsStore.deleteSavings(this.savingsId).subscribe((v) => {
          this.handleNotification('delete');
          this.goBack();
        });
      }
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

  handleNotification(type: 'create'|'update'|'delete'){
    this.#notificationService.showNotification(
      type,
      'success',
      undefined,
      'Savings'
    );
  }
}
