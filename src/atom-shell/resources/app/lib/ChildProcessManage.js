var child_process = require('child_process');
var ipc = require('ipc');

/*ipc.on('ping', function(data){
	console.log('ping:', data);
	ipc.send('pingback', 'uuuuuu');
});*/

module.exports = function(command, run_params, options){
	var childe_process = child_process.spawn(command, run_params, options);
	var pid = childe_process.pid;
	ipc.send('add_child_process', childe_process);
	childe_process.on('exit', function(code){
		child_process.spawn('TASKKILL', ['/F', '/T', '/PID', pid]);
	});
	return childe_process;
};