import type { BytmObject, PluginDef, PluginRegisterResult } from "@bytm/src/types.js";

declare global {
  interface Window {
    BYTM: BytmObject;
  }
  
  interface WindowEventMap {
    "bytm:registerPlugin": CustomEvent<(def: PluginDef) => PluginRegisterResult>;
  }
}
