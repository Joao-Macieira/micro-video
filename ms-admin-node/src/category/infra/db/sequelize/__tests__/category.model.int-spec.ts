import { Sequelize } from "sequelize-typescript";
import { Category } from "../../../../domain/category.entity";
import { CategoryModel } from "../category.model";

describe('CategoryModel Integration Tests', () => {
  test('should create a category', async () => {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel]
    });

    await sequelize.sync({ force: true });

    const category = Category.fake().aCategory().build();

    await CategoryModel.create({
      category_id: category.categoryId.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
    });
  });
});
