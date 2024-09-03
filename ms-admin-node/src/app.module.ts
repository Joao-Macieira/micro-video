import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories/categories.module';
import { ConfigModule } from './nest-modules/config/config.module';
import { DatabaseModule } from './nest-modules/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
