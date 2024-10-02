import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';
import { IncomeStore } from '@app/shared/store/income.store';
import { IncomeFeatureService } from './income-feature.service';
import { AddUpdateIncomeComponent } from './pages/add-update-income/add-update-income.component';
import { ListIncomeComponent } from './pages/list-income/list-income.component';

@Component({
  selector: 'feature-income',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule, 
    ListIncomeComponent,
    AddUpdateIncomeComponent,
    CommonButtonComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    IncomeFeatureService,
  ],
  templateUrl: './income.component.html',
  styleUrls: [
    './income.component.scss', 
    '/src/app/core/page-parent/page-parent.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent extends PageParentComponent implements OnInit {
  readonly store = inject(IncomeStore);
  readonly incomeFeatureService = inject(IncomeFeatureService);
  title = 'Income';

  constructor(
  ){
    super();
  }

  ngOnInit(): void {
    this.setPageType();
  }

  triggerDelete(){
    this.incomeFeatureService.setDeleteState();
  }
}
