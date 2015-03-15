module.exports = function (grunt) {

  // Load grunt tasks when they are needed
  require('jit-grunt')(grunt, {
    ngtemplates: 'grunt-angular-templates',
    jsdoc2md: 'grunt-jsdoc-to-markdown'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    library: grunt.file.readJSON('bower.json'),
    concat: {
      options: {
        separator: ''
      },
      library: {
        src: [
          'src/module.js',
          '.tmp/templates.js',
          'src/image-loader-service.js',
          'src/lightbox-service.js',
          'src/lightbox-src-directive.js'
        ],
        dest: 'dist/<%= library.name %>.js'
      },
      css: {
        src: [
          'src/<%= library.name %>.css',
        ],
        dest: 'dist/<%= library.name %>.css'
      }
    },
    jshint: {
      beforeConcat: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          src: '<%= concat.library.dest %>',
          dest: 'dist/<%= library.name %>.min.js'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> */\n'
      },
      jid: {
        files: {
          'dist/<%= library.name %>.min.js': ['dist/<%= library.name %>.min.js']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'src',
        src: ['*.css'],
        dest: 'dist',
        ext: '.min.css'
      }
    },
    ngtemplates: {
      'bootstrapLightbox': {
        cwd: 'src',
        src: '*.html',
        dest: '.tmp/templates.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: false,
            removeRedundantAttributes: true
          }
        }
      }
    },
    jsdoc2md: {
      doc: {
        src: 'src/*.js',
        dest: 'api.md'
      }
    },
  });

  grunt.registerTask('default', [
    'ngtemplates',
    'jshint:beforeConcat',
    'concat',
    'ngAnnotate',
    'uglify',
    'cssmin',
  ]);
};
