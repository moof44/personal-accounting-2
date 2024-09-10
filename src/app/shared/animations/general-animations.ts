import { animate, style, transition, trigger } from '@angular/animations';

export const pageComponentAnimation = trigger('routeAnimations', [
  transition('void => *', [
    style({ opacity: 0, transform: 'translateX(100px)', willChange: 'opacity, transform' }), // Initial state: off-screen to the right
    animate(
      '400ms ease',
      style({ opacity: 1, transform: 'translateX(0)' })
    ), // Animate to on-screen
  ]),
]);
