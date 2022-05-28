/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RxJsonSchema } from "rxdb";
import { Domain } from "./domain";

const RXDB_KEY_ID = "dbId";
const RXDB_KEY_SEPARATOR = "|";

interface RxDBKey {
  [RXDB_KEY_ID]: string;
}

type DomainRxDB = Domain & RxDBKey;
export const schema: RxJsonSchema<DomainRxDB> = {
  version: 0,
  title: "Domain Local Schema",
  description: "Domain Local Schema",
  primaryKey: {
    key: RXDB_KEY_ID,
    fields: ["id", "userId"],
    separator: RXDB_KEY_SEPARATOR,
  },
  type: "object",
  properties: {
    [RXDB_KEY_ID]: { type: "string", maxLength: 201 }, // userId + separator + id
    id: { type: "string", final: true, maxLength: 100 },
    userId: { type: "string", final: true, maxLength: 100 },
    version: { type: "number", minimum: 1 },
    createdAt: { type: "string", final: true, maxLength: 25 },
    updatedAt: { type: "string", maxLength: 25 },
    createdBy: { type: "string", final: true, maxLength: 100 },
    updatedBy: { type: "string", maxLength: 100 },
  },
  required: [
    RXDB_KEY_ID,
    "id",
    "userId",
    "version",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ] as Array<keyof DomainRxDB>,
  indexes: [
    "createdAt", // <- this will create a simple index for the `createdAt` field
    "updatedAt", // <- this will create a simple index for the `updatedAt` field
  ],
};
