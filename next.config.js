/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: 'imgix',
    path: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://client-staging-green.vercel.app',
  },
  env: {
    baseApiUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000' // development api
    : 'https://staging-api.tradestrek.com',
  },
  publicRuntimeConfig: {
    apiUrl:
    process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000' // development api
    : 'https://staging-api.tradestrek.com', // production api
  },
};

module.exports = nextConfig;