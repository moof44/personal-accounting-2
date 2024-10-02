import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CapitalStore } from '@app/shared/store/capital.store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { ListCapitalComponent } from './pages/list-capital/list-capital.component';
import { AddUpdateCapitalComponent } from './pages/add-update-capital/add-update-capital.component';
import { PageParentComponent } from '@app/core/page-parent/page-parent.component';
import { CapitalFeatureService } from './capital-feature.service';
import { CommonButtonComponent } from '@app/shared/components/common-button/common-button.component';


@Component({
  selector: 'feature-capital',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ListCapitalComponent,
    AddUpdateCapitalComponent,
    CommonButtonComponent,
    RouterOutlet,
    RouterModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    CapitalFeatureService,
  ],
  templateUrl: './capital.component.html',
  styleUrls: [
    './capital.component.scss', 
    '/src/app/core/page-parent/page-parent.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapitalComponent extends PageParentComponent implements OnInit {
  readonly store = inject(CapitalStore);
  readonly capitalFeatureService = inject(CapitalFeatureService);
  title = 'Capital';

  constructor(
    private route: ActivatedRoute,
  ){
    super();
  }

  ngOnInit(): void { 
    this.setPageType();
  }

  triggerDelete(){
    this.capitalFeatureService.setDeleteState();
  }

}
