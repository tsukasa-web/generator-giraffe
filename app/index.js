'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var GiraffeGenerator = module.exports = function GiraffeGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GiraffeGenerator, yeoman.generators.Base);

GiraffeGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			name: 'user_name',
			message: 'What is your name ? default(user_name)',
			default: 'user_name'
		},
		{
			name: 'localhost',
			message: 'Input project/localhost name default(localhost)',
			default: 'localhost'
		},
		{
			name: 'rootDirectory',
			message: 'Input rootDirectory name default(docs)',
			default: 'docs'
		},
		{
			type: 'confirm',
			name: 'OS',
			message: 'Which OS do you use ?(Mac or Win) Yes-->Mac No-->Win default(Yes)',
			default: 'Y/n'
		},
		{
			type: 'confirm',
			name: 'fontawesome',
			message: 'Do you use font-awesome? default(Yes)',
			default: 'Y/n'
		},
		{
			type: 'confirm',
			name: 'sprite',
			message: 'Do you use sprite sheet? default(Yes)',
			default: 'Y/n'
		},
		{
			name: 'jqueryversion default(latest)',
			message: 'jQuery version?'
		},
		{
			name: 'common',
			message: 'What is common resource directory name? default(common)',
			default: 'common'
		},
		{
			name: 'compile',
			message: 'What is compile files directory name? default(compile)',
			default: 'compile'
		},
		{
			name: '_dev',
			message: 'What is development tool resource directory name? default(_dev)',
			default: '_dev'
		},
		{
			name: '_documents',
			message: 'What is documents directory name? default(_documents)',
			default: '_documents'
		}
	];

	this.prompt(prompts, function (props) {
		this.user_name = props.user_name;
		this.localhost = props.localhost;
		this.rootDirectory = props.rootDirectory;
		this.OS = props.OS;
		this.fontawesome = props.fontawesome;
		this.sprite = props.sprite;
		this.jqueryversion = props.jqueryversion;
		this.common = props.common;
		this.compile = props.compile;
		this._dev = props._dev;
		this._documents = props._documents;

		cb();
	}.bind(this));
};


GiraffeGenerator.prototype.app = function app() {
	//下地のディレクトリ作成
	this.mkdir(this.rootDirectory);
	this.mkdir(this._dev);
	this.mkdir(this.rootDirectory + '/' + this.common);
	this.mkdir(this.rootDirectory + '/' + this.common + '/css');
	this.mkdir(this.rootDirectory + '/' + this.common + '/js');
	this.mkdir(this.rootDirectory + '/' + this.common + '/css' + '/dest');
	this.mkdir(this.rootDirectory + '/' + this.common + '/js' + '/dest');
	this.mkdir(this.rootDirectory + '/' + this.common + '/img');
	this.mkdir(this.rootDirectory + '/' + this.common + '/include');
	this.mkdir(this.rootDirectory + '/' + this.common + '/lib');
	if(this.sprite){
		this.mkdir(this.rootDirectory + '/' + this.common + '/img' + '/sprite');
	}
	if(this.OS){
		this.mkdir(this.rootDirectory + '/' + this.common + '/fonts');
		this.mkdir(this.rootDirectory + '/' + this.common + '/fonts' + '/icons');
	}
	this.mkdir(this.rootDirectory + '/' + this.common + '/' + this.compile);
	this.mkdir(this.rootDirectory + '/' + this.common + '/' + this.compile + '/scss');
	this.mkdir(this.rootDirectory + '/' + this.common + '/' + this.compile + '/coffee');
	this.mkdir(this.rootDirectory + '/' + this.common + '/' + this.compile + '/ts');
	this.mkdir(this.rootDirectory + '/' + this._documents);
	this.mkdir(this.rootDirectory + '/' + this._documents + '/modules');
	this.mkdir(this.rootDirectory + '/' + this._documents + '/styleguide_temp');

	//scssのライブラリのコピー
	this.directory('scss', this.rootDirectory + '/' + this.common + '/' + this.compile + '/scss');

	//各種設定ファイルのコピー
	if(this.OS){
		this.directory('cmd/cmd_command', this._dev + '/cmd_command');
	}else{
		this.directory('cmd/cmd_bat', this._dev + '/cmd_bat');
	}
	if(this.OS){
		this.template('_package_mac.json','package.json');
	}else{
		this.template('_package_win.json','package.json');
	}
	if(this.OS){
		this.template('Gruntfile_mac.js','Gruntfile.js');
	}else{
		this.template('Gruntfile_win.js','Gruntfile.js');
	}
	this.template('_bower.json','bower.json');
	this.template('bowerrc','.bowerrc');
	this.template('index.html', this.rootDirectory + '/index.html');
	this.template('config.rb', this._dev + '/config.rb');
};