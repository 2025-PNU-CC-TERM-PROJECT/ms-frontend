import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_GRAFANA_URL: process.env.NEXT_PUBLIC_GRAFANA_URL,
		NEXT_PUBLIC_KIALI_URL: process.env.NEXT_PUBLIC_KIALI_URL,
	},
};

module.exports = nextConfig;
