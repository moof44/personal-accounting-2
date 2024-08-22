import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventSpaceTrigger]',
  standalone: true,
})
export class PreventSpaceTriggerDirectiveDirective {
  @HostListener('keydown.space', ['$event'])
  onSpaceKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }
}
