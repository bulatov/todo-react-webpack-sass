// IN NATIVE WINDOWS TERMINAL
// set NODE_ENV=development& webpack
const nodeEnv = 'development';

const NODE_ENV = nodeEnv || process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function addHash(template, hash) {
    // ussage: addHash('[name].js', 'chunkhash'), -> '[name].[chunkhash].js'
    return NODE_ENV === 'production' ?
        template.replace(/\.[^.]+$/, `.[${hash}]$&`) : template;
}

module.exports = {
    // prefix for entry
    context: __dirname + '/frontend',

    // use [] for prop values to specify several modules to be built into single chunk..for example navigation: ['./hmenu', '.vmenu']
    // all modules in [] will be loaded and run, but the last only will export to 'library' if specified in output
    entry: {
        main: './main',
        //common: './common'
    },

    output: {
        path: path.join(__dirname, '/public/assets'),
        filename: '[name].js',
        chunkFilename: '[id].js',
        // global variable with name as properties in entry containing exports object
        library: '[name]',
        // require.ensures is bad practice i think
        // ABSOLUTE path for dinamically loaded modules desctination folder ( .. '/xhrModules/')
        // NEEDS TO BE CHANGED AT PRODUCTION BUILD
        // MAKE SURE PATH ENDS WITH SLASH /
        publicPath: '/public/assets/'
    },

    watch: NODE_ENV == 'development',

    watchOptions: {
        agreggateTimeout: 100
    },

    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,

    // ??? where and which modules to search
    /*resolve: {
        extensions: ['', '.js', '.scss']
    },*/

    // ??? where and which loaders to search
    /*resolveLoader: {
        modules: ["node_modules"],
        moduleExtensions: ['-loader'],
        extensions: ["*", ".js"]
    },*/

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                //include: path.join(__dirname, '/frontend'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    //plugins: ['transform-runtime']
                }
            },
            {
                test: /\.css$/,
                //loader: 'style-loader!css-loader'
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!resolve-url-loader'
                })
            },
            {
                test: /\.scss$/,
                //loader: 'style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap'
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!resolve-url-loader!sass-loader?sourceMap'
                }),
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'file-loader?name=[path][name].[ext]?[hash]'
            }
        ]
    },

    plugins: [
        // ???
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            // if common code in >= minChunks chunks then move it to specified [name] file
            minChunks: 2
        }),
        // global variables
        /*new webpack.ProvidePlugin({
            react: 'react',
            pluck: 'lodash/collection/pluck'
        }),*/
        new ExtractTextPlugin({
            filename: '[name].css?',
            allChunks: true,
            //disable: NODE_ENV == 'development'
        }),
        /*new HtmlWebpackPlugin({
            filename: './about.html',
            chunks: ['common', 'about']
        }),*/
        /*new webpack.HotModuleReplacementPlugin()*/
    ],

    externals: {
        // to write require('lodash') if lodash loaded directrly into html as <script>
        //lodash: '_'
        //"react": "React",
        //"react-dom": "ReactDOM"
    },

    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, '/'),
        hot: false
    }
};


if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
