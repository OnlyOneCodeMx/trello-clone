/**
 * Unsplash API Integration
 *
 * This file initializes the Unsplash API client with the provided access key.
 * The `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` environment variable must be set to authenticate API requests to Unsplash.
 * The `fetch` function is used to make HTTP requests to Unsplash's endpoints.
 */

import { createApi } from 'unsplash-js';

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch: fetch,
});
