import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, type OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { IncomeStore } from '@app/shared/store/income.store';
import { MatTableModule } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ListIncomeComponent } from './pages/list-income/list-income.component';
@Component({
  selector: 'feature-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListIncomeComponent,
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

  // displayedColumns: string[] = ['date', 'incomeSource', 'amount', 'remarks'];

  readonly store = inject(IncomeStore);
  title = 'Income';

  constructor(private _firestore: Firestore){
  }

  ngOnInit(): void {
    //this.store.loadIncome('');
    this.store.entities
  }

}
