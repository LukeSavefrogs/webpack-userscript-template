// ----------------
// import { ConcatSource } from 'webpack-sources';
const { ConcatSource } = require('webpack-sources');
// ----------------
  
/**
 * Acts like webpack's `BannerPlugin` plugin but it gets executed after the 
 * minification, so that the banner doesn't get removed in the process.
 * 
 * @alias BannerAfterMinimizePlugin
 * @author kroko 
 * @since 24/04/2021 10:04
 * @see https://stackoverflow.com/a/67241531/8965861
 * 
 * @param {object} options - Configuration (identical to `BannerPlugin`).
 * @param {string} [options.banner=""] - The text to be added to the file.
 * @param {boolean} [options.raw=true] - False to surround the banner with comments. True to leave the banner as is.
*/
class BannerAfterMinimizePlugin {
	constructor ({
		banner = '',
		raw = true
	}) {
		this.raw = raw;
		this.banner = raw ? banner : `/*${banner}*/`;
	}
  
	apply (compiler) {
		compiler.hooks.emit.tapAsync('BannerAfterMinimizePlugin', (compilation, callback) => {
			compilation.chunks.forEach((chunk) => {
				chunk.files.forEach((file) => {
					compilation.updateAsset(
					file,
					(old) => new ConcatSource(this.banner, '\n', old)
					);
				});
			});
			callback();
		});
	}
}
  
// TODO:
// add key that would result in banner being applied
// only to chunks that satisfy regex
// i.e., to address extensions / chunk names
module.exports = BannerAfterMinimizePlugin;