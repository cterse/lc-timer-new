const path = require("path");

var commonConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                    },
                }],
                exclude: /node-modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }, 
};

var backgroundConfig = {
    entry: {
        background: path.resolve(__dirname, 'background.ts'),
    },
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

var contentConfig = {
    entry: {
        problemLoad: path.resolve(__dirname, 'content-scripts', 'NewProblemContentScript.ts'),
        // problemSubmit: 'SubmitProblemContentScript.ts',
    },
    output: {
        filename: 'content.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

module.exports = [Object.assign({}, commonConfig, backgroundConfig), Object.assign({}, commonConfig, contentConfig)];