import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, type OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatTableModule } from '@angular/material/table';
import { IncomeStore } from '@app/shared/store/income.store';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'feature-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [
    //IncomeStore,
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit {
  @HostBinding('class.content__page') pageClass = true;

  displayedColumns: string[] = ['date', 'incomeSource', 'amount', 'remarks'];

  readonly store = inject(IncomeStore);

  constructor(private _firestore: Firestore){
  }

  ngOnInit(): void {
    //this.store.loadIncome('');
  }

}
