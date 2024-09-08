import { events, token, tryRegisterPlugin } from "@/plugin.js";
import { LogLevel } from "@bytm/src/types.js";
import { log } from "@/logging.js";
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
    events.once("bytm:ready", main);
  }
  catch(err) {
    console.error("A generic error occurred:", err);
  }
});

// #region preInit
/** You can do anything in here that needs to be done as soon as the page loads, except modifying the DOM. */
function preInit() {
  // The following example needs to be run as soon as possible to be injected into as many event listeners as possible.
  // This way it will prevent the pesky "Are you sure you want to leave this page?" dialog from showing up when you navigate away from the page.
  unsafeWindow.BYTM.UserUtils.interceptWindowEvent("beforeunload", () => true);
}

// #region main
/** This function gets called whenever the plugin is fully registered and the DOM is available. */
async function main() {
  // This is where you can modify the DOM, add event listeners, etc.

  // For example, you could add a button to the page that does something when clicked:
  const button = document.createElement("button");
  button.textContent = "Click me!";

  // And then insert the button into a very specific element, as soon as it is found in the DOM:
  unsafeWindow.BYTM.addSelectorListener("playerBar", ".middle-controls-buttons", {
    listener: (btnsContainerElement) =>
      btnsContainerElement.appendChild(button),
    debounce: 100,
  });

  // And add accessible click and keyboard-press event listeners to the button:
  unsafeWindow.BYTM.onInteraction(button, async (evt) => {
    // (only add the style once)
    if(document.querySelector("#rainbowfill-style"))
      return;

    let confirmed = true;
    // (skip the prompt if the shift key is held down)
    if(!evt.shiftKey) {
      confirmed = await unsafeWindow.BYTM.showPrompt({
        message: "Hello from my cool plugin!\nAre you sure you want to continue?",
        type: "confirm",
        confirmBtnText: "Continue",
        confirmBtnTooltip: "Click to continue",
      });
    }

    // (insert some CSS when the prompt was confirmed or skipped)
    if(confirmed) {
      const styleElem = unsafeWindow.BYTM.UserUtils.addGlobalStyle(`\
@keyframes rainbowfill {
  0% { fill: #ff0000; }
  16.666% { fill: #ff7f00; }
  33.333% { fill: #ffff00; }
  50% { fill: #00ff00; }
  66.666% { fill: #3535ff; }
  83.333% { fill: #7b23dd; }
  100% { fill: #ff0000; }
}
tp-yt-iron-icon, svg path, .bytm-adorn-icon svg path, .bytm-toast-icon svg path {
  animation: rainbowfill 7s linear infinite;
}`
      );
      styleElem.id = "rainbowfill-style";
    }
  });

  // Or you can use authenticated function calls, since the plugin is now registered:
  const features = unsafeWindow.BYTM.getFeatures(token);
  if(features) {
    log("BYTM's locale is", features.locale);
    log("BYTM's log level is", features.logLevel, `(${LogLevel[features.logLevel]})`);
  }
}
