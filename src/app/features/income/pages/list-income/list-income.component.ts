import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, input, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Income } from '@app/models/global.model';

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
  // @HostBinding('class.content__page') pageClass = true;

  displayedColumns: string[] = ['date', 'incomeSource', 'amount', 'remarks'];
  dataSource = input.required<Income[]>()

  ngOnInit(): void { }

}
