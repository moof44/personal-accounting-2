import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'feature-expense',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent implements OnInit {

  ngOnInit(): void { }

}
