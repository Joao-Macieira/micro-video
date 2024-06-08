import { PaginationOutput, PaginationOutputMapper } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interface";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

type ListCategoryUseCaseInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};

type ListCategoryUseCaseOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase implements IUseCase<ListCategoryUseCaseInput, ListCategoryUseCaseOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: ListCategoryUseCaseInput): Promise<ListCategoryUseCaseOutput> {
    const params = new CategorySearchParams(input);
    const searchResults = await this.categoryRepository.search(params);

    return this.toOutput(searchResults);
  }

  private toOutput(searchResults: CategorySearchResult): ListCategoryUseCaseOutput {
    const { items: _items } = searchResults;
    const items = _items.map((item) => CategoryOutputMapper.toOutput(item));

    return PaginationOutputMapper.toOutput(items, searchResults);
  }
}
