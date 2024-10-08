import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'autoFormat',
  standalone: true,
  pure: true,
})
export class AutoFormatPipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  constructor() {} 

  transform(value: any, numberFormat: string = '1.2-2', dateFormat: string = 'M/d/y'): any {
    if (typeof value === 'number') {
      const [integerDigits, fractionDigits] = numberFormat.split('.');
      const [minFractionDigits, maxFractionDigits] = fractionDigits.split('-');
  
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: parseInt(minFractionDigits, 10),
        maximumFractionDigits: parseInt(maxFractionDigits, 10)
      }).format(value); 
    } else if (value instanceof Date) {
      return this.datePipe.transform(value, dateFormat);
    } else if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) { 
      // Check if it's a Firebase Timestamp-like object
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000); 
      return this.datePipe.transform(date, dateFormat);
    } else {
      return value; 
    }
  }

}
