/**
 * next.config.ts
 * Next.js configuration file. Most settings are left as defaults.
 *
 * CORS note: we do NOT use Next.js rewrites here because the frontend talks
 * directly to the backend using the NEXT_PUBLIC_API_URL environment variable.
 * CORS is handled on the backend side in Program.cs (AllowOrigins localhost:3000).
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // No extra config needed for this project
};

export default nextConfig;
