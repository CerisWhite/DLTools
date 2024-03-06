// Dragalia AIScript 2 UABEA JSON converter, made with <3 by Ceris
let AIScript = {
	"m_GameObject": {
		"m_FileID": 0,
		"m_PathID": 0
	},
	"m_Enabled": 1,
	"m_Script": {
		"m_FileID": 0,
		"m_PathID": "4683851363045714928"
	},
	"m_Name": "",
	"_containers": {
		"Array": []
	}
}

const States = {
	"INITIALIZE": 0,
	"INIT": 0,
	"ORDINARY": 1,
	"IDLE": 1,
	"OVERDRIVE": 2,
	"BREAK": 3,
	"END": 4
}
const Comparator = {
	"GREATERTHANEQUALS": 0,
	">=": 0,
	"LESSTHANEQUALS": 1,
	"<=": 1,
	"NOTEQUAL": 2,
	"!=": 2,
	"EQUALS": 3,
	"==": 3,
	"GREATERTHAN": 4,
	">": 4,
	"LESSTHAN": 5,
	"<": 5,
	"NONE": 6
}
function Comparison(Value) {
	let Compare = {
		"valString": "",
		"valInt": 0,
		"valFloat": 0.0,
		"valType": 0,
		"splitValStrings": { "Array": [
			String(Value)
		]}
	}
	if (!isNaN(parseInt(Value)) && String(Value).slice(-1) != "f") {
		Compare['valString'] = String(Value);
		Compare['valInt'] = parseInt(Value);
		Compare['valFloat'] = parseFloat(Value);
		Compare['valType'] = 1;
	}
	else {
		if (String(Value).slice(-1) == "f") {
			Compare['valString'] = String(Value).slice(0, String(Value).length - 1);
			Compare['valInt'] = parseInt(Value);
			Compare['valFloat'] = parseFloat(String(Value).slice(0, String(Value).length - 1));
			Compare['valType'] = 2;
			Compare['splitValStrings']['Array'][0] = String(Value).slice(0, String(Value).length - 1);
		}
		else {
			Compare['valString'] = String(Value);
			Compare['valInt'] = 0;
			Compare['valFloat'] = 0.0;
		}
	}
	return Compare;
}
function GetIfEnd(Lines, x) {
	let z = 1;
	let NestedIfLevel = 0;
	while (z < (Lines.length - x)) {
		let Operand = Lines[x + z].split(" ");
		if (Operand[0].toUpperCase() == "IF") {
			NestedIfLevel += 1;
		}
		if ((NestedIfLevel == 0 && Operand[0].toUpperCase() == "ELSEIF") ||
			(NestedIfLevel == 0 && Operand[0].toUpperCase() == "ELSE") ||
			(NestedIfLevel == 0 && Operand[0].toUpperCase() == "ENDIF")) {
			return z;	
		}
		if (NestedIfLevel > 0 && Operand[0].toUpperCase() == "ENDIF") {
			NestedIfLevel -= 1;
		}
		z++;
	}
	throw("Unable to find End of If condition");
}

const fs = require('fs');
const EnemyAI = fs.readFileSync(process.argv[2]).toString();
let OutFile = process.argv[2] + ".json";
if (process.argv[3] != undefined) { OutFile = process.argv[3]; }

let Lines = EnemyAI.split("\n");
if (Lines[0].slice(-1) == "\r") {
	Lines = EnemyAI.split("\r\n");
}
for (let t in Lines) {
	while (Lines[t].slice(0, 1) == "\t" || Lines[t].slice(0, 1) == " ") { Lines[t] = Lines[t].slice(1, Lines[t].length); }
	while (Lines[t].slice(-1) == "\t" || Lines[t].slice(-1) == " ") { Lines[t] = Lines[t].slice(0, Lines[t].length - 1); }
}
for (let x in Lines) {
	let Template = {
        "_command": 0,
        "_params": { "Array": [
			{
				"columns": { "Array": [
					{
						"values": { "Array": [
							{
								"valString": "",
								"valInt": 0,
								"valFloat": 0.0,
								"valType": 0,
								"splitValStrings": { "Array": [
									""
								]}
							}
						]},
						'compare': 6
					}
                ]}
            }
        ]},
        "_jumpStep": 1
    }
	const Operand = Lines[x].split(" ");
	switch(Operand[0].toUpperCase()) {
		case "NAME":
			AIScript['m_Name'] = Operand[1];
			break;
		case "DEF":
			Template['_command'] = 0;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = Operand[1];
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = Operand[1];
			break;
		case "ENDDEF":
			Template['_command'] = 1;
			Template['_params']['Array'] = [];
			break;
		case "IF":
			Template['_command'] = 2;
			let ICount = Operand.length / 4;
			let i = 0; while (i < ICount) {
				if ((Operand[(i * 4) + 2]) == "NONE") {
					Template['_params']['Array'][0]['columns']['Array'][i] = {
						'values': { 'Array': [
							Comparison(Operand[(i * 4) + 1])
						]},
						'compare': 6
					}
				}
				else {
					Template['_params']['Array'][0]['columns']['Array'][i] = {
						'values': { 'Array': [
							Comparison(Operand[(i * 4) + 1]),
							Comparison(Operand[(i * 4) + 3])
						]},
						'compare': Comparator[String(Operand[(i * 4) + 2])]
					}
				}
				i++;
			}
			Template['_jumpStep'] = GetIfEnd(Lines, parseInt(x));
			break;
		case "ELSE":
			Template['_command'] = 3;
			Template['_params']['Array'] = [];
			Template['_jumpStep'] = GetIfEnd(Lines, parseInt(x));
			break;
		case "ELSEIF":
			Template['_command'] = 4;
			let EICount = Operand.length / 4;
			let ei = 0; while (ei < EICount) {
				if ((Operand[(ei * 4) + 2]) == "NONE") {
					Template['_params']['Array'][0]['columns']['Array'][ei] = {
						'values': { 'Array': [
							Comparison(Operand[(ei * 4) + 1])
						]},
						'compare': 6
					}
				}
				else {
					Template['_params']['Array'][0]['columns']['Array'][ei] = {
						'values': { 'Array': [
							Comparison(Operand[(ei * 4) + 1]),
							Comparison(Operand[(ei * 4) + 3])
						]},
						'compare': Comparator[String(Operand[(ei * 4) + 2])]
					}
				}
				ei++;
			}
			Template['_jumpStep'] = GetIfEnd(Lines, parseInt(x));
			break;
		case "ENDIF":
			Template['_command'] = 5;
			Template['_params']['Array'] = [];
			break;
		case "SET":
			Template['_command'] = 6;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			break;
		case "ADD":
			Template['_command'] = 7;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			if (Operand[2].slice(-1) == "f") {
				Template['_params']['Array'][1]['columns']['Array'][0]['values']['Array'][0]['valType'] = 2;
			}
			break;
		case "SUBTRACT":
			Template['_command'] = 8;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			if (Operand[2].slice(-1) == "f") {
				Template['_params']['Array'][1]['columns']['Array'][0]['values']['Array'][0]['valType'] = 2;
			}
			break;
		case "SETTARGET":
			Template['_command'] = 9;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0] = {
				"valString": String(Operand[1]),
				"valInt": parseInt(Operand[1]),
				"valFloat": parseFloat(Operand[1]),
				"valType": 1,
				"splitValStrings": { "Array": [
					String(Operand[1])
				]}
			}
			break;
		case "ENDSCRIPT":
			Template['_command'] = 10;
			Template['_params']['Array'] = [];
			break;
		case "ACTION":
			Template['_command'] = 11;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0] = Comparison(Operand[1]);
			
			break;
		case "FUNCTION":
			Template['_command'] = 12;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = Operand[1];
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = Operand[1];
			break;
		case "MOVEACTION":
			Template['_command'] = 13;
			let a = 1; while (a < Operand.length) {
				Template['_params']['Array'][a - 1] = {
					'columns': {
					'Array': [
						{
							'values': { 'Array': [ Comparison(Operand[a]) ]},
							'compare': 6
						}
					]}
				}
				a++;
			}
			break;
		case "TURNACTION":
			Template['_command'] = 14;
			let b = 1; while (b < Operand.length) {
				Template['_params']['Array'][b - 1] = {
					'columns': {
					'Array': [
						{
							'values': { 'Array': [ Comparison(Operand[b]) ]},
							'compare': 6
						}
					]}
				}
				b++;
			}
			break;
		case "RANDOM":
			Template['_command'] = 15;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			Template['_params']['Array'][2] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[3]) ]},
						'compare': 6
					}
				]}
			}
			break;
		case "RECTIMER":
			Template['_command'] = 16;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0] = Comparison(Operand[1]);
			break;
		case "RECHPRATE":
			break;
		case "ALIVENUM":
			Template['_command'] = 18;
			Template['_params']['Array'][0] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[1]) ]},
						'compare': 6
					}
				]}
			}
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			break;
		case "JUMP":
			Template['_command'] = 19;
			Template['_params']['Array'] = [];
			Template['_jumpStep'] = parseInt(Operand[1]);
			break;
		case "WAKE":
			Template['_command'] = 20;
			Template['_params']['Array'] = [];
			break;
		case "CLEARDMGCNT":
			Template['_command'] = 21;
			Template['_params']['Array'] = [];
			break;
		case "UNUSUALPOSTURE":
			break;
		case "FROMACTIONSET":
			Template['_command'] = 23;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			break;
		case "GM_SETTURNEVENT":
			break;
		case "GM_COMPLETETURNEVENT":
			break;
		case "GM_SETTURNMAX":
			break;
		case "GM_SETSUDDENEVENT":
			break;
		case "GM_SETBANDITEVENT":
			break;
		case "MULTIPLY":
			Template['_command'] = 29;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			if (Operand[2].slice(-1) == "f") {
				Template['_params']['Array'][1]['columns']['Array'][0]['values']['Array'][0]['valType'] = 2;
			}
			break;
		case "ORDERCLOSER":
			break;
		case "ORDERALIVEFATHER":
			break;
		case "FROMACTIONSETBOOST":
			Template['_command'] = 32;
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['valString'] = String(Operand[1]);
			Template['_params']['Array'][0]['columns']['Array'][0]['values']['Array'][0]['splitValStrings']['Array'][0] = String(Operand[1]);
			Template['_params']['Array'][1] = {
				'columns': { 'Array': [
					{
						'values': { 'Array': [ Comparison(Operand[2]) ]},
						'compare': 6
					}
				]}
			}
			break;
		case "UNITNUMBERINCIRCLE":
			break;
		case "RESERVED8":
			break;
		case "RESERVED9":
			break;
		case "RESERVED1":
			break;
	}
	if (Operand[0].toUpperCase() != "NAME") { AIScript['_containers']['Array'].push(Template); }
}
const OutData = JSON.stringify(AIScript, null, 2);
let CorrectedData = "";
const OutDataLines = OutData.split("\n");
for (let o in OutDataLines) {
	let TabString = "";
	while (OutDataLines[o].slice(0, 1) == " ") {
		TabString += " ";
		OutDataLines[o] = OutDataLines[o].slice(1, OutDataLines[o].length);
	}
	if (OutDataLines[o].startsWith("\"valFloat\"") && !OutDataLines[o].includes(".")) {
		OutDataLines[o] = OutDataLines[o].slice(0, OutDataLines[o].length - 1);
		OutDataLines[o] += ".0,";
	}
	if (o == 8) { OutDataLines[o] = '"m_PathID": 4683851363045714928'; }
	OutDataLines[o] = TabString + OutDataLines[o] + "\n";
	CorrectedData += OutDataLines[o]; 
}
CorrectedData = CorrectedData.slice(0, CorrectedData.length - 1);
fs.writeFileSync(OutFile, CorrectedData);