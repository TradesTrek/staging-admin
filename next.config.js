module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverRuntimeConfig: {
    secret:
      'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING',
  },
  env: {
    baseApiUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000' // development api
    : 'https://staging-api.tradestrek.com'
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000' // development api
        : 'https://staging-api.tradestrek.com', // production api
  },
  images: {
    loader: 'imgix',
    path:  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000' : 'https://client-staging-green.vercel.app/',
  },
};
