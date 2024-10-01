import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IncomeStore } from '@app/shared/store/income.store';
import { AddUpdateIncomeComponent } from './pages/add-update-income/add-update-income.component';
import { ListIncomeComponent } from './pages/list-income/list-income.component';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { MatIconModule } from '@angular/material/icon';
import { IncomeFeatureService } from './income-feature.service';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';

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
  styleUrl: './income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent extends PageParentComponent implements OnInit {
  readonly store = inject(IncomeStore);
  readonly incomeFeatureService = inject(IncomeFeatureService);
  title = 'Income';
  currentPage = signal<'add'|'update'|'list'>('list');

  constructor(
    private router: Router,
  ){
    super();
  }

  ngOnInit(): void {
    this.pageStateStore.setType(this.getCurrentPage(this.router.url))

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pageStateStore.setType(this.getCurrentPage(event.urlAfterRedirects))
      }
    });
  }

  triggerDelete(){
    this.incomeFeatureService.setDeleteState();
  }
}
