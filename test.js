const {EOL} = require('os');
const test = require('ava');
const shell = require('shelljs');
const m = require('.');

shell.config.silent = true;

test('mock and unmock git bla', async t => {
	const log = 'mocking git bla!';
	const unmock = await m(`console.log('${log}')`, 'bla');
	let actual = shell.exec('git bla').stdout;
	t.is(log + EOL, actual);

	actual = shell.exec('git').stdout;
	t.not(log + EOL, actual);

	unmock();
	actual = shell.exec('git bla').stdout;
	t.not(log + EOL, actual);
});

test('mock and unmock git --no-pager bla', async t => {
	const log = 'mocking git bla!';
	const unmock = await m(`console.log('${log}')`, 'bla');
	let actual = shell.exec('git --no-pager bla').stdout;
	t.is(log + EOL, actual);

	actual = shell.exec('git').stdout;
	t.not(log + EOL, actual);

	unmock();
	actual = shell.exec('git --no-pager bla').stdout;
	t.not(log + EOL, actual);
});

test('mocking bar does not affect foo', async t => {
	const fooLog = 'mocking foo!';
	await m(`console.log('${fooLog}')`, 'foo');

	const barLog = 'mocking bar!';
	await m(`console.log('${barLog}')`, 'bar');

	let barActual = shell.exec('git bar').stdout;
	t.is(barLog + EOL, barActual);

	barActual = shell.exec('git --no-pager bar').stdout;
	t.is(barLog + EOL, barActual);

	let fooActual = shell.exec('git foo').stdout;
	t.is(fooLog + EOL, fooActual);

	fooActual = shell.exec('git --no-pager foo').stdout;
	t.is(fooLog + EOL, fooActual);

	const {stderr} = shell.exec('git log');
	t.falsy(stderr);
});

test('mocking git', async t => {
	const log = 'mocking git!';
	const unmock = await m(`console.log('${log}')`);

	let actual = shell.exec('git');
	t.is(log + EOL, actual.stdout);
	t.falsy(actual.stderr);

	actual = shell.exec('git foo');
	t.is(log + EOL, actual.stdout);
	t.falsy(actual.stderr);

	actual = shell.exec('git --no-pager log');
	t.is(log + EOL, actual.stdout);
	t.falsy(actual.stderr);

	unmock();
	actual = shell.exec('git');
	t.not(log + EOL, actual.stdout);
	t.falsy(actual.stderr);
});

test('passing arguments while mocking only commit', async t => {
	const unmock = await m('console.log(process.argv.splice(2).join(" "));', 'commit');
	const args = 'commit --obviously-invalid-arg -m "second commit with spaces!"';

	const actual = shell.exec(`git ${args}`);
	t.falsy(actual.stderr);
	t.is(`${args.replace(/"/g, '')}${EOL}`, actual.stdout);
	unmock();
});

test('passing arguments while mocking whole git', async t => {
	const unmock = await m('console.log(process.argv.splice(2).join(" "));');
	const args = 'commit --obviously-invalid-arg -m "third commit with spaces!"';

	const actual = shell.exec(`git ${args}`);
	t.falsy(actual.stderr);
	t.is(`${args.replace(/"/g, '')}${EOL}`, actual.stdout);

	unmock();
});

test('passing through exit code', async t => {
	const unmock = await m('process.exitCode = 1');
	const args = 'foo';

	const actual = shell.exec(`git ${args}`).code;
	t.is(1, actual);

	unmock();
});

test('passing through exit code with multiple mocks', async t => {
	const unmock = [await m('process.exitCode = 1', 'one'), await m('process.exitCode = 2', 'two')];

	t.is(1, shell.exec('git one').code);
	t.is(2, shell.exec('git two').code);

	unmock[0]();
	unmock[1]();
});
