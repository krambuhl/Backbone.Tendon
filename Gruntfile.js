module.exports = function(grunt) {
    'use strict';
    //All grunt related functions

    grunt.initConfig({

        // Compile Handlebar Templates
        handlebars: {
            build: {
                options: {
                    namespace: 'Templates'
                },

                src: ['assets/templates/**/*.hbs', 'assets/templates/**/*.handlebars'],
                dest: 'dist/templates.js'
            }
        },

        bower_concat: {
            build: {
                dest: 'dist/lib.js',
                dependencies: {
                    'underscore': 'jquery',
                    'backbone': 'underscore',
                    'marionette': 'backbone'
                }
            }
        },

        concat: {
            lib: {
                src: [
                    'dist/lib.js',
                    'assets/library/**/*.js'
                ],

                dest:'dist/lib.js'
            },

            app: {
                src: ['assets/scripts/includes/**/*.js', 'assets/app/**/*.js', 'assets/scripts/script.js'],
                dest: 'dist/app.js'
            },

            sum: {
                src: ['dist/lib.js', 'dist/app.js', 'dist/templates.js'],
                dest: 'dist/dist.js'
            }
        },

        uglify: {
            build: {
                src: ['dist/dist.js'],
                dest: 'dist/dist.min.js'
            }
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    src: ['**'],
                    cwd: 'assets/images/',
                    dest: 'dist/images/'
                }]
            },

            data: {
                files: [{
                    expand: true,
                    src: ['**'],
                    cwd: 'assets/data/',
                    dest: 'dist/data/'
                }]
            },

            behavior: {
                files: [{
                    expand: true,
                    src: ['**'],
                    cwd: 'assets/behavior/',
                    dest: 'dist/behavior/'
                }]
            }
        },

        compass: { // Task
            options: { // Target options
                sassDir: 'assets/sass/',
                cssDir: 'dist/',
                noLineComments: false
            },
            
            build: {
                options: {
                    outputStyle: 'nested',
                    environment: 'development'
                }
            }
        },
        
        cmq: {
            production: {
                files: {
                    'dist': ['dist/style.css']
                }
            },
        },

        cssmin: {
            compress: {
                files: {
                    'dist/style.min.css': ['dist/style.css']
                }
            }
        },

        watch: {
            options: {
                debounceDelay: 250
            },

            scripts: {
                files: ['assets/app/**/*.js', 'assets/scripts/**/*.js'],
                tasks: ['concat:app', 'uglify']
            },

            bower: {
                files: ['assets/library/**/*', 'bower_components/**/*.js', 'assets/scripts/**/*.js'],
                tasks: ['bower_concat', 'concat:lib', 'concat:sum', 'uglify']
            },

            templates: {
                files: ['assets/templates/**/*.hbs'],
                tasks: ['handlebars', 'concat:sum', 'concat:sum', 'uglify']
            },

            styles: {
                files: ['assets/sass/*/*.scss', 'assets/fonts/*.css'],
                tasks: ['compass', 'cmq', 'cssmin']
            },

            images: {
                files: ['assets/images/**/*'],
                tasks: ['copy:images']
            },

            data: {
                files: ['assets/data/**/*'],
                tasks: ['copy:data']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.loadNpmTasks('grunt-combine-media-queries');

    // bower plugs
    grunt.loadNpmTasks('grunt-bower-concat');

    grunt.registerTask('default', ['handlebars', 'bower_concat', 'concat', 'uglify', 'compass', 'cmq', 'cssmin', 'copy', 'watch']);
    grunt.registerTask('script', ['bower_concat', 'concat', 'uglify']);
    grunt.registerTask('style', ['compass', 'cmq', 'cssmin']);
    grunt.registerTask('images', ['copy:images']);
    grunt.registerTask('data', ['copy:data']);
};