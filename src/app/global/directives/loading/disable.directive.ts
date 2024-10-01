import { Directive, effect, ElementRef, inject, Input } from '@angular/core';
import { LoadingService } from './loading.service';

@Directive({
  selector: '[disableOnLoading]',
  standalone: true,
})
export class DisableDirective {
  @Input() disableOnLoading = true;
  #isLoading = inject(LoadingService).isLoading;

  constructor(private el: ElementRef) {
    effect(() => {
      if (this.disableOnLoading) {
        this.el.nativeElement.disabled = this.#isLoading();
      }
    });
  }

  ngOnInit() {}
}
