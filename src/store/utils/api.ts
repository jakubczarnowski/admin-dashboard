import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { envs } from '../../common/envs';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: envs.BASE_URL,
  }),

  endpoints: () => ({}),
});
