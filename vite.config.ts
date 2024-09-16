import "dotenv/config";
import { defineConfig, normalizePath, Plugin } from "vite";
import { execSync } from "child_process";
import tsConfigPathsPlugin from "vite-tsconfig-paths";
import monkeyPlugin from "vite-plugin-monkey";
import packageJson from "./package.json" with { type: "json" };

const { author, homepage, namespace, repository, userscriptName, version } = packageJson;
const { argv, env, cwd } = process;

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


const repo = repository.url.match(/github.com\/(.+?\/.+?)\//)?.[1] ?? defaultRepo;

const cliPortRaw = Number(argv.find(arg => arg.startsWith("--port="))?.split("=")[1]);
const envPortRaw = Number(env.DEV_SERVER_PORT);
/** HTTP port of the dev server */
const devServerPort = !isNaN(cliPortRaw)
  ? cliPortRaw
  : (
    !isNaN(envPortRaw)
      ? envPortRaw
      : defaultPort
  );

export default defineConfig(({ mode }) => {
  const buildNbr = getCommitSha();

  return {
    build: {
      minify: false,
    },
    plugins: [
      tsConfigPathsPlugin({
        root: import.meta.dirname,
      }),
      replaceStringsPlugin({
        "#{{BUILD_MODE}}": mode,
        "#{{BUILD_NUMBER}}": buildNbr,
      }),
      monkeyPlugin({
        entry: normalizePath(`${cwd()}/src/index.ts`), // see https://github.com/lisonge/vite-plugin-monkey/issues/186#issuecomment-2353496972
        userscript: {
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
          supportURL: packageJson.bugs.url,
          grant: [
            "unsafeWindow", // necessary for interacting with the BYTM API
            // these are commonly used - add or remove as needed:
            // "GM.getResourceURL",
            // "GM.getResourceText",
            // "GM.setValue",
            // "GM.getValue",
            // "GM.deleteValue",
            // "GM.openInTab",
          ],
          // don't run in iframes:
          noframes: true,
          match: [
            "https://youtube.com/*",
            "https://music.youtube.com/*",
          ],
          icon: getResourceUrl(mode, "assets/plugin_icon_128x128.png", buildNbr),
          resource: {
            icon_1000: getResourceUrl(mode, "assets/plugin_icon_1000x1000.png", buildNbr),
            icon_128: getResourceUrl(mode, "assets/plugin_icon_128x128.png", buildNbr),
          },
        },
      }),
    ],
  };
});

/** Replaces strings in the bundle with other strings. */
function replaceStringsPlugin(options: Record<string, string>): Plugin {
  return {
    name: "vite-plugin-custom-replace-strings",
    transform(code, _id) {
      for(const [searchValue, replaceValue] of Object.entries(options)) {
        const regex = new RegExp(searchValue, "gm");
        code = code.replace(regex, replaceValue);
      }
      return { code };
    }
  };
}

/**
 * Returns the commit sha of the latest commit for use as a build number.  
 *   
 * ⚠️ Important: This will always trail behind the current commit by one, as the act of committing this number will also change it.  
 * If your script depends on this number (for example for versioned GitHub asset URLs), you should always commit your build separately and last.
 */
function getCommitSha() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  }
  catch {
    console.error("\x1b[31mFailed to get the commit SHA. Is Git installed?\x1b[0m\nFalling back to 'BUILD_ERROR'.");
    return "BUILD_ERROR";
  }
}

/**
 * Returns the URL to a resource.  
 * In `development` mode, the resource is served by the dev server.  
 * In `production` mode, the resource is fetched using the given commit SHA or branch name (`main` by default).
 * @param mode `development` or `production`, defaults to `development`
 * @param path The path to the resource relative to the repository root
 * @param buildNbrOrBranch The build number or branch name to use in the URL, defaults to `main` - this is very useful for versioned asset URLs, which will never break by changes made to the `main` branch.
 */
function getResourceUrl(mode: string, path: string, buildNbrOrBranch: string = "main") {
  if(path.startsWith("/"))
    path = path.slice(1);

  return mode === "development"
    ? `http://localhost:${devServerPort}/${path}`
    : `https://raw.githubusercontent.com/${repo}/${buildNbrOrBranch}/${path}`;
}
