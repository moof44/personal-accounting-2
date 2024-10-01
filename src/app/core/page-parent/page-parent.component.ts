import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, type OnInit } from '@angular/core';
import { PageStateStore } from '@app/global/store/page-state.store';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';

/**
 * A base component for page-level components.
 * 
 * Provides common functionality and styling for pages.
 */
@Component({
  selector: 'app-page-parent',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './page-parent.component.html',
  styleUrl: './page-parent.component.scss',
  animations: [
    pageComponentAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageParentComponent {
  /**
   * Adds the `content__page` class to the host element.
   */
  @HostBinding('class.content__page') pageClass = true;

  /**
   * Applies the `routeAnimations` animation to the host element.
   */
  @HostBinding('@routeAnimations') routeAnimations = true;
  
  /**
   * Injects the `PageStateStore` to manage page-level state.
   */
  readonly pageStateStore = inject(PageStateStore);
  
}