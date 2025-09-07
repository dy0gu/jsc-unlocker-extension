import { DefinePlugin, type Configuration } from "webpack";
import WebExtPlugin from "web-ext-plugin";
import path from "path";

export default {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    mode: "development",
    plugins: [
        new WebExtPlugin({
            target: ["chromium", "firefox-desktop"],
            startUrl: "https://www.jogossantacasa.pt"

        }),
    ],
} satisfies Configuration;
