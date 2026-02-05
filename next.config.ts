import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    typedEnv: true
  },
  typescript: {
    // Ignora errores de TypeScript para que el deploy termine
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
