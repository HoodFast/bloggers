import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SortDirectionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.sortDirection) {
      return value;
    }

    value.sortDirection = value.sortDirection.toUpperCase();
    return value;
  }
}
