module.exports = {
   env: {
      browser: true,
      es2021: true,
   },
   extends: [
      'airbnb',
      'airbnb/hooks',
      'airbnb-typescript',
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
   ],
   overrides: [],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['**/tsconfig.eslint.json', '**/tsconfig.json'],
      tsconfigRootDir: '.',
   },
   plugins: ['react', '@typescript-eslint', 'prettier'],
   ignorePatterns: [
      'vite.config.ts',
      'tailwind.config.cjs',
      'postcss.config.cjs',
   ],
   rules: {
      'react/react-in-jsx-scope': 0,
      'lines-between-class-members': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/exhaustive-deps': 'off',
   },
};
