/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  webpack(config) {
    // @splinetool/react-spline v4 is pure ESM; webpack can't resolve its exports
    // map correctly in this setup. Alias it directly to the compiled dist file.
    config.resolve.alias['@splinetool/react-spline'] = path.resolve(
      __dirname,
      'node_modules/@splinetool/react-spline/dist/react-spline.js'
    );
    return config;
  },
};

module.exports = nextConfig;
