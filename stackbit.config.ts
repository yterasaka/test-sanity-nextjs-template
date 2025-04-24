// stackbit.config.ts

import {
  defineStackbitConfig,
  ModelWithSource,
  PageModel,
} from "@stackbit/types";
import { SanityContentSource } from "@stackbit/cms-sanity";
import path from "path";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs",
  nodeVersion: "16",
  contentSources: [
    new SanityContentSource({
      rootPath: __dirname,
      studioPath: path.join(__dirname, "studio"),
      studioUrl: "https://test-sanity-nextjs-template.sanity.studio/",
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      token: process.env.SANITY_API_READ_TOKEN!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    }),
  ],
  mapModels: (options: { models: ModelWithSource[] }): ModelWithSource[] => {
    return options.models.map((model) => {
      if (model.name === "page") {
        // PageModel として扱うことをコンパイラに保証
        const page = model as PageModel & {
          srcType: string;
          srcProjectId: string;
        };
        return {
          ...page,
          type: "page",
          urlPath: "/{slug}",
        };
      }
      return model;
    });
  },
});
