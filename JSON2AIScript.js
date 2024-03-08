// UABEA JSON 2 Dragalia AIScript converter, made with <3 by Ceris
const fs = require('fs');
const EnemyAI = JSON.parse(fs.readFileSync(process.argv[2]));
let OutFile = process.argv[2] + ".txt";
if (process.argv[3] != undefined) { OutFile = process.argv[3]; }

const Comparator = [ ">=", "<=", "!=", "==", ">", "<", "NONE" ];

let TabCount = 0;
let AIScript = "Name " + EnemyAI['m_Name'] + "\n";
const Inner = EnemyAI['_containers']['Array'];
for (let ent in Inner) {
	const Params = Inner[ent]['_params']['Array'];
	let NextLine = "";
	if (TabCount > 0) { let t = 0; while (t < TabCount) { NextLine += "\t"; t++; } }
	switch(Inner[ent]['_command']) {
		case 0:
			NextLine += "Def " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			TabCount += 1;
			break;
		case 1:
			TabCount -= 1;
			NextLine = NextLine.slice(1, NextLine.length);
			NextLine += "EndDef" + "\n";
			break;
		case 2:
			NextLine += "If ";
			for (let c in Params[0]['columns']['Array']) {
				if (c > 0) { NextLine += " AND "; }
				NextLine += Params[0]['columns']['Array'][c]['values']['Array'][0]['valString'] + " ";
				NextLine += Comparator[Params[0]['columns']['Array'][c]['compare']];
				if (Params[0]['columns']['Array'][c]['values']['Array'][1] == undefined) { break; }
				else { NextLine += " "; }
				if (Params[0]['columns']['Array'][c]['values']['Array'][1]['valType'] == 0) {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valString'];
				}
				else if (Params[0]['columns']['Array'][c]['values']['Array'][1]['valType'] == 2) {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valFloat'] + "f";
				}
				else {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valInt'];
				}
			}
			NextLine += "\n";
			TabCount += 1;
			break;
		case 3:
			NextLine = NextLine.slice(1, NextLine.length);
			NextLine += "Else\n";
			break;
		case 4:
			NextLine = NextLine.slice(1, NextLine.length);
			NextLine += "ElseIf ";
			for (let c in Params[0]['columns']['Array']) {
				if (c > 0) { NextLine += " AND "; }
				NextLine += Params[0]['columns']['Array'][c]['values']['Array'][0]['valString'] + " ";
				NextLine += Comparator[Params[0]['columns']['Array'][c]['compare']];
				if (Params[0]['columns']['Array'][c]['values']['Array'][1] == undefined) { break; }
				else { NextLine += " "; }
				if (Params[0]['columns']['Array'][c]['values']['Array'][1]['valType'] == 0) {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valString'];
				}
				else if (Params[0]['columns']['Array'][c]['values']['Array'][1]['valType'] == 2) {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valFloat'] + "f";
				}
				else {
					NextLine += Params[0]['columns']['Array'][c]['values']['Array'][1]['valInt'];
				}
			}
			NextLine += "\n";
			break;
		case 5:
			TabCount -= 1;
			NextLine = NextLine.slice(1, NextLine.length);
			NextLine += "EndIf" + "\n";
			break;
		case 6:
			NextLine += "Set " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + " ";
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 0) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'];
			}
			else if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 2) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valFloat'] + "f";
			}
			else {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valInt'];
			}
			NextLine += "\n";
			break;
		case 7:
			NextLine += "Add " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + " ";
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 0) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 1) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valInt'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 2) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valFloat'] + "f" + "\n";
			}
			break;
		case 8:
			NextLine += "Sub " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + " ";
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 0) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 1) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valInt'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 2) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valFloat'] + "f" + "\n";
			}
			break;
		case 9:
			NextLine += "SetTarget " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valInt'] + "\n";
			break;
		case 10:
			NextLine += "EndScript" + "\n";
			break;
		case 11:
			NextLine += "Action " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 12:
			NextLine += "Function " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 13:
			NextLine += "MoveAction ";
			for (let p in Params) {
				if (p > 0) { NextLine += " "; }
				NextLine += Params[p]['columns']['Array'][0]['values']['Array'][0]['valInt'];
			}
			NextLine += "\n";
			break;
		case 14:
			NextLine += "TurnAction ";
			for (let p in Params) {
				if (p > 0) { NextLine += " "; }
				NextLine += Params[p]['columns']['Array'][0]['values']['Array'][0]['valInt'];
			}
			NextLine += "\n";
			break;
		case 15:
			NextLine += "Random " +
						Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + " " +
						Params[1]['columns']['Array'][0]['values']['Array'][0]['valInt'] + " " +
						Params[2]['columns']['Array'][0]['values']['Array'][0]['valInt'] + "\n";
			break;
		case 16:
			NextLine += "RecTimer " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 17:
			break;
		case 18:
			NextLine += "AliveNum " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valInt'] + " " +
						Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 19:
			NextLine += "Jump " + Inner[ent]['_jumpStep'] + "\n";
			break;
		case 20:
			NextLine += "Wake" + "\n";
			break;
		case 21:
			NextLine += "ClearDmgCnt" + "\n";
			break;
		case 22:
			NextLine += "UnusualPosture " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 23:
			NextLine += "FromActionSet " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'];
			NextLine += " " +  Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 24:
			break;
		case 25:
			break;
		case 26:
			break;
		case 27:
			break;
		case 28:
			break;
		case 29:
			NextLine += "Multiply " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'] + " ";
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 0) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 1) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valInt'] + "\n";
			}
			if (Params[1]['columns']['Array'][0]['values']['Array'][0]['valType'] == 2) {
				NextLine += Params[1]['columns']['Array'][0]['values']['Array'][0]['valFloat'] + "f" + "\n";
			}
			break;
		case 30:
			break;
		case 31:
			break;
		case 32:
			NextLine += "FromActionSetBoost " + Params[0]['columns']['Array'][0]['values']['Array'][0]['valString'];
			NextLine += " " +  Params[1]['columns']['Array'][0]['values']['Array'][0]['valString'] + "\n";
			break;
		case 33:
			break;
	}
	AIScript += NextLine;
}
AIScript = AIScript.slice(0, AIScript.length - 1);
fs.writeFileSync(OutFile, AIScript);