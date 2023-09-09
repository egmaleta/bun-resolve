import { type BunPlugin, file } from "bun";

type PluginOptions = {
  alias: Record<string, string>;
};

function plugin(options?: PluginOptions): BunPlugin {
  const alias = options?.alias;

  return {
    name: "bun-resolve",
    setup(build) {
      alias &&
        build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
          // open file & read content
          // for each alias entry: search entry.key and replace by entry.value
          let contents = await file(args.path).text();
          Object.entries(alias).forEach(([originalText, newText]) => {
            contents = contents.replaceAll(originalText, newText);
          });

          return {
            contents,
            loader: args.loader,
          };
        });
    },
  };
}

export default plugin;
