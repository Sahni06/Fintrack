import withBundleAnalyzer from '@next/bundle-analyzer'

if (typeof WritableStream === "undefined") {
  global.WritableStream = require("stream/web").WritableStream;
}

const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname: "randomuser.me",
            },
        ]
    },
    experimental:{
        serverActions:{
            bodySizeLimit: "5mb",
        }
    }
};

// Initialize the bundle analyzer with its options
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer ( nextConfig);
