import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['framer-motion'],
  // Standard build (no static export)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
