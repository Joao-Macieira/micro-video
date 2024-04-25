import { Entity } from "../entity";
import { ValueObject } from "../value-object";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  findById(entityId: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entityId: EntityId): Promise<void>;

  getEntity(): new (...args: any[]) => E;
}

export interface ISearchebleRepository<
  E extends Entity,
  EntityId extends ValueObject,
  SearchInput = SearchParams,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortabledFields: string[];

  search(props: SearchInput): Promise<SearchOutput>;
}
