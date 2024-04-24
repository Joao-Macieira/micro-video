import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe('Category Unit Tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  });

  test('constructor', () => {
    let category = new Category({
      name: 'Movie'
    });

    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();

    category = new Category({
      name: 'Movie',
      description: 'Movie description',
      isActive: false,
      createdAt,
    });

    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.isActive).toBeFalsy();
    expect(category.createdAt).toBe(createdAt);

    category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });

    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.isActive).toBeTruthy();
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie'
      });

      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description'
      });

      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a category with isActive', () => {
      const category = Category.create({
        name: 'Movie',
        isActive: false,
      });

      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.isActive).toBeFalsy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('categoryId field', () => {
    const arrange = [
      { id: null },
      { id: undefined },
      { id: new Uuid() }
    ];

    test.each(arrange)('id = %j', ({ id }) => {
      const category = new Category({
        name: "Movie",
        categoryId: id as any
      });

      expect(category.categoryId).toBeInstanceOf(Uuid);

      if (id instanceof Uuid) {
        expect(category.categoryId).toBe(id);
      }
    });
  });

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeName('Documentary');

    expect(category.name).toBe('Documentary');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeDescription('Some description');

    expect(category.description).toBe('Some description');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should activate a category', () => {
    const category = Category.create({
      name: 'Movie',
      isActive: false
    });

    expect(category.isActive).toBeFalsy();

    category.activate();

    expect(category.isActive).toBeTruthy();
  });

  test('should deactivate a category', () => {
    const category = Category.create({
      name: 'Movie',
    });

    expect(category.isActive).toBeTruthy();

    category.deactivate();

    expect(category.isActive).toBeFalsy();
  });
});

describe('Category validator', () => {
  describe('create command', () => {
    describe('should an invalid category with name property', () => {
      const arrange = [
        {
          input: {
            name: null as any,
          },
          errors: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ]
        },
        {
          input: {
            name: '',
          },
          errors: [
            "name should not be empty",
          ]
        },
        {
          input: {
            name: 5,
          },
          errors: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ]
        },
        {
          input: {
            name: 't'.repeat(256),
          },
          errors: [
            "name must be shorter than or equal to 255 characters",
          ]
        },
      ];

      test.each(arrange)("when name value is %j", async ({ input, errors }) => {
        expect(() => Category.create({ name: input.name })).containsErrorMessage({
          name: errors
        });
      });

      test('should a invalid category using description property', () => {
        expect(() => Category.create({ name: 'test', description: 5 } as any)).containsErrorMessage({
          description: ['description must be a string']
        });
      });

      test('should a invalid category using isActive property', () => {
        expect(() => Category.create({ name: 'test', isActive: 5 } as any)).containsErrorMessage({
          isActive: ['isActive must be a boolean value']
        });
      });
    });
  });

  describe('changeName command', () => {
    const arrange = [
      {
        input: {
          name: null as any,
        },
        errors: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      },
      {
        input: {
          name: '',
        },
        errors: [
          "name should not be empty",
        ]
      },
      {
        input: {
          name: 5,
        },
        errors: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      },
      {
        input: {
          name: 't'.repeat(256),
        },
        errors: [
          "name must be shorter than or equal to 255 characters",
        ]
      },
    ];

    test.each(arrange)("when name value is %j", async ({ input, errors }) => {
      const category = Category.create({ name: 'Movie' });
      expect(() => category.changeName(input.name)).containsErrorMessage({
        name: errors
      });
    });
  });

  describe("changeDescription command", () => {
    it("should a invalid category using description property", () => {
      const category = Category.create({ name: 'Movie' });
      expect(() => category.changeDescription(5 as any)).containsErrorMessage({
        description: ['description must be a string']
      });
    });
  });
});
