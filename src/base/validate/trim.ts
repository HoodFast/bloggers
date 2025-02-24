import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value?.trim();
    }
    return value;
  });
