/* eslint-env node */
'use strict';

var path = require('path'),
	webpack = require('webpack');

var bowerRoot = './bower.json';

var resolveBowerPath = function(componentPath) {
	return path.join(__dirname, './bower_components', componentPath || '');
};

module.exports = {
	cache: true,
	entry: './src/main',
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'game.js'
	},
	resolve: {
		root: [
			resolveBowerPath(),
			path.join(__dirname, 'src')
		],
		alias: {
			bower: resolveBowerPath(),
			lodash: resolveBowerPath('/lodash'),
			phaser: resolveBowerPath('/phaser/build/phaser.min')
		}
	},
	module: {
		loaders: [
			//{ test: /\.js$/,	loader: 'strict'},
			{ test: /(phaser.min)\.js$/i, loader: 'script' },
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel'
			}
		],
		noParse: [
			/[\/\\]bowe_components[\/\\].*$/,
			resolveBowerPath('/phaser/build/phaser.min')
		]
	},
	plugins: [
		new webpack.ResolverPlugin(
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(bowerRoot, ['main']), ['normal', 'loader']
		),
		new webpack.ContextReplacementPlugin(/.*$/, /a^/),
		new webpack.ProvidePlugin({
			_: 'exports?window._!bower/lodash',
			Phaser: 'exports?window.Phaser!bower/phaser/build/phaser.min'
		})
	]
};
