import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsNumeric(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contains-numeric',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /[0-9]/.test(value);
        },
        defaultMessage() {
          return '$property must contain at least 1 numeric character [0-9]';
        },
      },
    });
  };
}
