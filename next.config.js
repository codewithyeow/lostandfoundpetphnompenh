/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    theme: 'DEFAULT',
  },
  images: {
    domains: ['www.pawboost.com', 'www.kimchheng.online',],
  },
};

module.exports = withNextIntl(nextConfig);