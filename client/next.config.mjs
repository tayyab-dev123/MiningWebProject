/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn-news.shironam.news",
          port: "",
          pathname: "/storage/shironam-media/**",
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`,
        },
      ];
    },
    
  trailingSlash: true,

  };
  
  export default nextConfig;