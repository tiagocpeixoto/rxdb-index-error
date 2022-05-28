import { faker } from "@faker-js/faker";
import { Domain } from "../domain";
import { DomainRepositoryRxDB } from "../domain-db";

describe("crud test for RxDb 12", function () {
  const domainRepository = new DomainRepositoryRxDB();
  const userId = faker.internet.email();
  let domain11: Domain | null = null;
  let domain12: Domain | null = null;
  const createdAt1 = "2022-05-26T00:00:00.000Z";
  const updatedAt1 = "2022-05-26T00:00:03.000Z";
  const createdAt2 = "2022-05-26T00:00:01.000Z";
  const updatedAt2 = "2022-05-26T00:00:02.000Z";


  beforeAll(async () => {
    await domainRepository.initDb();
  });

  it("test add domain", async function () {
    const addParams: Domain = {
      id: faker.datatype.uuid(),
      userId,
      version: 1,
      createdAt: createdAt1,
      updatedAt: updatedAt1,
      createdBy: userId,
      updatedBy: userId,
    };

    const addResult1 = await domainRepository.add(addParams);
    expect(addResult1).toBeTruthy();
    expect(addResult1).toEqual(
      expect.objectContaining({
        userId,
        version: 1,
        createdAt: createdAt1,
        updatedAt: updatedAt1,
      })
    );
    domain11 = addResult1;

    const addParams2: Domain = {
      ...addParams,
      id: faker.datatype.uuid(),
      createdAt: createdAt2,
      updatedAt: updatedAt2,
    };

    const addResult2 = await domainRepository.add(addParams2);
    expect(addResult2).toBeTruthy();
    expect(addResult2).toEqual(
      expect.objectContaining({
        userId,
        version: 1,
        createdAt: createdAt2,
        updatedAt: updatedAt2,
      })
    );
    domain12 = addResult2;
  });

  it("test find domain and sort asc by createdAt", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: false,
      sortDesc: false,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain11, domain12]);
  });

  it("test find domain and sort desc by createdAt", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: false,
      sortDesc: true,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain12, domain11]);
  });

  it("test find domain and sort asc by updatedAt", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: true,
      sortDesc: false,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain12, domain11]);
  });

  it("test find domain and sort desc by updatedAt", async function () {
    const result = await domainRepository.find(userId, {
      sortByUpdate: true,
      sortDesc: true,
    });
    expect(result).toBeTruthy();
    expect(result?.items).toHaveLength(2);
    expect(result?.items).toMatchObject([domain11, domain12]);
  });
});
