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
import { PurchaseStore } from '@app/shared/store/purchase.store';
import { PurchaseFeatureService } from '../../purchase-feature.service';
import { PageStateStore } from '@app/global/store/page-state.store';
import { DeleteConfirmationComponent } from '@app/shared/dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-add-update-purchase',
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
  templateUrl: './add-update-purchase.component.html',
  styleUrls: [
    './add-update-purchase.component.scss', 
    '/src/app/core/page-parent/add-update-page.component.scss'
  ], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdatePurchaseComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private readonly _purchaseStore = inject(PurchaseStore);
  readonly #dialog = inject(MatDialog);
  readonly #purchaseFeatureService = inject(PurchaseFeatureService);
  readonly pageStateStore = inject(PageStateStore);

  formGroup = this._fb.group({
    id: '',
    date: [new Date(), Validators.required],
    description: ['Sample Purchase', Validators.required], 
    amount: [1000, Validators.required],
    remarks: '',
  });

  @Input()
  set id(id: string) {
    this.purchaseId = id;
    const purchase = this._purchaseStore.entities().find((v) => v.id === id)!;
    this.formGroup.patchValue(purchase as any);
  }

  purchaseId = '';

  constructor(){
    effect(()=>{
      if(this.#purchaseFeatureService.deleteTrigger() === true)
        this.deleteDialog();
      this.initFormGroup();
    })
  }

  initFormGroup() {
    const purchase = this._purchaseStore
      .entities()
      .find((v) => v.id === this.purchaseId)!; // Use _liabilityStore
    this.formGroup.patchValue(purchase as any);
  }


  ngOnInit(): void {}

  goBack() {
    this._router.navigate(['/purchase']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.purchaseId) {
        this._purchaseStore
          .updatePurchase(this.purchaseId, this.formGroup.value as any)
          .subscribe((v) => {
            this.goBack();
          });
      } else {
        this._purchaseStore
          .addPurchase(this.formGroup.value as any)
          .subscribe((v) => {
            if (v) this.goBack();
          });
      }
    } else {
      // Handle form errors if needed
    }
  }

  deletePurchase() {
    if (this.purchaseId) {
      this._purchaseStore.deletePurchase(this.purchaseId).subscribe((v) => {
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
        this.deletePurchase();
      }
    });
  }
}
