let debug = require('debug')('cdp:print');

// prints to CLI
function print(parsedCommands) {
    parsedCommands.forEach(function(parsedCommand) {
        let { idx, raw, lineType, timestamp, command, args, description, results } = parsedCommand;

        switch (lineType) {
            case 'MODEM_SEND':
                debug(`[${idx}] [${lineType}] [${command}] [${args}] [${results}] [${description}]`/* + `[${raw}]` */);
                break;
            case 'MODEM_ON':
            case 'MODEM_OFF':
            case 'MODEM_REGISTER':
            case 'MODEM_INITIALIZED':
                debug(`[${idx}] [${lineType}]`)
        }
    });
}

module.exports = {
    print
}