/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make environment variables available to the client
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;