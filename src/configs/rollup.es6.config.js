/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const injectProcessEnv = require('rollup-plugin-inject-process-env')
const buildHelpers = require(path.join(__dirname, '../helpers/build'))
const dotenv = require('dotenv').config()
const json = require('@rollup/plugin-json')

module.exports = {
  plugins: [
    json(),
    alias({
      entries: {
        'wpe-lightning': path.join(__dirname, '../alias/wpe-lightning.js'),
        '@': path.resolve(process.cwd(), 'src/'),
        '~': path.resolve(process.cwd(), 'node_modules/'),
      },
    }),
    resolve({ mainFields: ['module', 'main', 'browser'] }),
    commonjs({ sourceMap: false }),
    injectProcessEnv({
      NODE_ENV: process.env.NODE_ENV,
      ...buildHelpers.getEnvAppVars(dotenv.parsed),
    }),
  ],
  output: {
    format: 'iife',
    sourcemap:
      process.env.LNG_BUILD_SOURCEMAP === 'undefined'
        ? true
        : process.env.LNG_BUILD_SOURCEMAP === 'false'
        ? false
        : process.env.LNG_BUILD_SOURCEMAP,
  },
}
