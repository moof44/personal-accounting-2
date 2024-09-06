import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MediaMatcher} from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { NavigationMenu } from '@app/models/global.model';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'authorized-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    RouterModule,
  ],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  fillerNav2: NavigationMenu[] = [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Income',
      link: '/income'
    },
    {
      label: 'Expense',
      link: '/expense'
    },
    {
      label: 'Liability',
      link: '/liability'
    },
    {
      label: 'Capital',
      link: '/capital'
    },
    {
      label: 'Purchase',
      link: '/purchase'
    },
    {
      label: 'About',
      link: '/about'
    },
  ]

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
