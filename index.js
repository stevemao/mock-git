const {which} = require('shelljs');
const mockBin = require('mock-bin');

const rbackslash = /\\/g;
module.exports = function (js, command) {
	const originalGit = which('git').stdout.replace(rbackslash, '\\\\');
	if (command) {
		js = `
			const argv = process.argv;
			let commandExists = false;
			let length = argv.length;
			while (--length) {
				if (argv[length] === "${command}") {
					commandExists = true;
					break;
				}
			}
			if (commandExists) {
				${js}
			} else {
				function handleExitCode(code) { process.exitCode = code || 0; }
				const childProcess = require("child_process");
				argv.shift();
				argv.shift();
				childProcess.spawn("${originalGit}", argv, {
					stdio: "inherit"
				}).on("close", handleExitCode).on("exit", handleExitCode);
			}
		`;
	}

	return mockBin('git', 'node', js);
};
