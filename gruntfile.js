module.exports = function(grunt) {
    'use strict';
    //All grunt related functions

    grunt.initConfig({
        concat: {
            build: {
                src: 'tendon/**/*.js',
                dest:'backbone.tendon.js'
            },
        },

        uglify: {
            build: {
                src: ['backbone.tendon.js'],
                dest: 'backbone.tendon.min.js'
            }
        },

        watch: {
            options: {
                debounceDelay: 250
            },

            build: {
                files: ['tendon/**/*.js'],
                tasks: ['concat', 'uglify']
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
};