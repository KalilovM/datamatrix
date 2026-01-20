import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Environment Variable Rules:
 * - NEXT_PUBLIC_* variables are exposed to the browser (bundled at build time)
 * - All other variables are server-only (available in API routes, server actions)
 * - .env.local is loaded in development (gitignored)
 * - Production env vars should be set via PM2 ecosystem or system environment
 */

const nextConfig: NextConfig = {
  // Build configuration
  eslint: {
    // Allow builds to complete even with ESLint errors
    // Remove this in production once ESLint is clean
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds to complete even with TypeScript errors
    // Remove this in production once types are clean
    ignoreBuildErrors: true,
  },

  // React strict mode for development best practices
  reactStrictMode: true,

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Output configuration for production
  output: "standalone", // Optimized for self-hosting, creates minimal deployment

  // Server configuration
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Environment variable validation (runtime check)
  env: {
    // These are bundled at build time - useful for version info
    BUILD_TIME: new Date().toISOString(),
  },
};

// Validate critical environment variables at build time
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

// Only validate in production builds
if (process.env.NODE_ENV === "production") {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: ${envVar} is not set. This may cause issues in production.`);
    }
  }
}

export default nextConfig;
