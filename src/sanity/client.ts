import { createClient } from 'next-sanity';

import { ENV } from '@/config/env';

export const client = createClient({
  projectId: ENV.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: ENV.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});
