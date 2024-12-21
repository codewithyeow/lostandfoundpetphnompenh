/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   experimental: {
      missingSuspenseWithCSRBailout: false,
   },
   publicRuntimeConfig: {
      // Available on both server and client
      theme: 'DEFAULT',
   },
};

// module.exports = nextConfig;
module.exports = withNextIntl(nextConfig);
