import { Directive, effect, ElementRef, inject, Input } from '@angular/core';
import { LoadingService } from './loading.service';

@Directive({
  selector: '[disableOnLoading]',
  standalone: true,
})
export class DisableDirective {
  @Input() appDisableOnLoading = true;
  loadingService = inject(LoadingService);

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.appDisableOnLoading) {
      effect(() => {
        this.el.nativeElement.disabled = this.loadingService.isLoading();
      });
    }
  }
}
