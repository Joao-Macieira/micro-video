import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModelMapper } from "./category-model-mapper";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private readonly categoryModel: typeof CategoryModel) {}

  async findById(entityId: Uuid): Promise<Category | null> {
    const model = await this._get(entityId.id);

    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map(CategoryModelMapper.toEntity)
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(CategoryModelMapper.toModel(entity).toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map(entity => (
      CategoryModelMapper.toModel(entity).toJSON()
    )));
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.id;
    const model = await this._get(id);

    if(!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.update(CategoryModelMapper.toModel(entity).toJSON(), {
      where: {
        category_id: id
      }
    });
  }

  async delete(entityId: Uuid): Promise<void> {
    const id = entityId.id;
    const model = await this._get(id);

    if(!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.destroy({
      where: {
        category_id: id,
      }
    })
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {[Op.like]: `%${props.filter}%`},
        }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort) ?
        { order: [[props.sort, props.sort_dir]] } :
        { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map(CategoryModelMapper.toEntity),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private async _get(id: string) {
    return this.categoryModel.findByPk(id);
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
