import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import url from '@rollup/plugin-url'
import iPack from 'svelte-i-pack'
import copy from 'rollup-plugin-copy'
// import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      )

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js',
  },
  plugins: [
    url({ destDir: 'dist' }),
    iPack({ inputDir: 'assets' }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('bundle.css')
      },
      preprocess: {
        // ...assetsPreprocessor({ /* options */ })
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    copy({
      targets: [
        { src: './assets/*.*', dest: 'dist/ipack/' },
        { src: ['public/*.*'], dest: 'dist/' },
        {
          src: ['public/ipack/*.*'],
          dest: 'dist/ipack/',
        } /* ,
			  { src: 'node_modules/font-awesome/css/font-awesome.min.css', dest: 'dist' },
			  { src: 'node_modules/font-awesome/fonts/*.*', dest: 'dist' } */,
      ],
      hook: 'writeBundle',
      copyOnce: true,
    }),
    /* del({ 
			targets: 'public/ipack',
			hook: 'buildEnd',
			copyOnce: true
		}), */

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `dist` directory and refresh the
    // browser on changes when not in production
    !production && livereload('dist'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser({ output: { comments: false } }),
  ],
  watch: {
    clearScreen: true,
  },
}
