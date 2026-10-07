import js from "@eslint/js"
import pluginVitest from "@vitest/eslint-plugin"

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  js.configs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  {
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },
]
