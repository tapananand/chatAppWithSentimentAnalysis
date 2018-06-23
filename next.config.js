const webpack = require("webpack");
require("dotenv").config();

module.exports = {
    webpack: (config) => {
        let env = Object.keys(process.env).reduce((prev, curr) => {
            prev[curr] = JSON.stringify(process.env[curr]);
            return prev;
        }, {});

        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    }
}