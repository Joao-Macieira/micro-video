import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoryRepository: CategorySequelizeRepository,
  ) {
    console.log(this.categoryRepository);
  }

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
