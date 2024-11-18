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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  fillerNav2: NavigationMenu[] = [
    {
      label: 'Home',
      link: '/',
      icon: 'home' // Add icon property
    },
    {
      label: 'Income',
      link: '/income',
      icon: 'attach_money' 
    },
    {
      label: 'Savings',
      link: '/savings',
      icon: 'savings' 
    },
    {
      label: 'Expense',
      link: '/expense',
      icon: 'money_off' 
    },
    {
      label: 'Liability',
      link: '/liability',
      icon: 'account_balance' 
    },
    {
      label: 'Capital',
      link: '/capital',
      icon: 'business_center' 
    },
    {
      label: 'Purchase',
      link: '/purchase',
      icon: 'shopping_cart' 
    },
    {
      label: 'About',
      link: '/about',
      icon: 'info' 
    },
  ];

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
