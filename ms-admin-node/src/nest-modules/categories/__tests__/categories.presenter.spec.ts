import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from '../categories.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date();
      const presenter = new CategoryPresenter({
        id: 'id',
        name: 'name',
        description: 'description',
        isActive: true,
        createdAt,
      });

      expect(presenter.id).toBe('id');
      expect(presenter.name).toBe('name');
      expect(presenter.description).toBe('description');
      expect(presenter.isActive).toBeTruthy();
      expect(presenter.createdAt).toEqual(createdAt);
    });
  });

  it('should presenter data', () => {
    const createdAt = new Date();
    const presenter = new CategoryPresenter({
      id: 'id',
      name: 'name',
      description: 'description',
      isActive: true,
      createdAt,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      id: 'id',
      name: 'name',
      description: 'description',
      isActive: true,
      createdAt: createdAt.toISOString(),
    });
  });
});
