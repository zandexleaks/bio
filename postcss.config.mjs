/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ new package
    autoprefixer: {},           // keep autoprefixer
  },
};

export default config;
