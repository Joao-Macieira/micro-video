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
