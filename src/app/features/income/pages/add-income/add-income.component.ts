import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './add-income.component.html',
  styleUrl: './add-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIncomeComponent implements OnInit {

  ngOnInit(): void { }

}
