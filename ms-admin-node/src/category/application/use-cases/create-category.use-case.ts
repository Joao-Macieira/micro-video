import { IUseCase } from "../../../shared/application/use-case.interface";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateCategoryUseCase implements IUseCase<
  CreateCategoryInput,
  CategoryOutput
> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryOutput> {
    const entity = Category.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepository.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}
