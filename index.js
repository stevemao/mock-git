'use strict';
var mockBin = require('mock-bin');
var which = require('shelljs').which;

module.exports = function (command, js) {
	var originalGit = which('git');

	js = 'var argv = process.argv;' +
		'if (argv[2] === "' + command + '") {' +
			js +
		'} else {' +
			'var childProcess = require("child_process");' +
			'argv.shift();' +
			'argv.shift();' +
			'childProcess.spawn("' + originalGit + '", argv, {' +
				'stdio: "inherit"' +
			'});' +
		'}';

	return mockBin('git', 'node', js);
};
