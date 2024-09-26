/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
	tabWidth: 4,
	useTabs: true,
	trailingComma: 'es5',
	singleQuote: true,
	jsxSingleQuote: true,
	endOfLine: 'auto',
	printWidth: 120,
	plugins: ['@ianvs/prettier-plugin-sort-imports'],
	importOrder: [
		'.*styles.css$',
		'',
		'dayjs',
		'^react$',
		'^next$',
		'^next/.*$',
		'<BUILTIN_MODULES>',
		'<THIRD_PARTY_MODULES>',
		'^@mantine/(.*)$',
		'^@mantinex/(.*)$',
		'^@mantine-tests/(.*)$',
		'^@docs/(.*)$',
		'^@/.*$',
		'^../(?!.*.css$).*$',
		'^./(?!.*.css$).*$',
		'\\.css$',
	],
	overrides: [
		{
			files: '*.mdx',
			options: {
				printWidth: 70,
			},
		},
	],
};

export default config;
