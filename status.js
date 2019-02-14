var StartServer = require('./server').StartServer;

var services = [
    {
        name: 'gpio',
        commandline: 'gpio readall',
        interval: 250,
    },
    {
        name: 'date',
        commandline: 'date',
        interval: 500,
    },
    {
        name: 'top',
        commandline: 'top -b -n 1',
        interval: 1500,
    },
    {
        name: 'vmstat',
        commandline: 'vmstat -s',
        interval: 1500,
    },
    {
        commandline: 'uptime',
        interval: 5000,
    }
]

var port = process.env.npm_package_config_port || 9999

var io = StartServer(port, function(socket) { 
    console.log("Socket connected");
    const exec = require('child_process').exec;
    var intervals = [];
    services.map(service => {
        intervals.push(setInterval(() => {
            //console.log(`Executing ${service.commandline}`);
            exec(service.commandline, (error, stdout, stderr)  => socket.emit('message',{ key: service.commandline, value: stdout}));
        },service.interval));
    });

    socket.on('disconnect', () => intervals.map(clearInterval));
    socket.on('shutdown', mode => {
        var cmdLine = `sudo shutdown ${(mode == 'shutdown' ? "" : "-r")} now`;
        exec(cmdLine);
    });
})
