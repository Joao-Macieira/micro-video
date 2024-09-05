import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { Transform } from 'class-transformer';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.isActive = output.isActive;
    this.createdAt = output.createdAt;
  }
}
