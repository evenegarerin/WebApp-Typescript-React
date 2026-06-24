import next from "eslint-config-next";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = [
    {
        ignores: [".next/**", "node_modules/**", "drizzle/**", "next-env.d.ts"],
    },
    ...next,
    // Keep ESLint out of formatting decisions; Prettier owns those.
    prettier,
    {
        rules: {
            // Advisory perf/correctness hints, not bugs — keep visible as warnings
            // rather than failing the build.
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];

export default eslintConfig;
