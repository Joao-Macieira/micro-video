import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const category = new Category({
      categoryId: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      isActive: model.is_active,
      createdAt: model.created_at,
    });

    Category.validate(category);

    return category;
  }
}
