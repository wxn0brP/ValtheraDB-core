import CustomFileCpu from "./customFileCpu";
import ValtheraMemory, { createMemoryValthera } from "./db/memory";
import ValtheraClass from "./db/valthera";
import genId from "./helpers/gen";
import Relation from "./helpers/relation";
import { ValtheraTypes } from "./types/export";
import { RelationTypes } from "./types/relation";
import { ValtheraCompatible } from "./types/valthera";
import { forgeTypedValthera, forgeValthera } from "./helpers/forge";

export {
    createMemoryValthera,
    CustomFileCpu,
    forgeTypedValthera,
    forgeValthera,
    genId,
    Relation,
    ValtheraClass,
    ValtheraMemory,
};

export type {
    RelationTypes,
    ValtheraCompatible,
    ValtheraTypes,
};

export type Id = import("./types/Id").Id;