/* Env variables */
let sourceFile = process.env.FILE;

/* Node modules */
let fs = require('fs');
let debug = require('debug')('cdp');

/* local modules */
let { parser, printer } = require('./lib');

let src = fs.readFileSync(`${__dirname}/${sourceFile}`, 'utf8');
let parsedCommands = parser.parse(src);

printer.print(parsedCommands);

