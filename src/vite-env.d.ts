/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_API_KEY: string;
    // add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  