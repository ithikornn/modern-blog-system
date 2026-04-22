import {
    ValidatorConstraint, ValidatorConstraintInterface,
    ValidationArguments, registerDecorator, ValidationOptions
} from 'class-validator';

@ValidatorConstraint({ name: 'isThaiText', async: false })
export class IsThaiTextConstraint implements ValidatorConstraintInterface {
    validate(text: string) {
        if (!text || !text.trim()) return false; // ← เพิ่มตรงนี้ ตรวจ whitespace ก่อน
        const regex = /^[\u0E00-\u0E7F0-9\u0E50-\u0E59\s]+$/;
        return regex.test(text);
    }

    defaultMessage() {
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