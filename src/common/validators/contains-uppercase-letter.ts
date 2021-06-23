import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsUppercaseLetter(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contains-uppercase-letter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /[A-Z]/.test(value);
        },
        defaultMessage() {
          return '$property must contain at least 1 uppercase letter [A-Z]';
        },
      },
    });
  };
}
