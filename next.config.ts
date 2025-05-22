import type { NextConfig } from "next";

const nextConfig = {
  env: {
      /*로컬 테스트용 */
      //NEXT_PUBLIC_API_URL:"http://localhost:8081"

      /*쿠버네티스 배포용*/
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
