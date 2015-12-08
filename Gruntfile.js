module.exports = function(grunt) {
  // tasks configuration
  grunt.initConfig({
   
   concat: {
    options: {
      separator: ' \n'
    },
    dist: {
      src : ['src/js/*.js'],
      dest: 'build/js/main.js',
      nonull: true
    },
    plugins: {
        src : [ 'src/js/plugins/*.js' ],
        dest: 'build/js/plugins.js',
        nonull: true
    }
  },
    
   compass: {
     dist: {
       options: {
         sassDir: 'src/scss',
         cssDir: 'build/css',
         config: 'config.rb',
         environment: 'development'
       }
     }
   },
    
    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'build/main.js': [ 'build/**/*.js' ]
        }
      }
    },

    jade: {
      compile: {
        options: {
         client: false,
         pretty: true,
         data: function(dest, src) {
             return {
                 from: src,
                 to: dest,
                 fakeData: grunt.file.readJSON('data/fake-data.json')
             };
         }
        },
        files: [{
            cwd: "views",
            src: "**/*.build.jade",
            dest: "build",
            expand: true,
            ext: ".html"
        }]
      }
    },

    watch: {
      css: {
       files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
       tasks: ['newer:compass']
      },
      scripts: {
       files: ['src/js/*.js', 'src/js/**/*.js'],
       tasks: ['newer:concat']
      },
        jade: {
            files: '**/*.jade',
            tasks: [ 'newer:jade' ]
        }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  // define the tasks
  grunt.registerTask( 'stylesheets', 'Compiles the stylesheets.', [ 'compass' ] );
  grunt.registerTask( 'scripts', 'Compiles the JavaScript files.', [ 'uglify', 'concat' ] );
  grunt.registerTask( 'build', 'Compiles all stylesheets and scripts.', [ 'jade', 'compass' ] );
  grunt.registerTask( 'default',  'Watch the project for any changes.',  [ 'build', 'watch' ] );
};