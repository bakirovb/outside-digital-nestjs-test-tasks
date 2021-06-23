import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsLowercaseLetter(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contains-lowercase-letter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /[a-z]/.test(value);
        },
        defaultMessage() {
          return '$property must contain at least 1 lowercase letter [a-z]';
        },
      },
    });
  };
}
