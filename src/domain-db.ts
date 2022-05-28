import { MangoQuery, RxCollection } from "rxdb";
import { schema } from "./db-schema";
import { Domain } from "./domain";
import { RxDBRepository } from "./rxdb-repository";
import { logError } from "./util";

export class DomainRepositoryRxDB extends RxDBRepository<{
  domain: RxCollection<Domain>;
}> {
  constructor() {
    super("domain", {
      domain: { schema },
    });
  }

  async add(domain: Domain): Promise<Domain> {
    try {
      await (await this.awaitDb()).domain.insert(domain);
      // ).domain.insert(marshallFromEntity(domain));
    } catch (error) {
      logError("Error adding a domain", error);
      throw error;
    }

    return domain;
  }

  async find(
    userId: string,
    filter: {
      sortByUpdate?: boolean;
      sortDesc?: boolean;
    } = {}
  ): Promise<{
    items?: Domain[];
    count?: number;
    nextToken?: string;
  }> {
    try {
      const query: MangoQuery<Domain> = {
        selector: { $and: [{ userId }] },
        sort: [],
        // index: "createdAt",
      };

      const queryAnd = query?.selector?.$and;
      const querySort = query.sort;
      const sortByUpdate = filter?.sortByUpdate ?? false;
      const sortDesc = filter?.sortDesc ?? false;

      if (sortByUpdate) {
        queryAnd.push({ updatedAt: { $gt: null } });
        queryAnd.push({ "_id": { $gt: null } });
        querySort?.push({ updatedAt: sortDesc ? "desc" : "asc" });
      } else {
        queryAnd.push({ createdAt: { $gt: null } });
        queryAnd.push({ "_id": { $gt: null } });
        querySort?.push({ createdAt: sortDesc ? "desc" : "asc" });
      }

      const result = await this.db.domain.find(query).exec();

      return {
        items: result?.map((i) => i) ?? [],
        // items: result?.map(defaultUnmarshallToEntity) ?? [],
      };
    } catch (error) {
      logError("Error retrieving domain", error);
      throw error;
    }
  }
}
