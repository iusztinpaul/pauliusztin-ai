/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the articles proxy; unset means "use the baked snapshots". */
  readonly VITE_ARTICLES_ENDPOINT?: string;
}
