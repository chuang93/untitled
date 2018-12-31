const nodeExternals = require('webpack-node-externals');
//TO DO: FIGURE OUT HOW TO CONFIGURE WEBBACK FOR HTML LOADING AS WELL FOR NOW HARDCODE HTML
//SCRIPT INCLUDE SECTION TO BUNDLED JS OUTPUT.
module.exports ={
    entry: {
        login:'./public/javascripts/Login.js',
        layout:'./public/javascripts/Layout.js',
    },
    output:{
        filename: "[name].js",
        path: __dirname + '/dist',
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
        ]
    },
};