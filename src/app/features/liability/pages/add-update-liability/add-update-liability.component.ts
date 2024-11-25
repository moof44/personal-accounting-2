import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
  type OnInit
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DisableDirective } from '@app/global/directives/loading/disable.directive';
import { NotificationService } from '@app/global/notification/notification.service';
import { PageStateStore } from '@app/global/store/page-state.store';
import { Liability, PaymentHistory } from '@app/models/liability.model';
import { CommonTableComponent } from '@app/shared/components/common-table/common-table.component';
import { DeleteConfirmationComponent } from '@app/shared/dialog/delete-confirmation/delete-confirmation.component';
import { PayLiabilityOutputData } from '@app/shared/dialog/dialog.model';
import { PayLiabilityComponent } from '@app/shared/dialog/pay-liability/pay-liability.component';
import { LiabilityStore } from '@app/shared/store/liability.store'; // Import LiabilityStore
import { catchError } from 'rxjs';
import { LiabilityFeatureService } from '../../liability-feature.service';

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
    DisableDirective,
    MatExpansionModule,
    CommonTableComponent,
  ],
  templateUrl: './add-update-liability.component.html', // Update templateUrl
  styleUrls: [
    './add-update-liability.component.scss', 
    '/src/app/core/page-parent/add-update-page.component.scss'
  ], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateLiabilityComponent implements OnInit {
  // Update component name
  #fb = inject(FormBuilder);
  #router = inject(Router);
  readonly #liabilityStore = inject(LiabilityStore); // Inject LiabilityStore
  readonly #dialog = inject(MatDialog);
  readonly #notificationService = inject(NotificationService);
  readonly #liabilityFeatureService = inject(LiabilityFeatureService);
  readonly paymentHistoryOpenState = signal(false);
  readonly pageStateStore = inject(PageStateStore);

  formGroup = this.#fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Meralo', Validators.required],
    amount: [1000, Validators.required],
    remarks: '',
    paymentHistory: [],
  });

  liabilityId = ''; // Update property name
  // table related
  paymentHistory: PaymentHistory[] = [];
  current = signal(1);
  pageSize = signal(5);
  dataSource = computed(()=>{
    const startIndex = (this.current() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.paymentHistory.slice(startIndex, endIndex);
  })
  #defaultColumns = [
    { column: 'date', header: 'Date', type: 'date' },
    { column: 'amount', header: 'Amount' },
    { column: 'payFrom', header: 'Payment From' },
  ];
  displayedColumns = signal(this.#defaultColumns);
  itemsPerPage = signal(5);
  pageSizeOptions = signal([5, 10, 25]);
  // dataSource: PaymentHistory[] = [];

  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;

  @Input()
  set id(id: string) {
    this.liabilityId = id;
  }

  constructor(media: MediaMatcher, changeDetectorRef: ChangeDetectorRef) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

    effect(() => {
      if (this.#liabilityFeatureService.deleteTrigger() === true)
        this.deleteDialog();
      this.initFormGroup();
    });
  }

  initFormGroup() {
    const liability = this.#liabilityStore
      .entities()
      .find((v) => v.id === this.liabilityId)!; // Use _liabilityStore
    this.formGroup.patchValue(liability as any);
    this.paymentHistory = liability?.paymentHistory || [];
    //this.dataSource = this.paymentHistory;
  }

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.#dialog.open(PayLiabilityComponent, {
      data: {
        item: this.formGroup.value.description,
        total: this.formGroup.value.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result: PayLiabilityOutputData) => {
      if (result.amount > this.formGroup.value.amount! || result.amount <= 0) {
        this.#notificationService.showNotification('validity', 'error');
        return;
      }

      let successMessage = `Payment has been successfully credited.`;
      const foreignData = {
        date: new Date(), // Or get the date from your form
        description: 'Payment for ' + this.formGroup.value.description, // Dynamic description
        amount: result.amount,
        remarks: `Paid from ${result.payFrom}`, // Optional remarks
      }
      const paymentHistory = {
        date: new Date(),
        amount: result.amount,
        payFrom: result.payFrom,
        foreignId: '',
      }

      let liability = this.formGroup.value as unknown as Partial<Liability>;
      liability.amount = liability.amount! - result.amount;

      switch (result.payFrom) {
        case 'cash':
          this.#liabilityStore.saveExpenseAndLiability(
            foreignData,
            liability,
            paymentHistory
          ).subscribe(()=>{
            this.formGroup.controls.amount.setValue(liability.amount!); // update amount
            this.#notificationService.showNotification(
              'custom',
              'success',
              undefined,
              successMessage
            );
          })
          break;
        case 'capital':
          this.#liabilityStore.savePurchaseAndLiability(
            foreignData,
            liability,
            paymentHistory
          ).subscribe(()=>{
            this.formGroup.controls.amount.setValue(liability.amount!); // update amount
            this.#notificationService.showNotification(
              'custom',
              'success',
              undefined,
              successMessage
            );
          })
          break;
        default:
          // default to cash
          break;
      }
    });
  }

  deleteDialog() {
    const dialogRef = this.#dialog.open(DeleteConfirmationComponent, {
      data: this.formGroup.value.description,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.deleteLiability();
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
    if (this.liabilityId) {
      this.#liabilityStore.deleteLiability(this.liabilityId).subscribe((v) => {
        this.goBack();
      });
    }
  }

  get amount(){
    return this.formGroup.controls.amount;
  }

  onPageChange({ current, pageSize }: any) {
    this.current.set(current);
    this.pageSize.set(pageSize);
  }
}
