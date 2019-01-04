// TO DO. Go over and clean this up. Then readme
let fs = require('fs');
let path = require('path');

const commandsSrc = path.join(__dirname, '..', 'commands.json');

let commands = JSON.parse( fs.readFileSync(commandsSrc, 'utf8') ); // get all commands and their descriptions, built from this file
let commandsKeys = Object.keys(commands); // get a list of all commands keys to reference

function getCommandInfo(command) {
    let commandArr = command
        .replace(/[^A-Z]^[0-9]/g, " ") // strip all all non capital alphanumerics
        .split(" "); //split by spaces.

    let parsedCommand = commandArr[0] //Assign the command here.
        .replace("AT+", ""); //strip any AT+ as it's not a part of the command

    // do a check, if the first argument is actually AT, shift to index sub 1.
    if(commandArr.length > 1 && commandArr[0] == 'AT') { // AT is a part of the command but we aren't interested in that, really
        parsedCommand = commandArr[1];
    } else 
    // also need to consider if 'AT' is the only parsed command.
    if(commandArr.length == 1 && commandArr[0] == 'AT') {
        parsedCommand = undefined;
    }

    // default response
    let response = {
        description: 'No command found'
    };

    if(!parsedCommand) { // No command was found. Either nothing followed AT or nothing parseable was passed
        return response;
    } else if( commandsKeys.indexOf(parsedCommand) > -1 ) { //is the command in our index array? if so, it's recognized!
        return commands[parsedCommand];
    } else { // we don't recognize this command, it must not be registered
        response.description = 'Unregistered command';
        return response;
    }
}

function parseArgs(line) {
    let args = [];
    let parsedLine = line.match(/(["'])(?:(?=(\\?))\2.)*?\1/) || []; // need || of empty array because if there are no matches, it becomes undefined.

    if(parsedLine[0].length > 0 && parsedLine[0].indexOf('=') > -1 ) { // ensure there is something in this array and that an equal sign exists to indicate args
        args = parsedLine[0]
            .replace(/"/g, '') // replace all quotes with nothing. Don't want them.
            .split('=')[1] // split first by =, taking the right side.
            .split(','); //Then, comma delimiters.
    }

    return args;
}

// find an instance of quoted data.
function parseCommand(line) {
    let command = undefined;
    let parsedLine = line.match(/(["'])(?:(?=(\\?))\2.)*?\1/) || []; // need || of empty array because if there are no matches, it becomes undefined.
    
    if(parsedLine[0].length > 0) {
        // for the below command, I WOULD THINK I should be able to do /"(.*?)"/ and just take that return but that doesn't work.
        // but instead, doing a /g and taking the first element works...?
        command = parsedLine[0].slice(1, parsedLine[0].length -1); // RegEx was being stupid and I wasn't able to not include the quotes, so do this for now
        command = command.split('=')[0]; // remove args
    }

    return command;
}

// gets the timestamp if it exists in this row
function parseTimestamp(line) {
    let numbers = line.match(/(([0-9]{0,})[.]([0-9]{0,}))/) || []; // get first set of numbers in the string that match some number of digits, period, some number of digits

    if(numbers.length > 0 ) { // if we got some numbers back, this line should be a match.
        return numbers[0];
    } else {
        return undefined; // we didn't get any numbers back.
    }
}

function parseLineType(line) {
    let modemOn = 'Modem::powerOn';
    let modemOff = 'Modem::powerOff';
    let modemInit = 'Modem::init';
    let modemRegister = 'Modem::register';
    let modemDetach = 'Modem::detach';

    let modemRead = 'AT read';
    let modemSend = 'AT send';
    let type = 'unknown';

    switch(true) {
        case (line.indexOf(modemOn) > -1):
            type = 'MODEM_ON';
            break;
        case (line.indexOf(modemOff) > -1):
            type = 'MODEM_OFF'
            break;
        case (line.indexOf(modemInit) > -1):
            type = 'MODEM_INITIALIZED';
            break;
        case (line.indexOf(modemRegister) > -1):
            type = 'MODEM_REGISTER';
            break;
        case (line.indexOf(modemRead) > -1):
            type = 'MODEM_READ';
            break;
        case (line.indexOf(modemSend) > -1):
            type = 'MODEM_SEND';
            break;
        case (line.indexOf(modemDetach) > -1):
            type = 'MODEM_DETACH';
            break;
        default:
            type = 'UNRECOGNIZED';
            break;
    }

    return type;
}

function parse(src) {
    src = src.replace(/\\"/g, '"') // drop all extra slashes floating around
          .split("\n");

    let outputArr = [];

    src.forEach((line,idx) => {
        if( line == "") return; // just skip empty lines
        if( line.indexOf('CIEV matched:') == 0 ) return; // This info is always in the previous line as well as an AT read response.
        if( line.indexOf( 'AT read OK') > -1 ) return; // OK responses are an expectation at the end of any AT that was successful. No real info here.

        line = line.trim() // trim any bogus whitespace.
               .replace(/\\[rn]/g, ""); //drop any unwanted /r and /n in the strings.
        /*
            initialize output object to push. Always include line index to start, and raw string

            idx is line index,
            raw refers to the raw line as it came through
            results is an array of info sent back from the AT modem about this command.
        */
        let lineType = parseLineType(line);

        let output = { 
            idx, 
            lineType,
            raw: line, 
            results: [],
        };

        if( lineType == 'MODEM_READ') { // if it's a READ, it's an OUTPUT. We should bind it to the last command in outputArr
            let result = parseCommand(line); // get the result

            if(result !== 'OK' && outputArr.length > 0) { // Everything successful terminates with 'OK'. We don't need to know that in our data. so let's skip that one.
                outputArr[outputArr.length -1].results.push(result);
            }

            return;
        }

        // if it's not a read, it's a send or something else. keep going
        if( lineType == 'MODEM_SEND') {  // if it's a SEND, register a brand new command to push to the array.
            // if it IS a command, keep going and get extra info like timestamp, etc
            // strip out stringified newline characters
            output.timestamp = parseTimestamp(line); // timestamp for line
            output.command = parseCommand(line);
            output.args = parseArgs(line);

            if(!!output.command) { // if the command exists, get info
                output.description = getCommandInfo(output.command).description;
            }
        }

        // output, whether it's a SEND or something else
        outputArr.push(output);

    })

    return outputArr;
}

module.exports = {
    parse
}