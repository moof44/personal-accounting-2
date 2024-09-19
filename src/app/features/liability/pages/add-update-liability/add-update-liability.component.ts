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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NotificationService } from '@app/core/notification/notification.service';
import { PayLiabilityOutputData } from '@app/shared/dialog/dialog.model';
import { PayLiabilityComponent } from '@app/shared/dialog/pay-liability/pay-liability.component';
import { ExpenseStore } from '@app/shared/store/expense.store';
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
export class AddUpdateLiabilityComponent implements OnInit {
  // Update component name
  #fb = inject(FormBuilder);
  #router = inject(Router);
  readonly #liabilityStore = inject(LiabilityStore); // Inject LiabilityStore
  readonly #dialog = inject(MatDialog);
  readonly #expenseStore = inject(ExpenseStore);
  readonly #notificationService = inject(NotificationService);

  formGroup = this.#fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Meralo', Validators.required],
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.liabilityId = id; // Update property name
    const liability = this.#liabilityStore.entities().find((v) => v.id === id)!; // Use _liabilityStore
    this.formGroup.patchValue(liability as any);
  }

  liabilityId = ''; // Update property name

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.#dialog.open(PayLiabilityComponent, {
      data: {
        item: this.formGroup.value.description,
        total: this.formGroup.value.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result: PayLiabilityOutputData) => {
      let message = ''; 

      if (!result || result.amount > this.formGroup.value.amount! || result.amount <= 0) {
        this.#notificationService.showNotification('validity', 'error');
        return;
      }
      message = `${result.amount|| 'Payment'} has been successfully credited.`;

      //this.#notificationService.showNotification('create', 'success');
      //this.#notificationService.showNotification('custom', 'success', undefined, message); 

      // if payFrom is cash, create entry for expense
      // if payFrom is capital, create entry for purchase

      
      switch(result.payFrom){
        case 'cash':
          break;
        case 'capital':
          break;
        default:
          break;
      }
    });
  }

  goBack() {
    this.#router.navigate(['/liability']); // Update navigation path
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.liabilityId) {
        // Check liabilityId
        this.#liabilityStore // Use _liabilityStore
          .updateLiability(this.liabilityId, this.formGroup.value as any) // Use updateLiability
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this.#liabilityStore // Use _liabilityStore
          .addLiability(this.formGroup.value as any) // Use addLiability
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
      // Handle form errors if needed
    }
  }

  deleteLiability() {
    // Update method name
    if (this.liabilityId) {
      // Check liabilityId
      this.#liabilityStore.deleteLiability(this.liabilityId).subscribe((v) => {
        // Use _liabilityStore and deleteLiability
        this.goBack();
      });
    }
  }
}
