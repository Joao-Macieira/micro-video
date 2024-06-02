import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private readonly categoryModel: typeof CategoryModel) {}

  async findById(entityId: Uuid): Promise<Category | null> {
    const model = await this._get(entityId.id);

    return model ?
      new Category({
        categoryId: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        isActive: model.is_active,
        createdAt: model.created_at,
      }) :
      null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map(model => (
      new Category({
        categoryId: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        isActive: model.is_active,
        createdAt: model.created_at,
      })
    ))
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map(entity => ({
      category_id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
    })));
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.id;
    const model = await this._get(id);

    if(!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.update({
      category_id: id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
    }, {
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
      items: models.map(model => (
        new Category({
          categoryId: new Uuid(model.category_id),
          name: model.name,
          description: model.description,
          isActive: model.is_active,
          createdAt: model.created_at,
        })
      )),
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
