import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, type OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { SummaryStore } from '@app/shared/store/summary.store';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  @HostBinding('class.content__page') pageClass = true;
  @HostBinding('@routeAnimations') routeAnimations = true;
  
  readonly store = inject(SummaryStore);
  dataSource = this.store.parsedSummary;
  displayedColumns: string[] = ['item', 'total'];


  ngOnInit(): void { }

}
