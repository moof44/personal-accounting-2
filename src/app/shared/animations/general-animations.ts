import { animate, style, transition, trigger } from '@angular/animations';

export const pageComponentAnimation = trigger('routeAnimations', [
  transition('void => *', [
    style({ opacity: 0, transform: 'translateX(100px)' }), // Initial state: off-screen to the right
    animate(
      '400ms ease-in',
      style({ opacity: 1, transform: 'translateX(0)' })
    ), // Animate to on-screen
  ]),
  // transition('* => void', [
  //   // When component leaves
  //   style({ opacity: 1, transform: 'translateX(0)' }), // Start from on-screen
  //   animate(
  //     '200ms ease-out',
  //     style({ opacity: 0, transform: 'translateX(100px)' })
  //   ), // Animate to off-screen left
  // ]),
]);
