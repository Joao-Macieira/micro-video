import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";


type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
};

type UpdateCategoryOutput = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
};

export class UpdateCategoryuseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if ("description" in input) {
      category.changeDescription(input.description);
    }

    if (input.isActive === true) {
      category.activate()
    }

    if (input.isActive === false) {
      category.deactivate()
    }

    await this.categoryRepository.update(category);

    return {
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt
    }
  }
}
