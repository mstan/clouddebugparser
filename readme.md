### About

This file is a parser to help assisting in reading cloud-debug AT command output for cellular devices at Particle. This tool is not meant to be exhaustive or comprehensive in all of its functionality.

### How it works
A user specifies a text file containing cloud debug log output from the command using the FILE environment variable. 

The file is then parsed, parsing passed arguments, commands, and output.

#### Argument lookup

All commands are cross checked in the commands.json file and the output from what file is printed accordingly. This commands.json list is intentionally NON exhaustive as the intent is for Particle devices, which use a subset of this.

As appropriate, additional commands will be added to the commands.json file.

All commands in commands.json are sourced from: https://www.u-blox.com/sites/default/files/u-blox-CEL_ATCommands_%28UBX-13002752%29.pdf

#### Interpreting

69.244           AT read           OK             6      "\r\nOK\r\n"
Timestamp (ms), <AT read|AT send>  Response Type  Bytes  Response


Notes:

* Bytes are not included in the final JSON output as newline characters are stripped out of responses. (\r\n). This is done for readability purposes--but in doing so, makes the byte count mismatch the account response.

* AT literally stands for ATtention
* AT indicates a newline. Not a part of the command.
* If a command is simple, such as ATD, then AT is a newline, and D (Dial) is the command.
An extended command starts with a +. +CMGL (list SMS messages), it is an extended command
* GPRS (General Packet Radio Service) is an "extended version" of a GSM modem.

After AT read/AT send--there is a response of OK,ERR,UNK, or +
    * OK is that it executed successfully.
    * ERR is that it executed unsuccessfully
    * UNK is unknown block of data
    * + is a complex response is expected (it will respond with an AT+ command response)

### How to use it

For now, the only output is done via command line. Later on, the goal is to have the objects be JSON objects passed to a webpage for easy viewing.

Recommended Node v9 or later and npm v6.5.0 or later.

- Clone the repository
- `npm install`
- `DEBUG=cdp* FILE=sample.txt node index.js`

### Future goals

* Allow sourcing from stdin to allow for direct streaming interpretation from output device
* Implement webpage generation to allow for easier and more comprehensive reading of JSON output.
* Implement more complex response parsing, indicating meanings of output values.


### Example output

```
  cdp:print [602] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,0] [Read the GPRS network registration information.] +0ms
  cdp:print [608] [MODEM_SEND] [AT+CREG?] [] [+CREG: 2,+CGREG: 2,+CREG: 2,2] [Read network registration information] +0ms
  cdp:print [618] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,2] [Read the GPRS network registration information.] +0ms
  cdp:print [628] [MODEM_OFF] +0ms
  cdp:print [630] [MODEM_SEND] [AT+CPWROFF] [] [] [Shut down the module] +0ms
  cdp:print [634] [MODEM_ON] +0ms
  cdp:print [636] [MODEM_SEND] [AT] [] [] [No command found] +0ms
  cdp:print [638] [MODEM_SEND] [AT] [] [] [No command found] +0ms
  cdp:print [640] [MODEM_SEND] [AT] [] [] [No command found] +0ms
  cdp:print [642] [MODEM_SEND] [AT] [] [AT] [No command found] +0ms
  cdp:print [648] [MODEM_SEND] [AT E0] [] [AT E0] [Disables echoing of commands] +0ms
  cdp:print [654] [MODEM_SEND] [AT+CMEE] [2] [] [Configure the formatting of the result code +CME ERROR: <err> as an indication of an error relating to the functionality of the MT.] +0ms
  cdp:print [658] [MODEM_SEND] [AT+CMER] [1,0,0,2,1] [] [Configures sending of URCs from MT to DTE for indications.] +1ms
  cdp:print [662] [MODEM_SEND] [AT+IPR] [115200] [] [Specify the data rate the DCE accepts commands on the UART interface.] +0ms
  cdp:print [666] [MODEM_SEND] [AT+CPIN?] [] [+CPIN: READY] [Reads the PIN.] +0ms
  cdp:print [680] [MODEM_INITIALIZED] +0ms
  cdp:print [682] [MODEM_SEND] [AT+CGSN] [] [352580082886701] [Return product IMEI serial number] +0ms
  cdp:print [688] [MODEM_SEND] [AT+CGMI] [] [u-blox] [Text string identifying the manufacturer.] +0ms
  cdp:print [694] [MODEM_SEND] [AT+CGMM] [] [SARA-U260] [Model of the u-blox device] +0ms
  cdp:print [700] [MODEM_SEND] [AT+CGMR] [] [23.20] [Return the firmware version of the module] +0ms
  cdp:print [706] [MODEM_SEND] [AT+CCID] [] [+CCID: 12345678901234567890] [Returns SIM card ICCID] +0ms
  cdp:print [712] [MODEM_SEND] [AT+UPSV] [1] [] [Set the UART power saving configuration] +0ms
  cdp:print [716] [MODEM_SEND] [AT+CMGF] [1] [] [Indicates to the MT which input and output format of messages shall be used.] +0ms
  cdp:print [720] [MODEM_SEND] [AT+CNMI] [2,1] [] [Select the procedure to indicate the reception of a new SMS in case of the MT is active] +0ms
  cdp:print [724] [MODEM_SEND] [AT+CIMI] [] [730013011034938] [Request the IMSI (International Mobile Subscriber Identity).] +0ms
  cdp:print [730] [MODEM_REGISTER] +0ms
  cdp:print [732] [MODEM_SEND] [AT+CREG?] [] [+CREG: 0,0] [Read network registration information] +0ms
  cdp:print [738] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 0,0] [Read the GPRS network registration information.] +0ms
  cdp:print [744] [MODEM_SEND] [AT+CGREG] [2] [] [Configure the GPRS network registration information.] +0ms
  cdp:print [748] [MODEM_SEND] [AT+CREG] [2] [] [Configure network registration information] +1ms
  cdp:print [752] [MODEM_SEND] [AT+CREG?] [] [+CREG: 2,0] [Read network registration information] +0ms
  cdp:print [758] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,0] [Read the GPRS network registration information.] +0ms
  cdp:print [764] [MODEM_SEND] [AT+CREG?] [] [+CREG: 2,0] [Read network registration information] +0ms
  cdp:print [770] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,0] [Read the GPRS network registration information.] +0ms
  cdp:print [776] [MODEM_SEND] [AT+CREG?] [] [+CIEV: 3,0,+CIEV: 7,0,+CIEV: 9,0,+CREG: 2,0] [Read network registration information] +0ms
  cdp:print [790] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,0] [Read the GPRS network registration information.] +0ms
  cdp:print [796] [MODEM_SEND] [AT+CREG?] [] [+CREG: 2,+CGREG: 2,+CREG: 2,2] [Read network registration information] +0ms
  cdp:print [806] [MODEM_SEND] [AT+CGREG?] [] [+CGREG: 2,2] [Read the GPRS network registration information.] +0ms
  ```