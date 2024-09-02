import { ValueObject } from "../value-object";

class StubValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexStubValueObject extends ValueObject {
  constructor(readonly value: string, readonly value2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  test('should be equal', () => {
    const valueObject1 = new StubValueObject('value');
    const valueObject2 = new StubValueObject('value');

    expect(valueObject1.equals(valueObject2)).toBeTruthy();

    const complexValueObject1 = new ComplexStubValueObject('value', 1);
    const complexValueObject2 = new ComplexStubValueObject('value', 1);

    expect(complexValueObject1.equals(complexValueObject2)).toBeTruthy();
    expect(complexValueObject1.equals(null as any)).toBeFalsy();
    expect(complexValueObject2.equals(undefined as any)).toBeFalsy();
  });
});
