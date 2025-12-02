// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// constants.js
const isProd = import.meta.env.VITE_ENV === "production";

export const API_BASE_URL = isProd
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL;

console.log("🔗 API_BASE_URL:", API_BASE_URL);
