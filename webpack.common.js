const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require("terser-webpack-plugin");


module.exports = {
	optimization: {
		minimizer: [new TerserJSPlugin({})]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: "src/index.html" }),
    new CleanWebpackPlugin(),
	],
	resolve: { extensions: [".ts", ".js"] }
};
