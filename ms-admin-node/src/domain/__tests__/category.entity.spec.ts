import { Category } from "../category.entity";

describe('Category Unit Tests', () => {
  test('constructor', () => {
    let category = new Category({
      name: 'Movie'
    });

    expect(category.categoryId).toBe('');
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

    expect(category.categoryId).toBe('');
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.isActive).toBeFalsy();
    expect(category.createdAt).toBe(createdAt);

    category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });

    expect(category.categoryId).toBe('');
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

      expect(category.categoryId).toBe('');
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
    });

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description'
      });

      expect(category.categoryId).toBe('');
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
    });

    test('should create a category with isActive', () => {
      const category = Category.create({
        name: 'Movie',
        isActive: false,
      });

      expect(category.categoryId).toBe('');
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.isActive).toBeFalsy();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category).toBeInstanceOf(Category);
    });
  });

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeName('Documentary');

    expect(category.name).toBe('Documentary');
  });

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeDescription('Some description');

    expect(category.description).toBe('Some description');
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
