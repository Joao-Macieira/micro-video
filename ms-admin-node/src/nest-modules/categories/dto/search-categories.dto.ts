import { ListCategoryUseCaseInput } from '@core/category/application/use-cases/list-category/list-categories.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoryUseCaseInput {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection;
  filter?: string;
}