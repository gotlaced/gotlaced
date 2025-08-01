// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://gotlaced.lol",
  output: "server",
  image: {
    service: { name: "compile"}
  },
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
