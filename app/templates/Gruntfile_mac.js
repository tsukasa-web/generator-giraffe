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
				src: ['<%%= path.root %>/<%%= path.compile %>/ts/*.ts'],
				dest: '<%%= path.root %>/<%%= path.src %>/js/dest',
				options: {
					base_path: '<%%= path.root %>/<%%= path.compile %>/ts'
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
				cwd: '<%%= path.root %>/<%%= path.compile %>/coffee',
				src: ['*.coffee'],
				dest: '<%%= path.root %>/<%%= path.src %>/js/dest',
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
				dest: '<%%= path.root %>/<%%= path.src %>/js/dest',
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
					sassDir: '<%%= path.compile %>/scss',
					cssDir: '<%%= path.src %>/css/dest',
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
					'<%%= path.root %>/<%%= path.src %>/lib/normalize.css',
					'<%%= path.root %>/<%%= path.src %>/css/dest/hogehoge.css'
				],
				dest: '<%%= path.root %>/<%%= path.src %>/css/style-all.css'
			},
			run: {
				src: [
					'<%%= path.root %>/<%%= path.src %>/js/lib/modernizr.js',
					'<%%= path.root %>/<%%= path.src %>/js/lib/jquery.min.js',
					'<%%= path.root %>/<%%= path.src %>/js/dest/hogehoge.js'
				],
				dest: '<%%= path.root %>/<%%= path.src %>/js/run-all.js'
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
				src: ['<%%= path.root %>/<%%= path.src %>/js/run-all.js'],
				dest: '<%%= path.root %>/<%%= path.src %>/js/run-all.min.js'
			}
		},
		//-----------------------------------------------------------------------

		/* cssファイルの圧縮
		 ------------------------------------------------------------------------*/
		cssmin: {
			style: {
				src: ['<%%= path.root %>/<%%= path.src %>/css/style-all.css'],
				dest: '<%%= path.root %>/<%%= path.src %>/css/style-all.min.css'
			}
		},
		//-----------------------------------------------------------------------

		/* cssファイルの不要prefix消去
		 ------------------------------------------------------------------------*/
		autoprefixer: {
			options: {
				// ブラウザのバージョン指定
				browsers: ['last 2 version', 'ie 8']
			},
			no_dest: {
				src: '<%%= path.root %>/<%%= path.src %>/css/dest/*.css'
			}
		},
		//-----------------------------------------------------------------------

		/* csscssによるcssチェック。結果はコンソールに表示
		 ------------------------------------------------------------------------*/
		csscss: {
			options: {
				compass: true,
				ignoreSassMixins: true
			},
			dist: {
				src: ['<%%= path.root %>/<%%= path.src %>/css/dest/*.css']
			}
		},
		//-----------------------------------------------------------------------

		/* csslintによるcssチェック。結果はコンソールに表示
		 ------------------------------------------------------------------------*/
		csslint: {
			dist: {
				src: ['<%%= path.root %>/<%%= path.src %>/css/dest/*.css']
			}
		},
		//-----------------------------------------------------------------------

		/* jsHintによるjsチェック。結果はコンソールに表示
		 ------------------------------------------------------------------------*/
		jshint: {
			// 対象ファイルを指定
			all: [
				'<%%= path.root %>/<%%= path.src %>/js/dest/*.js'
			]
		},
		//-----------------------------------------------------------------------

		/* styleguideの作成
		 ------------------------------------------------------------------------*/
		kss: {
			options: {
				includeType: 'css',
				includePath: '<%%= path.root %>/<%%= path.src %>/css/style-all.min.css',
				template: '<%%= path.root %>/<%%= path.documents %>/styleguide_temp'
			},
			dist: {
				files: {
					'<%%= path.root %>/<%%= path.documents %>/modules': ['<%%= path.root %>/<%%= path.compile %>/scss']
				}
			}
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

		/* webfont作成
		 ------------------------------------------------------------------------*/
		webfont: {
			icons: {
				src: '<%%= path.root %>/<%%= path.src %>/fonts/icons/*.svg',
				dest: '<%%= path.root %>/<%%= path.src %>/fonts',
				destCss: '<%%= path.root %>/<%%= path.compile %>/scss/libs',
				options: {
					font: 'custom-fonts',
					stylesheet:'scss',
					htmlDemo: false,
					relativeFontPath: '/<%%= path.src %>/fonts'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* 変更保存の監視。指定階層のファイルの更新時にタスクを行う
		 ------------------------------------------------------------------------*/
		esteWatch: {
			options: {
				dirs: [
					'<%%= path.root %>/<%%= path.compile %>/scss/*',
					'<%%= path.root %>/<%%= path.compile %>/coffee/*',
					'<%%= path.root %>/<%%= path.compile %>/ts/*'
				],
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
				return ['compass','csscss','autoprefixer:no_dest','csslint','concat:style','cssmin'];
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
					{ expand: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/modernizr', src: ['modernizr.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/normalize-css', src: ['normalize.css'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/font-awesome/fonts', src: ['**'], dest: '<%= rootDirectory %>/<%%= path.src %>/fonts' },
					{ expand: true, cwd: 'bower_components/font-awesome/scss', src: ['**'], dest: '<%= rootDirectory %>/<%%= path.compile %>/scss/libs' },
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
	grunt.registerTask('default', ['coffee:compileAll','typescript','compass','csscss','autoprefixer:no_dest','csslint','jshint','concat','uglify','cssmin']);
	// grunt startコマンドを打つと走るタスクです。初期構築を行います。
	grunt.registerTask('start', ['copy','clean:prepare']);
	// grunt startコマンドを打つと走るタスクです。ファイルの監視・livereloadを行います。
	grunt.registerTask('watch_files', ['open','livereloadx','esteWatch']);
	// grunt imageコマンドを打つと走るタスクです。画像を圧縮します。
	grunt.registerTask('imagemin', ['imagemin']);
	// grunt webfontコマンドを打つと走るタスクです。webfontを作成します。
	grunt.registerTask('webfont', ['webfont']);
	// grunt styleコマンドを打つと走るタスクです。styleguideを作成します。
	grunt.registerTask('style', ['kss']);

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