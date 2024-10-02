import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnDestroy,
  type OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageStateStore } from '@app/global/store/page-state.store';
import { pageComponentAnimation } from '@app/shared/animations/general-animations';
import { Subscription } from 'rxjs';

/**
 * A base component for page-level components.
 *
 * Provides common functionality and styling for pages.
 */
@Component({
  selector: 'app-page-parent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-parent.component.html',
  styleUrl: './page-parent.component.scss',
  animations: [pageComponentAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageParentComponent implements OnDestroy {
 /**
   * Injects the Router from Angular.
   */
  router = inject(Router);
  /**
   * Private subscription to route events.
   */
  #subscription = new Subscription();
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
  /**
   * Determines the current page type based on the provided URL.
   *
   * @param page The URL of the current route.
   * @returns The type of the current page ('add', 'update', or 'list').
   */
  getCurrentPage(page: string): 'add' | 'update' | 'list' {
    if (page.includes('/add')) return 'add';
    if (page.includes('/update/')) return 'update';
    return 'list';
  }
  /**
   * Sets the page type in the PageStateStore based on the current route.
   * It also subscribes to route changes and updates the page type accordingly.
   */
  setPageType(){
    this.pageStateStore.setType(this.getCurrentPage(this.router.url))

    this.#subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.pageStateStore.setType(this.getCurrentPage(event.urlAfterRedirects))
        }
      })
    );
  }
  /**
   * Unsubscribes from the route events when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }
}
