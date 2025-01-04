import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn', // Change to 'warn' or 'off' as needed
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_', // Ignore variables starting with "_"
          varsIgnorePattern: '^_', // Ignore imports starting with "_"
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'warn', // Change to 'warn' or 'off' based on your preference
        {
          fixToUnknown: false, // Keep 'any' instead of automatically fixing to 'unknown'
          ignoreRestArgs: false, // Optionally ignore 'rest' arguments
        },
      ],
    }
  },
);