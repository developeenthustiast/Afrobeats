/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Environment variables for client-side
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_CAMP_TESTNET_RPC: process.env.NEXT_PUBLIC_CAMP_TESTNET_RPC,
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    },
}

module.exports = nextConfig
