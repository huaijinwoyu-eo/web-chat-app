/**
 * Created by 18730 on 2016/10/17.
 */
var webpack = require("webpack");
module.exports = {
    entry:"./modules/login-register.jsx",
    output:{
        path: __dirname +"/public/javascript/",
        filename:"bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            loader: 'jsx-loader?harmony'
        }]
    }
};