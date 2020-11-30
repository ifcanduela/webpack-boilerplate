const path = require("path");

const BuildNotifierPlugin = require("webpack-build-notifier");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const LiveReloadPlugin = require("webpack-livereload-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (env, argv) => {
    const DEST_FOLDER = path.resolve(__dirname, "dist");
    const PROJECT_NAME = path.basename(__dirname);
    const MODE = argv.mode || "production";

    return {
        entry: {
            app: "./src/index.js",
        },

        output: {
            path: DEST_FOLDER,
            filename: "js/[name].js",
        },

        performance: { hints: false, },
        devtool: MODE === "production" ? false : "source-map",
        stats: "none",

        optimization: {
            splitChunks: {
                chunks: "initial",
                name: "lib",
            },
        },

        resolve: {
            alias: {
                "vue$": "vue/dist/vue.esm.js",
            },
            extensions: [".wasm", ".mjs", ".js", ".json", ".vue"],
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: [/node_modules/],
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                },
                {
                    test: /\.(c|le)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../",
                            },
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        "autoprefixer",
                                        "cssnano",
                                    ],
                                }
                            },
                        },
                        "less-loader",
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        fallback: "file-loader",
                        name: "img/[name].[ext]",
                        esModule: false,
                    },
                },
                {
                    test: /\.(ttf|woff2?|eot|otf)$/i,
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        fallback: "file-loader",
                        name: "fonts/[name].[ext]",
                        esModule: false,
                    },
                },
            ],
        },

        plugins: [
            new BuildNotifierPlugin({
                title: `${PROJECT_NAME} assets`,
                suppressSuccess: true,
            }),

            new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),

            // new CopyWebpackPlugin({
            //     patterns: [
            //         {from: "./assets/img/icons", to: "img/icons"},
            //     ]
            // }),

            new FriendlyErrorsWebpackPlugin(),

            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                disable: MODE !== "production",
            }),

            /*
               The following tag must be added to the <head> of the HTML
               document to activate the Live Reload features:
               <script src="http://localhost:44444/livereload.js"></script>
            */
            // new LiveReloadPlugin({port: 44444}),

            new MiniCssExtractPlugin({
                filename: "css/app.css",
            }),

            new VueLoaderPlugin(),
        ],
    };
};
