import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, input, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Income } from '@app/models/global.model';
import { IncomeStore } from '@app/shared/store/income.store';

@Component({
  selector: 'page-list-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './list-income.component.html',
  styleUrl: './list-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListIncomeComponent implements OnInit {
  readonly store = inject(IncomeStore);

  displayedColumns: string[] = ['date', 'incomeSource', 'amount', 'remarks'];
  dataSource = this.store.entities; // dataSource = input.required<Income[]>() // in case this will be a separate component

  ngOnInit(): void {
    //this.dataSource.set(this.store.entities());
  }

}
