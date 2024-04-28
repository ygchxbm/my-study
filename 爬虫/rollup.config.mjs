import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import commonjs from "@rollup/plugin-commonjs";
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },

    plugins: [
        json(),
        terser(),
        resolve(),
        commonjs() // 还需要添加 commonjs 插件
    ]
}
