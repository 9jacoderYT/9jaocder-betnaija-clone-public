import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add a custom configuration to override specific rules
  {
    rules: {
      // Disable unused variables warnings
      "@typescript-eslint/no-unused-vars": "off",

      // Disable img element warnings
      "@next/next/no-img-element": "off",

      // Add any other rules you want to disable
    },
  },
];

export default eslintConfig;
