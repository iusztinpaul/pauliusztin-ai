/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the articles proxy. Leave it unset and the client uses
   * /api/articles, the Function that ships with the site; set it to an empty
   * string to skip the call and serve the baked snapshots instead.
   */
  readonly VITE_ARTICLES_ENDPOINT?: string;
}
