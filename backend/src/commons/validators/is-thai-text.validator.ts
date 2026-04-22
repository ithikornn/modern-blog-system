import { ValidatorConstraint, ValidatorConstraintInterface, 
    ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isThaiText', async: false })
export class IsThaiTextConstraint implements ValidatorConstraintInterface {
validate(text: string) {
// ยอมรับ: ภาษาไทย, ตัวเลข 0-9, เลขไทย ๐-๙, whitespace
const regex = /^[\u0E00-\u0E7F0-9\u0E50-\u0E59\s]+$/;
return regex.test(text);
}

defaultMessage(args: ValidationArguments) {
return 'กรุณากรอกเฉพาะภาษาไทยและตัวเลขเท่านั้น';
}
}

export function IsThaiText(validationOptions?: ValidationOptions) {
return function (object: object, propertyName: string) {
registerDecorator({
 target: object.constructor,
 propertyName,
 options: validationOptions,
 validator: IsThaiTextConstraint,
});
};
}