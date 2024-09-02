import { Category } from "../../../domain/category.entity";

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
}

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { categoryId, ...props } = entity.toJSON();

    return {
      id: categoryId,
      ...props,
    }
  }
}
