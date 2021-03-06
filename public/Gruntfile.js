'use strict';
var path = require('path');
var LIVERELOAD_PORT = 8001;

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      options: {
          port: 8000,
          base: '.'
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        middleware: function(connect, options) {
            var middlewares = [];
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            var directory = options.directory || options.base[options.base.length - 1];
            options.base.forEach(function(base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });
            // Make directory browse-able.
            middlewares.push(connect.directory(directory));
            middlewares.push(require('connect-livereload')({ port: LIVERELOAD_PORT }));
            return middlewares;
        }
      }
    },
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          './{,*/}*.html',
          './css/*.css',
          './js/*.js'
        ]
      }
    },
    jasmine : {
        src : [
          'js/vendor/jquery-1.11.0.min.js',
          'js/vendor/bootstrap.min.js',
          'js/vendor/angular/angular.min.js',
          'js/vendor/angular-mocks/angular-mocks.js',
          'js/*.js'
        ],
        options : {
          specs : 'test/specs/**/*Spec.js'
        }
    },
    karma: {
      unit: {
        options: {
          files: ['test/**/*.js'],
          singleRun: true,
          browsers: ['Chrome']
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('connect-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default',function (target) {
    return grunt.task.run([
      'connect:livereload',
      'watch']) // THIS SHALL KEEP THE SERVER OPEN
  });

  grunt.registerTask('unit', ['jasmine']);
  grunt.registerTask('e2e', ['karma']);
}