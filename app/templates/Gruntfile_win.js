module.exports = function(grunt) {

	// ここに追加
	var pkg = grunt.file.readJSON('package.json');

	// パスの設定
	var pathConfig = {
		vh: '<%= localhost %>',		// バーチャルホストのサーバー名
		root: '../<%= rootDirectory %>',				// project root
		src: '<%= common %>',				// 共通リソースの配置先
		compile: '<%= common %>/<%= compile %>',	// コンパイル言語ソース類の配置先
		dev: '../<%= _dev %>'
	};

	grunt.initConfig({

		/* パス設定のロード
		 ---------------------------------------------------*/
		path: pathConfig,

		/* typescriptのコンパイル
		 ------------------------------------------------------------------------*/
		typescript: {
			base: {
				src: ['<%%= path.root %>/<%%= path.compile %>/*.ts'],
				dest: '<%%= path.root %>/<%%= path.src %>/js',
				options: {
					base_path: '<%%= path.root %>/<%%= path.compile %>'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* coffeescriptのコンパイル
		 ------------------------------------------------------------------------*/
		coffee: {
			compileAll: {
				//top-levelのfunctionを付けたい方はoptionを消してください。
				options: {
					bare: true
				},
				expand: true,
				flatten: true,
				cwd: '<%%= path.root %>/<%%= path.compile %>',
				src: ['*.coffee'],
				dest: '<%%= path.root %>/<%%= path.src %>/js',
				ext: '.js'
			},
			compile: {
				//top-levelのfunctionを付けたい方はoptionを消してください。
				options: {
					bare: true
				},
				expand: true,
				flatten: true,
				src: ['*.coffee'],
				dest: '<%%= path.root %>/<%%= path.src %>/js',
				ext: '.js'
			}
		},
		//-----------------------------------------------------------------------

		/* Scssのコンパイル
		 ------------------------------------------------------------------------*/
		compass: {
			dist: {
				options: {
					basePath: '<%%= path.root %>/',
					sassDir: '<%%= path.compile %>',
					cssDir: '<%%= path.src %>/css',
					//compassのimgディレクトリ（スプライトを書き出すディレクトリ
					imagesDir : '<%%= path.src %>/img',
					config: 'config.rb'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* js,cssファイルの結合
		 ------------------------------------------------------------------------*/
		concat: {
			style: {
				src: [
					'<%%= path.root %>/<%%= path.src %>/css/normalize.css',
					'<%%= path.root %>/<%%= path.src %>/css/hogehoge.css',
					'<%%= path.root %>/<%%= path.src %>/css/hogehoge2.css'
				],
				dest: '<%%= path.root %>/<%%= path.src %>/all/style-all.css'
			},
			run: {
				src: [
					'<%%= path.root %>/<%%= path.src %>/js/lib/modernizr.js',
					'<%%= path.root %>/<%%= path.src %>/js/lib/jquery.min.js',
					'<%%= path.root %>/<%%= path.src %>/js/hogehoge.js',
					'<%%= path.root %>/<%%= path.src %>/js/hogehoge2.js'
				],
				dest: '<%%= path.root %>/<%%= path.src %>/all/run-all.js'
			}
		},
		//-----------------------------------------------------------------------

		/* jsファイルの圧縮（ライセンス表記のコメントはコメント内容の先頭に@licenseを必ず表記してください！
		 ------------------------------------------------------------------------*/
		uglify: {
			options: {
				preserveComments: "some"
			},
			run: {
				src: ['<%%= path.root %>/<%%= path.src %>/all/run-all.js'],
				dest: '<%%= path.root %>/<%%= path.src %>/all/run-all.min.js'
			}
		},
		//-----------------------------------------------------------------------

		/* cssファイルの圧縮
		 ------------------------------------------------------------------------*/
		cssmin: {
			style: {
				src: ['<%%= path.root %>/<%%= path.src %>/all/style-all.css'],
				dest: '<%%= path.root %>/<%%= path.src %>/all/style-all.min.css'
			}
		},
		//-----------------------------------------------------------------------

		/* jsHintによるjsデバッグ。結果はコンソールに表示
		 ------------------------------------------------------------------------*/
		jshint: {
			// 対象ファイルを指定
			all: [
				'<%%= path.root %>/<%%= path.src %>/js/*.js',
				'!<%%= path.root %>/<%%= path.src %>/js/*.min.js',
				'!<%%= path.root %>/<%%= path.src %>/js/*-all.js',
				'!<%%= path.root %>/<%%= path.src %>/js/lib/*.js'
			]
		},
		//-----------------------------------------------------------------------

		/* 画像最適化
		 ---------------------------------------------------*/
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					src: [
						'<%%= path.root %>/**/*.{png, jpg, jpeg}','<%%= path.root %>/**/**/*.{png, jpg, jpeg}','<%%= path.root %>/**/**/**/*.{png, jpg, jpeg}'
					]
				}]
			}
		},
		//-----------------------------------------------------------------------

		/* 変更保存の監視。指定階層のファイルの更新時にタスクを行う
		 ------------------------------------------------------------------------*/
		esteWatch: {
			options: {
				dirs: ['<%%= path.root %>/<%%= path.compile %>/'],
				livereload: {
					enabled: false
				}
			},
			coffee: function(filepath) {
				grunt.config(["coffee", "compile", "src"], filepath);
				return ['coffee:compile:src:' + filepath,'jshint','concat:run','uglify'];
			},
			ts: function(filepath) {
				grunt.config(["typescript", "base", "src"], filepath);
				return ['typescript:base:src:' + filepath,'jshint','concat:run','uglify'];
			},
			scss: function(filepath) {
				return ['compass','concat:style','csscomb','cssmin'];
			}
		},
		//-----------------------------------------------------------------------

		/* livereload
		 ------------------------------------------------------------------------*/
		livereloadx: {
			dir: '<%%= path.root %>'
		},
		//-----------------------------------------------------------------------

		/* ページオープン
		 ------------------------------------------------------------------------*/
		// ページオープン用URL
		open: {
			dev: {
				path: 'http://<%%= path.vh %>/'
			}
		},
		//-----------------------------------------------------------------------

		/* データ複製
		 ---------------------------------------------------*/
		copy: {
			setup: {
				files: [
					{ expand: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/js' },
					{ expand: true, cwd: 'bower_components/modernizr', src: ['modernizr.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/js' },
					{ expand: true, cwd: 'bower_components/normalize-css', src: ['normalize.css'], dest: '<%= rootDirectory %>/<%%= path.src %>/css' },
					{ expand: true, src: 'package.json', dest: '<%= _dev %>' },
					{ expand: true, src: 'Gruntfile.js', dest: '<%= _dev %>' },
					{ expand: true, src: '.bowerrc', dest: '<%= _dev %>' },
					{ expand: true, src: 'bower.json', dest: '<%= _dev %>' },
					{ expand: true, cwd: 'node_modules', src: ['**'], dest: '<%= _dev %>/node_modules' }
				]
			}
		},
		//-----------------------------------------------------------------------

		/* 不要初期ファイル削除
		 ---------------------------------------------------*/
		clean: {
			prepare: {
				options: {
					force: true // 強制的に上位ディレクトリを削除
				},
				src: [
					'assets',
					'<%= _dev %>/node_modules/generator-giraffe',
					'node_modules',
					'bower_components',
					'package.json',
					'Gruntfile.js',
					'.bowerrc',
					'bower.json'
				]
			}
		}
		//-----------------------------------------------------------------------
	});

	// gruntコマンドを打つと走るタスクです。
	grunt.registerTask('default', ['coffee:compileAll','typescript','compass','concat','uglify','cssmin','jshint']);
	// grunt startコマンドを打つと走るタスクです。初期構築を行います。
	grunt.registerTask('start', ['copy','clean:prepare']);
	// grunt startコマンドを打つと走るタスクです。ファイルの監視・livereloadを行います。
	grunt.registerTask('watch_files', ['open','livereloadx','esteWatch']);
	// grunt imageコマンドを打つと走るタスクです。画像を圧縮します。
	grunt.registerTask('imagemin', ['imagemin']);

	// loadNpmTasksを変更（プラグイン読み込み）
	var taskName;
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}

	// loadNpmTasksを変更（手動）
	grunt.loadNpmTasks('livereloadx');
};