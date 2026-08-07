const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: isProd ? "/gesture-data-viz-app" : "",
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
