module.exports = function(grunt) {

	// ここに追加
	var pkg = grunt.file.readJSON('package.json');

	// パスの設定
	var pathConfig = {
		vh: '<%= localhost %>',		// バーチャルホストのサーバー名
		root: '../<%= rootDirectory %>',				// project root
		src: '<%= common %>',				// 共通リソースの配置先
		compile: '<%= common %>/<%= compile %>',	// コンパイル言語ソース類の配置先
		dev: '../<%= _dev %>',
		documents: '<%= _documents %>'
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
		sass: {
			options: {
				includePaths: require('node-bourbon').includePaths
			},
			dist: {
				files: {
					'<%%= path.root %>/<%%= path.src %>/css/dest/style.css':'<%%= path.root %>/<%%= path.compile %>/scss/style.scss'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* SpriteSheetの作成
		 ------------------------------------------------------------------------*/
		sprite: {
			all:{
				src: '<%%= path.root %>/<%%= path.src %>/img/sprite/*.png',
				destCSS: '<%%= path.root %>/<%%= path.compile %>/scss/lib/_sprite.scss',
				destImg: '<%%= path.root %>/<%%= path.src %>/img/sprite.png',
				padding: 2,
				algorithm: 'binary-tree'
			}
		},
		//-----------------------------------------------------------------------

		/* Jadeのコンパイル
		 ------------------------------------------------------------------------*/
		jade: {
			compile:{
				options:{
					debug: true,
					pretty: true,
					data: function(dest, src) {
						// --- Gruntfile内でオブジェクトを定義してtemplateに渡す時
						//return {
						//	from: src,
						//	to: dest
						//};

						// --- 外部ファイルからオブジェクトをtemplateに渡す時
						// return require('./locals.json');
					}

				},
				files:[{
					expand: true,
					cwd: '<%= path.root %>/<%= path.compile %>/jade',
					src:['**/*.jade','!_parts/*.jade'],
					dest: '<%= path.root %>',
					ext: '.html'
				}]
			}
		},
		//-----------------------------------------------------------------------

		/* js,cssファイルの結合
		 ------------------------------------------------------------------------*/
		concat: {
			style: {
				src: [
					'<%%= path.root %>/<%%= path.src %>/lib/normalize.css',
					'<%%= path.root %>/<%%= path.src %>/css/dest/style.css'
				],
				dest: '<%%= path.root %>/<%%= path.src %>/css/style-all.css'
			},
			run: {
				src: [
					'<%%= path.root %>/<%%= path.src %>/lib/jquery.min.js',
					'<%%= path.root %>/<%%= path.src %>/js/dest/run.js'
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

		/* jsHintによるjsデバッグ。結果はコンソールに表示
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
				includePath: '<%= path.root %>/<%= path.src %>/css/style-all.min.css',
				template: '<%= path.root %>/<%= path.documents %>/styleguide_temp'
			},
			dist: {
				files: {
					'<%= path.root %>/<%= path.documents %>/modules': ['<%= path.root %>/<%= path.compile %>/scss/']
				}
			}
		},
		//-----------------------------------------------------------------------

		/* 変更保存の監視。指定階層のファイルの更新時にタスクを行う
		 ------------------------------------------------------------------------*/
		esteWatch: {
			options: {
				dirs: [
					'<%%= path.root %>/<%%= path.compile %>/scss/**/*.scss',
					'<%%= path.root %>/<%%= path.compile %>/coffee/**/*.coffee',
					'<%%= path.root %>/<%%= path.compile %>/ts/**/*.ts',
					'<%%= path.root %>/<%%= path.compile %>/jade/**/*.jade'
				],
				livereload: {
					enabled: false
				}
			},
			coffee: function(filepath) {
				grunt.config(["coffee", "compile", "src"], filepath);
				return ['coffee:compile:src:' + filepath,'concat:run','uglify'];
			},
			ts: function(filepath) {
				grunt.config(["typescript", "base", "src"], filepath);
				return ['typescript:base:src:' + filepath,'concat:run','uglify'];
			},
			scss: function(filepath) {
				return ['sass','autoprefixer:no_dest','concat:style','cssmin'];
			},
			jade: function(filepath) {
				return ['jade'];
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
					{ expand: true, cwd: 'bower_components/jquery/dist', src: ['jquery.min.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/modernizr', src: ['modernizr.js'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/normalize-css', src: ['normalize.css'], dest: '<%= rootDirectory %>/<%%= path.src %>/lib' },
					{ expand: true, cwd: 'bower_components/font-awesome/fonts', src: ['**'], dest: '<%= rootDirectory %>/<%%= path.src %>/fonts' },
					{ expand: true, cwd: 'bower_components/font-awesome/scss', src: ['**'], dest: '<%= rootDirectory %>/<%%= path.compile %>/scss/font-awesome' },
					{ expand: true, src: 'package.json', dest: '<%= _dev %>' },
					{ expand: true, src: 'Gruntfile.js', dest: '<%= _dev %>' },
					{ expand: true, src: '.bowerrc', dest: '<%= _dev %>' },
					{ expand: true, src: 'bower.json', dest: '<%= _dev %>' },
					{ expand: true, cwd: 'node_modules', src: ['**'], dest: '<%= _dev %>/node_modules' }
				]
			}
		},
		//-----------------------------------------------------------------------

		/* ファイルリネーム
		 ---------------------------------------------------*/
		rename: {
			setup: {
				files: [
					{src: ['<%= rootDirectory %>/<%%= path.compile %>/scss/font-awesome/font-awesome.scss'], dest: '<%= rootDirectory %>/<%%= path.compile %>/scss/font-awesome/_font-awesome.scss'}
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
					'.editorconfig',
					'.jshintrc',
					'bower.json'
				]
			}
		},
		//-----------------------------------------------------------------------
		
		/* タスクの並列処理
		 ---------------------------------------------------*/
		parallelize: {
    		typescript: {
      			base: 4
			},
  			coffee: {
      			compile: 4,
      			compileAll: 4
			},
  			compass: {
      			dist: 4
			},
			sprite: {
				all: 4
			}
		}
	});

	// gruntコマンドを打つと走るタスクです。
	grunt.registerTask('default', ['coffee:compileAll','typescript','sass','csscss','autoprefixer:no_dest','csslint','jshint','concat','uglify','cssmin']);
	// grunt cssコマンドを打つと走るタスクです。csscssによってスタイルの重複を出力します。
	grunt.registerTask('csscss', ['csscss']);
	// grunt spriteコマンドを打つと走るタスクです。csscssによってスタイルの重複を出力します。
	grunt.registerTask('sprite', ['sprite:all']);
	// grunt startコマンドを打つと走るタスクです。初期構築を行います。
	grunt.registerTask('start', ['copy','rename','clean:prepare']);
	// grunt watch_filesコマンドを打つと走るタスクです。ファイルの監視・livereloadを行います。
	grunt.registerTask('watch_files', ['open','livereloadx','esteWatch']);
	// grunt lintコマンドを打つと走るタスクです。css/jsにlint/hintを走らせます。
	grunt.registerTask('lint', ['csslint','jshint']);
	// grunt checkコマンドを打つと走るタスクです。css/jsをチェックします。
	grunt.registerTask('check', ['csscss','csslint','jshint']);
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
