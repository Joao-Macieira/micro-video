import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validator-fields.interface";

type Expected = {
  validator: ClassValidatorFields<any>;
  data: any;
} | (() => any);

expect.extend({
  containsErrorMessage(expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessage(error.errors, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assertContainsErrorMessage(validator.errors, received);
    }
  },
});

function isValid() {
  return { pass: true, message: () => "" }
}

function assertContainsErrorMessage(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? { pass: true, message: () => "" }
    : {
      pass: false,
      message: () => `The validation errors no contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    }
}
