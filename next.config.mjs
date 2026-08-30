/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: Static export is disabled because the quote form now posts photos to a
  // serverless API route (app/api/quote/route.ts) so the business can receive
  // emails with attachments. If you decide to use a third-party form service
  // (e.g. Web3Forms) instead and want a fully static site again, re-enable:
  //   output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
