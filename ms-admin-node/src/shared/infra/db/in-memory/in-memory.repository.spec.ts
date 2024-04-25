import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructorProps = {
  entityId?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entityId = props.entityId ?? new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price
    }
  }

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test("should insert new entity", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      name: "Test",
      price: 100
    });

    await repo.insert(entity);

    expect(repo.items).toHaveLength(1);
    expect(repo.items[0]).toStrictEqual(entity);
  });

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: "Test",
        price: 100
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: "Test2",
        price: 150
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: "Test3",
        price: 200
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items).toHaveLength(3);
    expect(repo.items[0]).toStrictEqual(entities[0]);
    expect(repo.items[1]).toStrictEqual(entities[1]);
    expect(repo.items[2]).toStrictEqual(entities[2]);
  });

  test("should return all entities", async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: "Test",
        price: 100
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: "Test2",
        price: 150
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: "Test3",
        price: 200
      }),
    ];
    await repo.bulkInsert(entities);

    const foundedEntities = await repo.findAll();

    expect(foundedEntities).toHaveLength(3);
    expect(foundedEntities[0]).toStrictEqual(entities[0]);
    expect(foundedEntities[1]).toStrictEqual(entities[1]);
    expect(foundedEntities[2]).toStrictEqual(entities[2]);
  });

  test("should return an entity by id", async () => {
    const entity = new StubEntity({ name: "Test", price: 100 });
    await repo.insert(entity);

    let foundedEntity = await repo.findById(new Uuid('550e8400-e29b-41d4-a716-446655440000'));

    expect(foundedEntity).toBeNull();

    foundedEntity = await repo.findById(entity.entityId);

    expect(foundedEntity).toBeDefined();
    expect(foundedEntity.name).toBe('Test');
    expect(foundedEntity.price).toBe(100);
  });

  test("should throw an error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "Test", price: 100 });
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity)
    );
  });

  test("should update an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 100 });
    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entityId: entity.entityId,
      name: "Test updated",
      price: 150
    });

    await repo.update(entityUpdated);
    expect(repo.items[0].toJSON()).toStrictEqual(entityUpdated.toJSON());
  });

  test("should throw an error on delete when entity not found", async () => {
    const uuid = new Uuid();
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid, StubEntity)
    );

    await expect(repo.delete(new Uuid('550e8400-e29b-41d4-a716-446655440000'))).rejects.toThrow(
      new NotFoundError('550e8400-e29b-41d4-a716-446655440000', StubEntity)
    );
  });

  test("should delete an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 100 });
    await repo.insert(entity);

    expect(repo.items).toHaveLength(1);

    await repo.delete(entity.entityId);
    expect(repo.items).toHaveLength(0);
  });
});
