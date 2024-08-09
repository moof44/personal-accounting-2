import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MediaMatcher} from '@angular/cdk/layout';


@Component({
  selector: 'authorized-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule
  ],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  fillerNav = ['Home'];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;


}
