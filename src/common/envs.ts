const envs = {
  BASE_URL: import.meta.env.VITE_BASE_URL as string,
} as const;

if (!envs.BASE_URL) {
  throw new Error('VITE_BASE_URL is undefined');
}

export { envs };
