/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_BACKEND_URL: string;
    // Add other environment variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  