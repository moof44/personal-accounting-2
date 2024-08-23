import { animate, style, transition, trigger } from '@angular/animations';


export const pageComponentAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
      style({ opacity: 0, transform: 'translateX(-100px)' }),
      animate('400ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ])