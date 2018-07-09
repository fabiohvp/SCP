'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("./init/variables");
const settings_1 = require("./init/settings");
const files_1 = require("./actions/files");
const fs = require("fs");
class EventFunctions {
    configurationChanged(change) {
        settings_1.Settings.scp = change.settings.scp;
        settings_1.Settings.scp.maxNumberOfProblems = settings_1.Settings.scp.maxNumberOfProblems || 50;
        variables_1.scp.issueCommands = [];
        let scpGrammarFile = require('../scp.json');
        let patterns = [{ "include": "#vObject-statements" }];
        if (settings_1.Settings.scp.enableOFP) {
            patterns.push({ "include": "#OFP" });
        }
        if ((JSON.stringify(scpGrammarFile.repository.statements.patterns) != JSON.stringify(patterns))) {
            scpGrammarFile.repository.statements.patterns = patterns;
            fs.truncate(__dirname + "/../scp.json", 0, function () {
                fs.writeFile(__dirname + "/../scp.json", JSON.stringify(scpGrammarFile));
            });
            variables_1.connection.sendRequest('requestRestart', 'SCP Language configuration updated. Please restart Visual Studio Code to apply the changes');
        }

        //variables_1.scp.issueCommands.push({ 'cmd': 'BIS_', 'regex': /(\b)(BIS_)([A-z0-9]*)(\s*)=/g, 'msg': 'The "BIS_" function should not be overwritten. "BIS_" is an reserved namespace for functions by Bohemia Interactive' });
        variables_1.documents.all().forEach(new files_1.File().validateScpFile);
    }
}
exports.EventFunctions = EventFunctions;
//# sourceMappingURL=events.js.map