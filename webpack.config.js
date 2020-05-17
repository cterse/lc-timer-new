const path = require("path");

module.exports = env => { 
    var commonConfig = {
        mode: env.NODE_ENV ? env.NODE_ENV : 'production',
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
        
    return [Object.assign({}, commonConfig, backgroundConfig), Object.assign({}, commonConfig, contentConfig)]; 
}