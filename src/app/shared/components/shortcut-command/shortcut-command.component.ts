import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-shortcut-command',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './shortcut-command.component.html',
  styleUrl: './shortcut-command.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutCommandComponent implements OnInit {

  showMenu = false;
  menuList = [
    {
      link: '/income/add',
      label: 'Add Income',
      icon: 'attach_money'
    },
    {
      link: '/expense/add',
      label: 'Add Expense',
      icon: 'money_off'
    },
    {
      link: '/savings/add',
      label: 'Add Savings',
      icon: 'savings'
    },
    {
      link: '/liability',
      label: 'Pay Liability',
      icon: 'account_balance'
    },
  ];

  ngOnInit(): void { }


  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  openMenu() {
    // You don't need to manage the menu's visibility anymore
  }

  command1() {
    // Implement your command 1 logic here
  }

  command2() {
    // Implement your command 2 logic here
  }

  command3() {
    // Implement your command 3 logic here
  }

}
