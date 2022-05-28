import { faker } from "@faker-js/faker";
import { Domain } from "../domain";
import { DomainRepositoryRxDB } from "../domain-db";

describe("crud test for RxDb 12", function () {
  const domainRepository = new DomainRepositoryRxDB();
  const userId = faker.internet.email();
  let domain11: Domain | null = null;
  let domain12: Domain | null = null;

  beforeAll(async () => {
    await domainRepository.initDb();
  });

  it("test add domain", async function () {
    let nowIso = new Date().toISOString();
    const addParams: Domain = {
      id: faker.datatype.uuid(),
      userId,
      version: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: userId,
      updatedBy: userId,
    };

    const addResult1 = await domainRepository.add(addParams);
    expect(addResult1).toBeTruthy();
    expect(addResult1).toEqual(
      expect.objectContaining({
        userId,
        version: 1,
        createdAt: nowIso,
        updatedAt: nowIso,
      })
    );
    domain11 = addResult1;

    nowIso = new Date().toISOString();
    const addParams2: Domain = {
      ...addParams,
      id: faker.datatype.uuid(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const addResult2 = await domainRepository.add(addParams2);
    expect(addResult2).toBeTruthy();
    expect(addResult2).toEqual(
      expect.objectContaining({
        userId,
        version: 1,
        createdAt: nowIso,
        updatedAt: nowIso,
      })
    );
    domain12 = addResult2;
  });

  it("test find domain #1", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: false,
      sortDesc: false,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain11, domain12]);
  });

  it("test find domain #2", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: false,
      sortDesc: true,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain12, domain11]);
  });
});
