# generator-giraffe

![](http://ones-locus-plus.sakura.ne.jp/giraffe.jpg)

A generator for [Yeoman](http://yeoman.io).  
高速化を念頭に置いて作成した静的サイト構築用ジェネレータです。

## About giraffe

### 機能

* ディレクトリの初期構築
* CoffeeScriptのコンパイル
* TypeScriptのコンパイル
* Sassのコンパイル
* css/jsファイルの結合＆圧縮
* jsHintによるチェック
* cssLintによるチェック
* cssの重複プロパティチェック
* cssの不要プレフィックス削除
* este-watchによるファイル更新の監視→コンパイル・結合・圧縮・デバッグの自動化
* 自動ブラウザリロード
* jQueryの取得（バージョン指定可）
* 最新normalize.cssの取得
* 最新modernizr.jsの取得
* 最新font-awesomeの取得
* 画像圧縮
* config.rb連動によるスプライト画像のランダム文字列消去
* grunt-kssによるスタイルガイド生成
* Macパッケージのみwebfont作成機能の追加
* 各種mixinなどのscssライブラリを追加

### Install

使用する前に以下のツール群をインストールする必要があります。  
一部古いNode.jsに対応していないものもあるため、  バージョンが古い場合は、できるだけアップデートしておくことを推奨します。  
Windows環境では[Rubyのインストール](https://www.ruby-lang.org/ja/downloads/)、MacとWindow両方とも[Sass](http://sass-lang.com/install)/[Compass](http://compass-style.org/install/)のインストールが前提になります。

- [Node.js](http://nodejs.jp/)
- [Yeoman](http://yeoman.io/)
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)
- [livereloadx](http://nitoyon.github.io/livereloadx/)
- [csscss](http://zmoazeni.github.io/csscss/)

```
$ npm install -g yo grunt-cli bower livereloadx
$ gem install csscss
```

MacOSの場合はさらにgrunt-webfontを使用するために

- [Homebrew](http://brew.sh/index_ja.html)
- [fontforge](http://fontforge.org/ja/)

のインストールが必要です。  

```
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

```
$ brew install fontforge ttfautohint
```

### How to use

generator-giraffeをインストールします。

	npm install -g generator-giraffe


任意のディレクトリを作成して移動し、```yo giraffe & grunt start```を実行します。  
環境によっては実行前に```git config --global url."https://".insteadOf git://```を実行する必要があります。

	mkdir hogehoge
	cd hogehoge
	yo giraffe && grunt start
	
yeomanからの質問形式で以下の設定を行います。

- 開発者名（packageのauthorに入ります）
- localhost（プロジェクト名）
- ルートディレクトリ名
- OS選択（YesでMac,NoでWin）
- jQueryのバージョン（無記入で最新版）
- 共通リソースディレクトリ名
- コンパイル言語ファイルの格納先
- 開発ツールディレクトリ名
- ドキュメントディレクトリ名

質問に返答後、返答内容に応じたディレクトリが構成され、  
node_module等が自動的にインストールされます。

####js,cssファイルの結合

Gruntfile.jsを開き、結合したいcss,jsのパスを通します。  
上から順に結合されていくので、順番を間違えないようにしてください。  
ちなみにGrunt.jsにおいてルート相対・絶対パスは認識されません。   

    concat: {
    	style: {
    		src: [
    			'<%= path.root %>/<%= path.src %>/css/normalize.css',
    			'<%= path.root %>/<%= path.src %>/css/hogehoge.css'
    		],
    		dest: '<%= path.root %>/<%= path.src %>/css/dest/style-all.css'
    	},
    	run: {
    		src: [
    			'<%= path.root %>/<%= path.src %>/js/modernizr.js',
    			'<%= path.root %>/<%= path.src %>/js/jquery.min.js',
    			'<%= path.root %>/<%= path.src %>/js/hogehoge.js'
    		],
    		dest: '<%= path.root %>/<%= path.src %>/js/dest/run-all.js
    	}
    },


#### ファイル監視の起動

cmd_batまたはcmd_commandフォルダの中にあるgrunt_watch.batまたはgrunt_watch.commandを叩いてください。  
Grunt.jsで設定したlocalhost名でページが開き、ファイルの監視が始まります。
Sublime Text2でlivereloadのプラグインを入れてる人は、バッティングするのでプラグインをremoveしてから使ってください。  
この後、コンソールは出したままにしておいてください。最小化しても大丈夫です。  
以降はscss/coffee/js(Sassのみの時)が更新される度に自動的にコンパイル・結合・圧縮・デバッグが行われます。  
さらに、htmlとcss(sassを使っている人はscss更新時)の更新時に自動でブラウザがリロードされます。  
コンソールは消さずに出したままにしておいてください。監視をやめたい場合はコンソール上でCtrl+Cを押してください。　　
任意のタイミングでコンパイル・結合・圧縮・デバッグを行いたい場合はgrunt_command.batまたはgrunt_command.commandを叩くか、コンソール上で「grunt」と打ち込んでください。

#### livereloadのアドオン・エクステンションを取得

**Firefox**   
http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-  
「Firefox extension」というやつです。  

**Chrome**  
https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei  


あとは追加されたアドオンのマークを押して、丸の中が赤くなれば成功です。  
ファイル監視を行っている最中に行ってください。  
後はhtmlまたはcss(sassの人はscss)を編集して保存した際にブラウザがリロードされればok。

#### 仕上げの時に画像圧縮を行う

cmd_batまたはcmd_commandフォルダの中にあるgrunt_imagemin.batまたはgrunt_imagemin.commandを叩くと画像圧縮が始まります。  
現状第3階層までのフォルダの中の画像を圧縮しますが、さらに階層を掘り下げたい時は

    imagemin: {
        dist: {
            options: {
                    optimizationLevel: 3
                },
            files: [{
                expand: true,
                src: [
                    '<%= path.root %>/**/*.{png, jpg, jpeg}','<%= path.root %>/**/**/*.{png, jpg, jpeg}','<%= path.root %>/**/**/**/*.{png, jpg, jpeg}'
                ]
            }]
        }
    },

上記の記述のsrcの中を追記していただけると追加することができます。  
optimizationLevelを変更することで圧縮レベルを変更できます。（0～7）

#### styleguideの作成

cmd_batまたはcmd_commandフォルダの中にあるgrunt_style-guideを叩くとstyleguideの作成が始まります。初期設定ではtemplate格納先はstyleguide_tempフォルダに、出力先はmodulesフォルダ内に設定されています。

- [grunt-kss](https://github.com/t32k/grunt-kss)

#### webfontの作成（Macのみ）

cmd_batまたはcmd_commandフォルダの中にあるgrunt_webfontを叩くとwebfontの作成が始まります。初期設定では/common/fonts/iconsフォルダにaiファイルを格納してください。

    webfont: {
    			icons: {
    				src: '<%= path.root %>/<%= path.src %>/fonts/icons/*.svg',
    				dest: '<%= path.root %>/<%= path.src %>/fonts',
    				destCss: '<%= path.root %>/<%= path.compile %>',
    				options: {
    					font: 'custom-fonts',
    					stylesheet:'scss',
    					htmlDemo: false,
    					relativeFontPath: '/<%= path.src %>/fonts'
    				}
    			}
    		},

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
