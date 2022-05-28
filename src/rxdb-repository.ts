import {
  addRxPlugin,
  createRxDatabase,
  removeRxDatabase,
  RxCollection,
  RxCollectionCreator,
  RxDatabase,
  RxDumpCollectionAny,
} from "rxdb";
import { addPouchPlugin, getRxStoragePouch, PouchDB } from "rxdb/plugins/pouchdb";
import { isDev, isJestTest, logDebug, logError } from "./util";

if (isJestTest()) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  addPouchPlugin(require("pouchdb-adapter-memory"));
  addPouchPlugin(require("pouchdb-debug"));

  // debug all
  // PouchDB.debug.enable('*');

  // only debug queries
  PouchDB.debug.enable('pouchdb:find');

  logDebug("Added RxDB test plugins");
} else {
  // configure RxDB PouchDB IndexedDB adapter for web
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  addPouchPlugin(require("pouchdb-adapter-idb"));

  logDebug("Added IndexedDB PouchDB adapter");
}

if (isDev()) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  addRxPlugin(require("rxdb/plugins/query-builder").RxDBQueryBuilderPlugin);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // addRxPlugin(require("rxdb/plugins/dev-mode").RxDBDevModePlugin);
  logDebug("Added RxDB dev plugins");
}

export class RxDBRepository<
  SCHEMA extends { [k: string]: RxCollection } = { [k: string]: RxCollection }
> {
  #db: RxDatabase<SCHEMA> | null = null;
  readonly #bootstrapDatabaseOnCreate: boolean = false;
  #bootstrapped = false;

  constructor(
    readonly name: string,
    readonly schemas: { [k: string]: RxCollectionCreator },
    { bootstrapDatabase = false }: { bootstrapDatabase?: boolean } = {}
  ) {
    this.#bootstrapDatabaseOnCreate = bootstrapDatabase;
    if (bootstrapDatabase) {
      this.bootstrapDatabase().catch(logError);
    }
  }

  async initDb(): Promise<void | SCHEMA> {
    return this.bootstrapDatabase();
  }

  async bootstrapDatabase(): Promise<SCHEMA | void> {
    if (this.#bootstrapped) {
      logDebug(`Database ${this.name} already bootstrapped`);
      return this.db.collections as SCHEMA | void;
    }
    logDebug(`Bootstrapping database ${this.name}...`);

    return createRxDatabase({
      name: this.name,
      storage: getRxStoragePouch(isJestTest() ? "memory" : "idb"),
      multiInstance: false,
      ignoreDuplicate: false,
    })
      .then(async (db) => {
        if (this.#db) {
          logError(
            `Database ${this.name} already created. It's probably a concurrent issue.`
          );
        } else {
          this.#db = db as unknown as RxDatabase<SCHEMA> | null;
          logDebug("Database created");
        }

        await this.addCollections();
      })
      .catch(logError);
  }

  async addCollections() {
    // logDebug(
    //   `Collections created: ${Object.keys(this.db.collections).length}`
    // );
    if (Object.keys(this.db.collections).length > 0) {
      logError(
        `DB collections already added. It's probably a concurrent issue.`
      );
      return this.db.collections;
    } else {
      const cols = (await this.db.addCollections(
        this.schemas
      )) as SCHEMA | void;
      logDebug(
        `${Object.keys(this.db.collections).length} db collections added`
      );
      this.#bootstrapped = true;
      return cols;
    }
  }

  // set db(db: RxDatabase<SCHEMA> | null) {
  //   this.#db = db;
  // }

  get db(): RxDatabase<SCHEMA> {
    if (!this.#db) throw new Error("Database wasn't created");
    return this.#db;
  }

  async awaitDb(): Promise<RxDatabase<SCHEMA>> {
    if (!this.#db) {
      if (!this.#bootstrapDatabaseOnCreate) {
        await this.initDb();
      }
      return this.db;
    }

    return this.#db;
  }

  async clearData(removeIfError = true): Promise<void | SCHEMA> {
    try {
      for (const col of Object.keys(this.db.collections)) {
        logDebug(`Clearing ${col} database data...`);
        await this.db[col].remove();
      }

      await this.addCollections();
    } catch (error) {
      logError(`Error clearing database data`, error);
      if (removeIfError) {
        logDebug("Removing database...");
        return this.removeDatabase();
      }
      throw error;
    }
  }

  async removeDatabase(): Promise<void | SCHEMA> {
    try {
      // to remove outdated schema - do it only in DEV mode
      await removeRxDatabase(
        this.name,
        getRxStoragePouch(isJestTest() ? "memory" : "idb")
      );
      return this.initDb();
    } catch (error) {
      logError(`Error removing database`, error);
      throw error;
    }
  }

  async exportData<C extends keyof SCHEMA>(
    col: C
  ): Promise<
    RxDumpCollectionAny<unknown>
    // RxDumpCollection<SCHEMA[C] extends RxCollection<infer T> ? T : unknown>
  > {
    let data;
    try {
      data = await this.db[col].exportJSON();
    } catch (error) {
      logError(`Error exporting ${String(col)}`, error);
      throw error;
    }

    if (data) {
      return data;
      // return data as RxDumpCollection<
      //   SCHEMA[C] extends RxCollection<infer T> ? T : unknown
      // >;
    }

    throw new Error(`Could not export ${String(col)}`);
  }

  async importData<C extends keyof SCHEMA>(
    col: C,
    data: RxDumpCollectionAny<unknown>
  ): Promise<void> {
    try {
      await this.db[col].importJSON(data);
    } catch (error) {
      logError(`Error importing ${String(col)}`, error);
      throw error;
    }
  }
}
