// required for path resolution for dist folder
const path = require("path");
const fs = require('fs');

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const BannerAfterMinimizePlugin = require("./banner-after-minimize-plugin");

if (!fs.existsSync(path.resolve(__dirname, './userscript.config.js'))) {
	console.error("Please create and populate 'userscript.config.js' file");
	process.exit(1);
}

const userConfig = require("./userscript.config.js");

console.log("Metadata: ", path.resolve(__dirname, userConfig['input']['metadata']));

const metadata = fs.readFileSync(
	path.resolve(__dirname, userConfig['input']['metadata']), { encoding:'utf8', flag:'r' }
);

const IS_PRODUCTION = !(process.env.NODE_ENV === "production");

console.log("IS_PRODUCTION: ", IS_PRODUCTION);

var startMetadataSection = false;
module.exports = {
	entry: userConfig['input']['main'],

	// Enable sourcemaps for debugging webpack's output.
	devtool: IS_PRODUCTION ? false : "inline-source-map",
	mode: IS_PRODUCTION ? "production" : "development",

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: userConfig['output']['filename'],
		clean: true,
		pathinfo: true,
		iife: false,
	},

	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			terserOptions: {
				format: {
					comments: IS_PRODUCTION ? false : (astNode, comment) => {
						// console.log(comment.line);
						// if (/==\/?UserScript==|@[a-zA-Z0-9_]+/.test(comment.value)) {
						// 	return true;
						// }
			
						return true;
					},
				},
			},
			// extractComments: false,
			extractComments: {
				condition: false,
				banner: false
			},
			// extractComments: (astNode, comment) => {
			// 	console.log(comment);
			// 	if (/@author/i.test(comment.value)) {
			// 		return true;
			// 	}
	
			// 	return false;
			// },
	  
		})],
	},
	
	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		// extensions: [".ts", ".tsx", ".js"],
		// extensions: [".js"],
	},
	module: {
		rules: []
	},
	plugins: [		
		// new webpack.BannerPlugin({
		// 	raw: true,
		// 	banner: metadata
		// }),
		new BannerAfterMinimizePlugin({
			raw: true,
			banner: metadata,
		})
	],
};