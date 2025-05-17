// // // // import { dirname } from "path";
// // // // import { fileURLToPath } from "url";
// // // // import { FlatCompat } from "@eslint/eslintrc";

// // // // const __filename = fileURLToPath(import.meta.url);
// // // // const __dirname = dirname(__filename);

// // // // const compat = new FlatCompat({
// // // //   baseDirectory: __dirname,
// // // // });

// // // // const eslintConfig = [
// // // //   ...compat.extends("next/core-web-vitals", "next/typescript"),
// // // // ];

// // // // export default eslintConfig;

// // // {
// // //   "extends": [
// // //     "next/core-web-vitals",
// // //     "eslint:recommended",
// // //     "plugin:react/recommended"
// // //   ],
// // //   "rules": {
// // //     // Disable the unescaped entities rule since these are handled by React
// // //     "react/no-unescaped-entities": "off",
    
// // //     // Disable the img element warning if you don't want to use next/image
// // //     "@next/next/no-img-element": "off",
    
// // //     // Set exhaustive-deps to warn instead of error
// // //     "react-hooks/exhaustive-deps": "warn",
    
// // //     // Disable undefined components error if you're using motion from framer-motion
// // //     "react/jsx-no-undef": ["error", { "allowGlobals": true }],
    
// // //     "no-unused-vars": "off",
// // //     "@typescript-eslint/no-unused-vars": "off"
// // //   },
// // //   "settings": {
// // //     "react": {
// // //       "version": "detect"
// // //     }
// // //   }
// // // }
// // import { dirname } from "path";
// // import { fileURLToPath } from "url";
// // import { FlatCompat } from "@eslint/eslintrc";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const compat = new FlatCompat({
// //   baseDirectory: __dirname,
// // });

// // // Create flat config by extending from the traditional configs
// // const eslintConfig = [
// //   ...compat.extends(
// //     "next/core-web-vitals", 
// //     "eslint:recommended", 
// //     "plugin:react/recommended"
// //   ),
// //   {
// //     rules: {
// //       // Disable the unescaped entities rule since these are handled by React
// //       "react/no-unescaped-entities": "off",
      
// //       // Disable the img element warning if you don't want to use next/image
// //       "@next/next/no-img-element": "off",
      
// //       // Set exhaustive-deps to warn instead of error
// //       "react-hooks/exhaustive-deps": "warn",
      
// //       // Disable undefined components error if you're using motion from framer-motion
// //       "react/jsx-no-undef": ["error", { "allowGlobals": true }],
      
// //       "no-unused-vars": "off",
// //       "@typescript-eslint/no-unused-vars": "off"
// //     },
// //     settings: {
// //       react: {
// //         version: "detect"
// //       }
// //     }
// //   }
// // ];

// // export default eslintConfig;
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Add the recommended config parameter
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: {}, // Add this empty object for the recommended config
// });

// // Create flat config by extending from the traditional configs
// const eslintConfig = [
//   ...compat.extends(
//     "next/core-web-vitals", 
//     "eslint:recommended", 
//     "plugin:react/recommended"
//   ),
//   {
//     rules: {
//       "react/no-unescaped-entities": "off",
//       "@next/next/no-img-element": "off",
//       "react-hooks/exhaustive-deps": "warn",
//       "react/jsx-no-undef": ["error", { "allowGlobals": true }],
//       "no-unused-vars": "off",
//       "@typescript-eslint/no-unused-vars": "off"
//     },
//     settings: {
//       react: {
//         version: "detect"
//       }
//     }
//   }
// ];

// export default eslintConfig;
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {} // Add this for the required parameter
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals"
  ),
  {
    rules: {
      // Disable React in scope rule since Next.js doesn't require it with new JSX transform
      "react/react-in-jsx-scope": "off",
      
      // Disable prop-types validation since you're likely using TypeScript
      "react/prop-types": "off",
      
      // Keep these other rules
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-undef": ["error", { "allowGlobals": true }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      
      // Fix anonymous export warning
      "import/no-anonymous-default-export": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];

export default eslintConfig;