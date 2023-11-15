import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

// const client = createClient({
//   projectId: "3zn6r243",
//   dataset: "production",
//   apiVersion: "2023-11-13",
//   useCdn: false
// });
