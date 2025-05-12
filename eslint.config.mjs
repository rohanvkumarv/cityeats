// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    // Disable the unescaped entities rule since these are handled by React
    "react/no-unescaped-entities": "off",
    
    // Disable the img element warning if you don't want to use next/image
    "@next/next/no-img-element": "off",
    
    // Set exhaustive-deps to warn instead of error
    "react-hooks/exhaustive-deps": "warn",
    
    // Disable undefined components error if you're using motion from framer-motion
    "react/jsx-no-undef": ["error", { "allowGlobals": true }],
    
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}