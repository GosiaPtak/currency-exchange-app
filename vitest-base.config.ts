import { defineConfig } from 'vitest/config';

// Ionic ships packages with directory-style ESM exports that Node's
// native module resolution (used for externalized deps) can't handle.
// Forcing Vite to transform them instead avoids that resolution error.
export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [/@ionic\//, /ionicons/],
      },
    },
  },
});
