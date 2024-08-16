import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, type OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  @HostBinding('class.content__page') pageClass = true;
  
  private _dataSource = new BehaviorSubject<any[]>([]);
  dataSource$ = this._dataSource.asObservable();
  displayedColumns: string[] = ['item', 'total'];

  ngOnInit(): void { }

}
