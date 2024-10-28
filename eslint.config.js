import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

import typescriptEslint from "@typescript-eslint/eslint-plugin";
import dwordDesignImportAlias from "@dword-design/eslint-plugin-import-alias";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [...compat.extends(
	"eslint:recommended",
	"plugin:@typescript-eslint/eslint-recommended",
	"plugin:@typescript-eslint/recommended"
), {
	plugins: {
		"@typescript-eslint": typescriptEslint,
		"@dword-design/import-alias": dwordDesignImportAlias
	},

	languageOptions: {
		globals: {
			...globals.node,
			Atomics: "readonly",
			SharedArrayBuffer: "readonly"
		},

		parser: tsParser,
		ecmaVersion: 5,
		sourceType: "module",

		parserOptions: {
			project: "./tsconfig.json"
		}
	},

	ignores: ["eslint.config.js"],

	rules: {
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-function-type": "off",
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-unnecessary-condition": "error",
		"@typescript-eslint/prefer-readonly": "error",
		"@typescript-eslint/consistent-type-imports": "error",

		"@typescript-eslint/explicit-member-accessibility": ["error", {
			accessibility: "no-public",

			overrides: {
				parameterProperties: "explicit"
			}
		}],

		"@typescript-eslint/no-unused-vars": ["error", {
			destructuredArrayIgnorePattern: "^_",
			argsIgnorePattern: "^_"
		}],

		"@typescript-eslint/naming-convention": ["error", {
			selector: "default",
			trailingUnderscore: "forbid",
			leadingUnderscore: "forbid",
			format: ["camelCase"]
		}, {
			selector: ["variable", "property"],
			format: ["camelCase", "snake_case", "UPPER_CASE"]
		}, {
			selector: ["typeLike", "enumMember"],
			format: ["PascalCase"]
		}, {
			selector: ["variableLike", "method", "property"],
			modifiers: ["private"],
			format: ["camelCase"],
			leadingUnderscore: "require"
		}, {
			selector: "parameter",
			leadingUnderscore: "require",
			modifiers: ["unused"],
			format: ["camelCase"]
		}, {
			selector: "import",
			leadingUnderscore: "allow",
			trailingUnderscore: "allow",
			format: ["camelCase", "PascalCase"]
		}],

		"@dword-design/import-alias/prefer-alias": ["error", {
			alias: {
				"@utils": "./src/utils",
				"@managers": "./src/managers",
				"@": "./src"
			}
		}],

		"no-unused-vars": "off",
		"no-compare-neg-zero": "error",
		"no-template-curly-in-string": "error",
		"no-unsafe-negation": "error",
		"accessor-pairs": "warn",
		"array-callback-return": "error",
		complexity: ["warn", 25],
		"no-floating-decimal": "error",
		"no-lone-blocks": "error",
		"no-multi-spaces": "error",
		"no-new-func": "error",
		"no-new-wrappers": "error",
		"no-new": "error",
		"no-octal": "error",
		"no-return-assign": "error",
		"no-return-await": "error",
		"no-self-compare": "error",
		"no-sequences": "error",
		"no-unmodified-loop-condition": "error",
		"no-unused-expressions": "error",
		"no-useless-call": "error",
		"no-useless-concat": "error",
		"no-useless-escape": "error",
		"no-useless-return": "error",
		"no-void": "error",
		"no-warning-comments": "warn",
		"prefer-promise-reject-errors": "error",
		"require-await": "warn",
		yoda: "error",
		"no-label-var": "error",
		"no-shadow": "off",
		"no-undef-init": "error",
		"callback-return": "error",
		"getter-return": "error",
		"handle-callback-err": "error",
		"no-mixed-requires": "error",
		"no-new-require": "error",
		"no-path-concat": "error",
		"block-spacing": "error",
		"dot-notation": "error",
		eqeqeq: "error",
		"comma-spacing": "error",
		"comma-style": "error",
		"computed-property-spacing": "error",
		"func-names": "error",
		"func-name-matching": "error",
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"template-tag-spacing": "error",
		"unicode-bom": "error",
		"arrow-spacing": "error",
		"no-useless-computed-key": "error",
		"prefer-arrow-callback": "error",
		"prefer-numeric-literals": "error",
		"prefer-rest-params": "error",
		"prefer-spread": "error",
		"prefer-template": "error",
		"rest-spread-spacing": "error",
		"template-curly-spacing": "error",
		"yield-star-spacing": "error",
		"no-array-constructor": "error",
		"no-lonely-if": "error",
		"no-mixed-operators": "error",
		"no-new-object": "error",
		"no-trailing-spaces": "error",
		"no-unneeded-ternary": "error",
		"no-whitespace-before-property": "error",
		"nonblock-statement-body-position": "error",
		"semi-spacing": "error",
		"space-before-blocks": "error",
		"key-spacing": "error",
		"keyword-spacing": "error",
		"max-depth": "error",
		"operator-assignment": "error",
		"array-bracket-spacing": ["error", "never"],
		semi: ["error", "always"],
		curly: ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],

		"no-empty-function": ["error", {
			allow: ["constructors"]
		}],

		"brace-style": ["error", "1tbs", {
			allowSingleLine: true
		}],

		"capitalized-comments": ["error", "always", {
			ignoreConsecutiveComments: true
		}],

		"comma-dangle": ["error", "never"],
		"consistent-this": ["error", "$this"],

		"func-style": ["error", "declaration", {
			allowArrowFunctions: true
		}],

		indent: ["error", "tab", {
			SwitchCase: 1
		}],

		"max-nested-callbacks": ["error", {
			max: 4
		}],

		"max-statements-per-line": ["error", {
			max: 2
		}],

		"newline-per-chained-call": ["error", {
			ignoreChainWithDepth: 3
		}],

		"no-multiple-empty-lines": ["error", {
			max: 2,
			maxEOF: 1,
			maxBOF: 0
		}],

		"object-curly-spacing": ["error", "always"],
		"padded-blocks": ["error", "never"],
		"quote-props": ["error", "as-needed"],

		quotes: ["error", "double", {
			avoidEscape: true,
			allowTemplateLiterals: true
		}],

		"space-before-function-paren": ["error", {
			asyncArrow: "always",
			anonymous: "never",
			named: "never"
		}],

		"arrow-parens": ["error", "as-needed"]
	}
}];