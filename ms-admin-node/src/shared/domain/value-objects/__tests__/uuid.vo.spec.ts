import { validate as uuidValidate } from 'uuid';

import { InvalidUuidError, Uuid } from "../uuid.vo";

describe('Uuid Unit tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a new Uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid Uuid', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000'
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
