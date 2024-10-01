import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<boolean>);
  readonly data = inject<string>(MAT_DIALOG_DATA);

  ngOnInit(): void { }

  delete(){
    this.dialogRef.close(true);
  }

}
