import { IUseCase } from "../../../shared/application/use-case.interface";
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

    await this.categoryRepository.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}
