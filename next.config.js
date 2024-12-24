// next.config.js
/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
   reactStrictMode: true,
   publicRuntimeConfig: {
      theme: 'DEFAULT',
   },
};

module.exports = withNextIntl(nextConfig);
