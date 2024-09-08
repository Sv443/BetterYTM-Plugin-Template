import { events, tryRegisterPlugin } from "@/plugin.js";
import { log } from "@/logging.js";
import { examplePreInit } from "@/example/preInit.ts";
import { exampleMainEntrypoint } from "@/example/main.ts";
import { someJsdocFunction, somePlainFunction } from "@/example/plainJs.mjs";
import "@/types.js";

// #region register plugin
// This is the entry point of your plugin:
unsafeWindow.addEventListener("bytm:registerPlugin", async (registerPlugin) => {
  try {
    // Call a few functions that need to be run as soon as possible:
    preInit();

    try {
      // Register the plugin with BetterYTM to be able to call authenticated API functions:
      await tryRegisterPlugin(registerPlugin);
      log(`Registered plugin successfully!\nUsing the BetterYTM API v${unsafeWindow.BYTM.version}`);
    }
    catch(err) {
      console.error("Couldn't register plugin:", err);
    }

    // Run the main code of your plugin once BYTM and the DOM are ready:
    events.once("bytm:ready", run);
  }
  catch(err) {
    console.error("A generic error occurred:", err);
  }
});

// #region preInit
/** You can do anything in here that needs to be done as soon as the page loads, except modifying the DOM. */
function preInit() {
  // Check out this example code in src/example/preInit.ts:
  examplePreInit();

  // example of calling functions from the plain JS module src/example/plainJs.mjs:
  const foo = someJsdocFunction(9);                     // this one has a typed argument and typed return value
  const bar = somePlainFunction("any type is allowed"); // this one accepts any type but still has a typed return value

  log("foo:", foo, "bar:", bar);
}

// #region main
/** This function gets called whenever the plugin is fully registered and the DOM is available. */
async function run() {
  // This is where you can modify the DOM, add event listeners, etc.

  // Check out this example code in src/example/main.ts:
  await exampleMainEntrypoint();
}
