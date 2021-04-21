/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const babel = require( '@rollup/plugin-babel' ).babel;
const nodeResolve = require( '@rollup/plugin-node-resolve' ).nodeResolve;
const replace = require( '@rollup/plugin-replace' );
const commonJs = require( '@rollup/plugin-commonjs' );
const polyfillNode = require( 'rollup-plugin-polyfill-node' );
const progress = require( 'rollup-plugin-progress' );

module.exports = function( config ) {
	config.set( {
		browsers: [ 'Chrome' ],

		frameworks: [ 'jasmine' ],

		files: [
			'https://cdn.ckeditor.com/4.16.0/standard-all/ckeditor.js',
			{ pattern: 'tests/unit/jasmine.js', watched: false },
			{ pattern: 'tests/unit/tests.tsx', watched: false }
		],

		preprocessors: {
			'tests/unit/jasmine.js': [ 'rollup' ],
			'tests/unit/tests.tsx': [ 'rollup' ]
		},

		reporters: [ 'mocha' ],

		rollupPreprocessor: {
			output: {
				format: 'iife',
				name: 'CKEditor4React'
			},
			plugins: [
				!config.silentBuildLogs && progress(),
				babel( {
					babelHelpers: 'bundled',
					presets: [
						'@babel/preset-env',
						'@babel/preset-typescript',
						'@babel/preset-react'
					],
					extensions: [ '.ts', '.tsx', '.js' ],
					exclude: 'node_modules/**'
				} ),
				nodeResolve( {
					preferBuiltins: false,
					extensions: [ '.ts', '.tsx', '.js' ]
				} ),
				commonJs(),
				polyfillNode(),
				replace( {
					preventAssignment: true,
					values: {
						'process.env.REQUESTED_REACT_VERSION': JSON.stringify(
							process.env.REQUESTED_REACT_VERSION
						)
					}
				} )
			].filter( Boolean ),
			onwarn( warning, rollupWarn ) {
				if (
					// Reduces noise for circular deps
					// https://github.com/rollup/rollup/issues/2271
					warning.code !== 'CIRCULAR_DEPENDENCY' &&
					// Prevents warning about known issue when bundling RTL
					// https://github.com/testing-library/react-testing-library/issues/790
					warning.code !== 'NAMESPACE_CONFLICT'
				) {
					rollupWarn( warning );
				}
			}
		}
	} );
};
