const webpack = require("webpack");
const path = require("path");

var sourcePath = path.resolve(__dirname, "source");
var buildPath = path.resolve(__dirname, "public", "build");

var config = {
    entry: {
        "index": sourcePath + "/main.js"
    },
    output: {
        filename:"[name]bundle.js",
        path: buildPath
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery: "jquery"
        })
    ]
};
module.exports = config;