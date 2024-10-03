import { createClient } from "next-sanity";

import { ENV } from "@/config/env";

export const client = createClient({
  projectId: ENV.SANITY_PROJECT_ID,
  dataset: ENV.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});
