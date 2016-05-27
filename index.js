'use strict';
var mockBin = require('mock-bin');
var which = require('shelljs').which;

module.exports = function (js, command) {
	var originalGit = which('git');

	if (command) {
		js = 'var argv = process.argv;' +
			'var commandExists = false;' +
			'var length = argv.length;' +
			'while (--length) {' +
				'if (argv[length] === "' + command + '") {' +
					'commandExists = true;' +
					'break;' +
				'}' +
			'}' +
			'if (commandExists) {' +
				js +
			'} else {' +
				'var childProcess = require("child_process");' +
				'argv.shift();' +
				'argv.shift();' +
				'childProcess.spawn("' + originalGit + '", argv, {' +
					'stdio: "inherit"' +
				'});' +
			'}';
	}

	return mockBin('git', 'node', js);
};
