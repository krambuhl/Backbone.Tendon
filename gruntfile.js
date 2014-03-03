module.exports = function(grunt) {
    'use strict';
    //All grunt related functions

    grunt.initConfig({
        concat: {
            build: {
                src: [
                    "tendon/tendon.js",
                    "tendon/tendon.utl.js",
                    "tendon/tendon.method-router.js",
                    "tendon/tendon.vein.js",
                    "tendon/tendon.view.js",
                    "tendon/tendon.yield.js",
                    "tendon/tendon.layout.js",
                    "tendon/tendon.composer.js",
                    "tendon/tendon.jsonp-collection.js"
                ],
                dest:'dist/backbone.tendon.js'
            },
        },

        uglify: {
            build: {
                src: ['dist/backbone.tendon.js'],
                dest: 'dist/backbone.tendon.min.js'
            }
        },

        watch: {
            options: {
                debounceDelay: 250
            },

            build: {
                files: ['tendon/**/*.js'],
                tasks: ['build']
            },

            test: {
                files: ['tests/**/*.js'],
                tasks: ['test']
            },
        },

        qunit: {
            all: ['tests/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('test', ['qunit']);

    grunt.registerTask('develop', ['build', 'test', 'watch']);

    grunt.registerTask('default', ['build', 'watch:build']);
};