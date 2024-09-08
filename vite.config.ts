import "dotenv/config";
import { defineConfig } from "vite";
import UserscriptPlugin from "vite-userscript-plugin";
import TSConfigPathsPlugin from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };

const { author, homepage, namespace, repository, userscriptName, version } = packageJson;

/**
 * Default port of the dev server.  
 * First tries to use the port specified by the "--port" argument, then the "DEV_SERVER_PORT" environment variable, and finally falls back to this value.
 */
export const defaultPort = 8767;
/**
 * Default repository (in the format "User/Repo") to use for all URLs that point to the repository.  
 * First tries to resolve the repository URL from `repository.url` in "package.json", then falls back to this value.
 */
export const defaultRepo = "Sv443/BetterYTM-Plugin-Template";


const repo = repository.url.match(/github.com\/(.+?)\//)?.[1] ?? defaultRepo;

const cliPortRaw = Number(process.argv.find(arg => arg.startsWith("--port="))?.split("=")[1]);
const envPortRaw = Number(process.env.DEV_SERVER_PORT);
/** HTTP port of the dev server */
const devServerPort = !isNaN(cliPortRaw)
  ? cliPortRaw
  : (
    !isNaN(envPortRaw)
      ? envPortRaw
      : defaultPort
  );


export default defineConfig(({ mode }) => {
  return {
    build: {
      minify: false,
    },
    plugins: [
      TSConfigPathsPlugin(),
      UserscriptPlugin({
        entry: "src/index.ts",
        esbuildTransformOptions: {
          // the userscript can't be minified, because GreasyFork will reject it and because it is safer for the end user to have readable code
          minify: false,
        },
        header: {
          name: userscriptName,
          namespace,
          version,
          // necessary to make sure the plugin is registered in time and can make proper use of all API features:
          "run-at": "document-start",
          author: author.name,
          connect: [
            "i.ytimg.com",
            "youtube.com",
            "github.com",
          ],
          copyright: `Copyright ${new Date().getFullYear()} ${author.name}`,
          description: "This is an example plugin for BetterYTM - https://github.com/Sv443/BetterYTM",
          homepageURL: homepage,
          grant: [
            // these are commonly used - add or remove as needed:
            "unsafeWindow",
            "GM.getResourceURL",
            "GM.getResourceText",
            "GM.setValue",
            "GM.getValue",
            "GM.deleteValue",
            "GM.openInTab",
          ],
          // don't run in iframes:
          noframes: true,
          match: [
            "https://youtube.com/*",
            "https://music.youtube.com/*",
          ],
          iconURL: getResourceUrl(mode, "assets/plugin_icon_128x128.png"),
          // since the .meta.js is not committed, updating via that URL is not possible
          updateURL: undefined,
          resource: [
            ["icon_1000", getResourceUrl(mode, "assets/plugin_icon_1000x1000.png")],
            ["icon_128", getResourceUrl(mode, "assets/plugin_icon_128x128.png")],
          ]
        },
      }),
    ],
  };
});

/**
 * Returns the URL to a resource.  
 * In `development` mode, the resource is served by the dev server.  
 * In `production` mode, the resource is fetched from the repository's `main` branch.
 * @param mode `development` or `production`, defaults to `development`
 * @param path The path to the resource relative to the repository root
 */
function getResourceUrl(mode: string, path: string) {
  if(path.startsWith("/"))
    path = path.slice(1);
  return mode === "development"
    ? `http://localhost:${devServerPort}/${path}`
    : `https://raw.githubusercontent.com/${repo}/main/${path}`;
}
