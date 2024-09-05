import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';

import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-categories.use-case';
import { UpdateCategoryuseCase } from '@core/category/application/use-cases/update-category/update-category.use-case';
import { CategoryPresenter } from './categories.presenter';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private readonly createCategoryUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryuseCase)
  private readonly updateCategoryUseCase: UpdateCategoryuseCase;

  @Inject(DeleteCategoryUseCase)
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private readonly getCategoryUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private readonly listCategoryUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
