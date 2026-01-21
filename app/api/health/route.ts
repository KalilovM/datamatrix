import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

/**
 * Health Check Endpoint
 *
 * Used by:
 * - Load balancers
 * - Deployment scripts (post-deploy verification)
 * - Monitoring systems
 *
 * Returns:
 * - 200: Application is healthy
 * - 503: Application is unhealthy (DB connection failed, etc.)
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || "unknown",
        checks: {
          database: "connected",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV,
        checks: {
          database: "disconnected",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
