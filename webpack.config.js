const path = require("path");

module.exports = {
    entry: {
        // content: './content-scripts/NewProblemContentScript.ts',
        background: path.resolve(__dirname, 'background.ts'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node-modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }, 
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname),
    },
};