import nextPlugin from '@eslint/js';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  nextPlugin.configs.recommended,
  {
    rules: {
      // 企业级代码规范
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      curly: 'error',
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],

      // React相关规则
      'react/react-in-jsx-scope': 'off', // Next.js中不需要
      'react/prop-types': 'off', // 使用TypeScript时不需要
      '@next/next/no-img-element': 'off', // 允许使用img标签

      // Next.js相关规则
      '@next/next/no-html-link-for-pages': 'off', // 在大型项目中可能需要灵活处理
    },
  },
];
