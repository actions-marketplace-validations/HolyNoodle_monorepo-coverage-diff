/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4087:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(7147);
const os_1 = __nccwpck_require__(2037);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        var _a, _b, _c;
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
        this.apiUrl = (_a = process.env.GITHUB_API_URL) !== null && _a !== void 0 ? _a : `https://api.github.com`;
        this.serverUrl = (_b = process.env.GITHUB_SERVER_URL) !== null && _b !== void 0 ? _b : `https://github.com`;
        this.graphqlUrl = (_c = process.env.GITHUB_GRAPHQL_URL) !== null && _c !== void 0 ? _c : `https://api.github.com/graphql`;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 5438:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const utils_1 = __nccwpck_require__(3030);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options, ...additionalPlugins) {
    const GitHubWithPlugins = utils_1.GitHub.plugin(...additionalPlugins);
    return new GitHubWithPlugins(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 7914:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(6255));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.defaults = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const Utils = __importStar(__nccwpck_require__(7914));
// octokit + plugins
const core_1 = __nccwpck_require__(6762);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(3044);
const plugin_paginate_rest_1 = __nccwpck_require__(4193);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
exports.defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(exports.defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4751:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", ({ value: true }));
__export(__nccwpck_require__(2825));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2825:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __nccwpck_require__(7147);
const debug_1 = __importDefault(__nccwpck_require__(8237));
const log = debug_1.default('@kwsites/file-exists');
function check(path, isFile, isDirectory) {
    log(`checking %s`, path);
    try {
        const stat = fs_1.statSync(path);
        if (stat.isFile() && isFile) {
            log(`[OK] path represents a file`);
            return true;
        }
        if (stat.isDirectory() && isDirectory) {
            log(`[OK] path represents a directory`);
            return true;
        }
        log(`[FAIL] path represents something other than a file or directory`);
        return false;
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            log(`[FAIL] path is not accessible: %o`, e);
            return false;
        }
        log(`[FATAL] %o`, e);
        throw e;
    }
}
/**
 * Synchronous validation of a path existing either as a file or as a directory.
 *
 * @param {string} path The path to check
 * @param {number} type One or both of the exported numeric constants
 */
function exists(path, type = exports.READABLE) {
    return check(path, (type & exports.FILE) > 0, (type & exports.FOLDER) > 0);
}
exports.exists = exists;
/**
 * Constant representing a file
 */
exports.FILE = 1;
/**
 * Constant representing a folder
 */
exports.FOLDER = 2;
/**
 * Constant representing either a file or a folder
 */
exports.READABLE = exports.FILE + exports.FOLDER;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9819:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDeferred = exports.deferred = void 0;
/**
 * Creates a new `DeferredPromise`
 *
 * ```typescript
 import {deferred} from '@kwsites/promise-deferred`;
 ```
 */
function deferred() {
    let done;
    let fail;
    let status = 'pending';
    const promise = new Promise((_done, _fail) => {
        done = _done;
        fail = _fail;
    });
    return {
        promise,
        done(result) {
            if (status === 'pending') {
                status = 'resolved';
                done(result);
            }
        },
        fail(error) {
            if (status === 'pending') {
                status = 'rejected';
                fail(error);
            }
        },
        get fulfilled() {
            return status !== 'pending';
        },
        get status() {
            return status;
        },
    };
}
exports.deferred = deferred;
/**
 * Alias of the exported `deferred` function, to help consumers wanting to use `deferred` as the
 * local variable name rather than the factory import name, without needing to rename on import.
 *
 * ```typescript
 import {createDeferred} from '@kwsites/promise-deferred`;
 ```
 */
exports.createDeferred = deferred;
/**
 * Default export allows use as:
 *
 * ```typescript
 import deferred from '@kwsites/promise-deferred`;
 ```
 */
exports["default"] = deferred;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
const REGEX_IS_INSTALLATION = /^ghs_/;
const REGEX_IS_USER_TO_SERVER = /^ghu_/;
async function auth(token) {
  const isApp = token.split(/\./).length === 3;
  const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
  const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6762:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(5030);
var beforeAfterHook = __nccwpck_require__(3682);
var request = __nccwpck_require__(6234);
var graphql = __nccwpck_require__(8467);
var authToken = __nccwpck_require__(334);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.6.0";

const _excluded = ["authStrategy"];
class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, _excluded);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(3287);
var universalUserAgent = __nccwpck_require__(5030);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.12";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 8467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(6234);
var universalUserAgent = __nccwpck_require__(5030);

const VERSION = "4.8.0";

function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:\n` + data.errors.map(e => ` - ${e.message}`).join("\n");
}

class GraphqlResponseError extends Error {
  constructor(request, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request;
    this.headers = headers;
    this.response = response;
    this.name = "GraphqlResponseError"; // Expose the errors and response data in their shorthand properties.

    this.errors = response.errors;
    this.data = response.data; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }

    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
    }
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlResponseError(requestOptions, headers, response.data);
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.GraphqlResponseError = GraphqlResponseError;
exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4193:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.21.3";

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  // endpoints can respond with 204 if repository is empty
  if (!response.data) {
    return _objectSpread2(_objectSpread2({}, response), {}, {
      data: []
    });
  }

  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };

        try {
          const response = await requestMethod({
            method,
            url,
            headers
          });
          const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: normalizedResponse
          };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

const paginatingEndpoints = ["GET /app/hook/deliveries", "GET /app/installations", "GET /applications/grants", "GET /authorizations", "GET /enterprises/{enterprise}/actions/permissions/organizations", "GET /enterprises/{enterprise}/actions/runner-groups", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners", "GET /enterprises/{enterprise}/actions/runners", "GET /enterprises/{enterprise}/audit-log", "GET /enterprises/{enterprise}/secret-scanning/alerts", "GET /enterprises/{enterprise}/settings/billing/advanced-security", "GET /events", "GET /gists", "GET /gists/public", "GET /gists/starred", "GET /gists/{gist_id}/comments", "GET /gists/{gist_id}/commits", "GET /gists/{gist_id}/forks", "GET /installation/repositories", "GET /issues", "GET /licenses", "GET /marketplace_listing/plans", "GET /marketplace_listing/plans/{plan_id}/accounts", "GET /marketplace_listing/stubbed/plans", "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", "GET /networks/{owner}/{repo}/events", "GET /notifications", "GET /organizations", "GET /orgs/{org}/actions/cache/usage-by-repository", "GET /orgs/{org}/actions/permissions/repositories", "GET /orgs/{org}/actions/runner-groups", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners", "GET /orgs/{org}/actions/runners", "GET /orgs/{org}/actions/secrets", "GET /orgs/{org}/actions/secrets/{secret_name}/repositories", "GET /orgs/{org}/audit-log", "GET /orgs/{org}/blocks", "GET /orgs/{org}/code-scanning/alerts", "GET /orgs/{org}/codespaces", "GET /orgs/{org}/credential-authorizations", "GET /orgs/{org}/dependabot/secrets", "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories", "GET /orgs/{org}/events", "GET /orgs/{org}/external-groups", "GET /orgs/{org}/failed_invitations", "GET /orgs/{org}/hooks", "GET /orgs/{org}/hooks/{hook_id}/deliveries", "GET /orgs/{org}/installations", "GET /orgs/{org}/invitations", "GET /orgs/{org}/invitations/{invitation_id}/teams", "GET /orgs/{org}/issues", "GET /orgs/{org}/members", "GET /orgs/{org}/migrations", "GET /orgs/{org}/migrations/{migration_id}/repositories", "GET /orgs/{org}/outside_collaborators", "GET /orgs/{org}/packages", "GET /orgs/{org}/packages/{package_type}/{package_name}/versions", "GET /orgs/{org}/projects", "GET /orgs/{org}/public_members", "GET /orgs/{org}/repos", "GET /orgs/{org}/secret-scanning/alerts", "GET /orgs/{org}/settings/billing/advanced-security", "GET /orgs/{org}/team-sync/groups", "GET /orgs/{org}/teams", "GET /orgs/{org}/teams/{team_slug}/discussions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/invitations", "GET /orgs/{org}/teams/{team_slug}/members", "GET /orgs/{org}/teams/{team_slug}/projects", "GET /orgs/{org}/teams/{team_slug}/repos", "GET /orgs/{org}/teams/{team_slug}/teams", "GET /projects/columns/{column_id}/cards", "GET /projects/{project_id}/collaborators", "GET /projects/{project_id}/columns", "GET /repos/{owner}/{repo}/actions/artifacts", "GET /repos/{owner}/{repo}/actions/caches", "GET /repos/{owner}/{repo}/actions/runners", "GET /repos/{owner}/{repo}/actions/runs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", "GET /repos/{owner}/{repo}/actions/secrets", "GET /repos/{owner}/{repo}/actions/workflows", "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs", "GET /repos/{owner}/{repo}/assignees", "GET /repos/{owner}/{repo}/branches", "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", "GET /repos/{owner}/{repo}/code-scanning/alerts", "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", "GET /repos/{owner}/{repo}/code-scanning/analyses", "GET /repos/{owner}/{repo}/codespaces", "GET /repos/{owner}/{repo}/codespaces/devcontainers", "GET /repos/{owner}/{repo}/codespaces/secrets", "GET /repos/{owner}/{repo}/collaborators", "GET /repos/{owner}/{repo}/comments", "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/commits", "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments", "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", "GET /repos/{owner}/{repo}/commits/{ref}/check-runs", "GET /repos/{owner}/{repo}/commits/{ref}/check-suites", "GET /repos/{owner}/{repo}/commits/{ref}/status", "GET /repos/{owner}/{repo}/commits/{ref}/statuses", "GET /repos/{owner}/{repo}/contributors", "GET /repos/{owner}/{repo}/dependabot/secrets", "GET /repos/{owner}/{repo}/deployments", "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", "GET /repos/{owner}/{repo}/environments", "GET /repos/{owner}/{repo}/events", "GET /repos/{owner}/{repo}/forks", "GET /repos/{owner}/{repo}/git/matching-refs/{ref}", "GET /repos/{owner}/{repo}/hooks", "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries", "GET /repos/{owner}/{repo}/invitations", "GET /repos/{owner}/{repo}/issues", "GET /repos/{owner}/{repo}/issues/comments", "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/issues/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", "GET /repos/{owner}/{repo}/issues/{issue_number}/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/labels", "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", "GET /repos/{owner}/{repo}/keys", "GET /repos/{owner}/{repo}/labels", "GET /repos/{owner}/{repo}/milestones", "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels", "GET /repos/{owner}/{repo}/notifications", "GET /repos/{owner}/{repo}/pages/builds", "GET /repos/{owner}/{repo}/projects", "GET /repos/{owner}/{repo}/pulls", "GET /repos/{owner}/{repo}/pulls/comments", "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", "GET /repos/{owner}/{repo}/pulls/{pull_number}/files", "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", "GET /repos/{owner}/{repo}/releases", "GET /repos/{owner}/{repo}/releases/{release_id}/assets", "GET /repos/{owner}/{repo}/releases/{release_id}/reactions", "GET /repos/{owner}/{repo}/secret-scanning/alerts", "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations", "GET /repos/{owner}/{repo}/stargazers", "GET /repos/{owner}/{repo}/subscribers", "GET /repos/{owner}/{repo}/tags", "GET /repos/{owner}/{repo}/teams", "GET /repos/{owner}/{repo}/topics", "GET /repositories", "GET /repositories/{repository_id}/environments/{environment_name}/secrets", "GET /search/code", "GET /search/commits", "GET /search/issues", "GET /search/labels", "GET /search/repositories", "GET /search/topics", "GET /search/users", "GET /teams/{team_id}/discussions", "GET /teams/{team_id}/discussions/{discussion_number}/comments", "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /teams/{team_id}/discussions/{discussion_number}/reactions", "GET /teams/{team_id}/invitations", "GET /teams/{team_id}/members", "GET /teams/{team_id}/projects", "GET /teams/{team_id}/repos", "GET /teams/{team_id}/teams", "GET /user/blocks", "GET /user/codespaces", "GET /user/codespaces/secrets", "GET /user/emails", "GET /user/followers", "GET /user/following", "GET /user/gpg_keys", "GET /user/installations", "GET /user/installations/{installation_id}/repositories", "GET /user/issues", "GET /user/keys", "GET /user/marketplace_purchases", "GET /user/marketplace_purchases/stubbed", "GET /user/memberships/orgs", "GET /user/migrations", "GET /user/migrations/{migration_id}/repositories", "GET /user/orgs", "GET /user/packages", "GET /user/packages/{package_type}/{package_name}/versions", "GET /user/public_emails", "GET /user/repos", "GET /user/repository_invitations", "GET /user/starred", "GET /user/subscriptions", "GET /user/teams", "GET /users", "GET /users/{username}/events", "GET /users/{username}/events/orgs/{org}", "GET /users/{username}/events/public", "GET /users/{username}/followers", "GET /users/{username}/following", "GET /users/{username}/gists", "GET /users/{username}/gpg_keys", "GET /users/{username}/keys", "GET /users/{username}/orgs", "GET /users/{username}/packages", "GET /users/{username}/projects", "GET /users/{username}/received_events", "GET /users/{username}/received_events/public", "GET /users/{username}/repos", "GET /users/{username}/starred", "GET /users/{username}/subscriptions"];

function isPaginatingEndpoint(arg) {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg);
  } else {
    return false;
  }
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.isPaginatingEndpoint = isPaginatingEndpoint;
exports.paginateRest = paginateRest;
exports.paginatingEndpoints = paginatingEndpoints;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 3044:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: ["POST /orgs/{org}/actions/runners/{runner_id}/labels"],
    addCustomLabelsToSelfHostedRunnerForRepo: ["POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    approveWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateEnvironmentSecret: ["PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteActionsCacheById: ["DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"],
    deleteActionsCacheByKey: ["DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteEnvironmentSecret: ["DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunAttemptLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: ["GET /orgs/{org}/actions/cache/usage-by-repository"],
    getActionsCacheUsageForEnterprise: ["GET /enterprises/{enterprise}/actions/cache/usage"],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getEnvironmentPublicKey: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"],
    getEnvironmentSecret: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    getGithubActionsDefaultWorkflowPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/workflow"],
    getGithubActionsDefaultWorkflowPermissionsOrganization: ["GET /orgs/{org}/actions/permissions/workflow"],
    getGithubActionsDefaultWorkflowPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/workflow"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getPendingDeploymentsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getReviewsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: ["GET /repos/{owner}/{repo}/actions/permissions/access"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listJobsForWorkflowRunAttempt: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"],
    listLabelsForSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}/labels"],
    listLabelsForSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: ["POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}/labels"],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],
    removeCustomLabelFromSelfHostedRunnerForOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"],
    removeCustomLabelFromSelfHostedRunnerForRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    reviewPendingDeploymentsForRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setCustomLabelsForSelfHostedRunnerForOrg: ["PUT /orgs/{org}/actions/runners/{runner_id}/labels"],
    setCustomLabelsForSelfHostedRunnerForRepo: ["PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],
    setGithubActionsDefaultWorkflowPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/workflow"],
    setGithubActionsDefaultWorkflowPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions/workflow"],
    setGithubActionsDefaultWorkflowPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/workflow"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"],
    setWorkflowAccessToRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/access"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}", {}, {
      renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"]
    }],
    addRepoToInstallationForAuthenticatedUser: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: ["POST /app/hook/deliveries/{delivery_id}/attempts"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}", {}, {
      renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"]
    }],
    removeRepoFromInstallationForAuthenticatedUser: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubAdvancedSecurityBillingGhe: ["GET /enterprises/{enterprise}/settings/billing/advanced-security"],
    getGithubAdvancedSecurityBillingOrg: ["GET /orgs/{org}/settings/billing/advanced-security"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: ["POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", {}, {
      renamed: ["codeScanning", "listAlertInstances"]
    }],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: ["PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],
    codespaceMachinesForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}/machines"],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    createOrUpdateSecretForAuthenticatedUser: ["PUT /user/codespaces/secrets/{secret_name}"],
    createWithPrForAuthenticatedUser: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"],
    createWithRepoForAuthenticatedUser: ["POST /repos/{owner}/{repo}/codespaces"],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: ["DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    deleteSecretForAuthenticatedUser: ["DELETE /user/codespaces/secrets/{secret_name}"],
    exportForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/exports"],
    getExportDetailsForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}/exports/{export_id}"],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getPublicKeyForAuthenticatedUser: ["GET /user/codespaces/secrets/public-key"],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/codespaces/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],
    getSecretForAuthenticatedUser: ["GET /user/codespaces/secrets/{secret_name}"],
    listDevcontainersInRepositoryForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces/devcontainers"],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: ["GET /orgs/{org}/codespaces", {}, {
      renamedParameters: {
        org_id: "org"
      }
    }],
    listInRepositoryForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: ["GET /user/codespaces/secrets/{secret_name}/repositories"],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    removeRepositoryForSecretForAuthenticatedUser: ["DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],
    repoMachinesForAuthenticatedUser: ["GET /repos/{owner}/{repo}/codespaces/machines"],
    setRepositoriesForSecretForAuthenticatedUser: ["PUT /user/codespaces/secrets/{secret_name}/repositories"],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: ["POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/dependabot/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/dependabot/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"]
  },
  dependencyGraph: {
    createRepositorySnapshot: ["POST /repos/{owner}/{repo}/dependency-graph/snapshots"],
    diffRange: ["GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    addCustomLabelsToSelfHostedRunnerForEnterprise: ["POST /enterprises/{enterprise}/actions/runners/{runner_id}/labels"],
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    getServerStatistics: ["GET /enterprise-installation/{enterprise_or_org}/server-statistics"],
    listLabelsForSelfHostedRunnerForEnterprise: ["GET /enterprises/{enterprise}/actions/runners/{runner_id}/labels"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    removeAllCustomLabelsFromSelfHostedRunnerForEnterprise: ["DELETE /enterprises/{enterprise}/actions/runners/{runner_id}/labels"],
    removeCustomLabelFromSelfHostedRunnerForEnterprise: ["DELETE /enterprises/{enterprise}/actions/runners/{runner_id}/labels/{name}"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setCustomLabelsForSelfHostedRunnerForEnterprise: ["PUT /enterprises/{enterprise}/actions/runners/{runner_id}/labels"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
      renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
    }],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
      renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
    }],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
      renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive"],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive"],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive"],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive"],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: ["GET /user/migrations/{migration_id}/repositories"],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {}, {
      renamed: ["migrations", "listReposForAuthenticatedUser"]
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: ["GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomRoles: ["GET /organizations/{organization_id}/custom_roles"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: ["POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageForUser: ["DELETE /users/{username}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForUser: ["DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"]
    }],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]
    }],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageForUser: ["POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForUser: ["POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
    createCard: ["POST /projects/columns/{column_id}/cards"],
    createColumn: ["POST /projects/{project_id}/columns"],
    createForAuthenticatedUser: ["POST /user/projects"],
    createForOrg: ["POST /orgs/{org}/projects"],
    createForRepo: ["POST /repos/{owner}/{repo}/projects"],
    delete: ["DELETE /projects/{project_id}"],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
    deleteColumn: ["DELETE /projects/columns/{column_id}"],
    get: ["GET /projects/{project_id}"],
    getCard: ["GET /projects/columns/cards/{card_id}"],
    getColumn: ["GET /projects/columns/{column_id}"],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission"],
    listCards: ["GET /projects/columns/{column_id}/cards"],
    listCollaborators: ["GET /projects/{project_id}/collaborators"],
    listColumns: ["GET /projects/{project_id}/columns"],
    listForOrg: ["GET /orgs/{org}/projects"],
    listForRepo: ["GET /repos/{owner}/{repo}/projects"],
    listForUser: ["GET /users/{username}/projects"],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
    moveColumn: ["POST /projects/columns/{column_id}/moves"],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}"],
    update: ["PATCH /projects/{project_id}"],
    updateCard: ["PATCH /projects/columns/cards/{card_id}"],
    updateColumn: ["PATCH /projects/columns/{column_id}"]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],
    createForRelease: ["POST /repos/{owner}/{repo}/releases/{release_id}/reactions"],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"],
    deleteForRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],
    listForRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}/reactions"],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}", {}, {
      renamed: ["repos", "acceptInvitationForAuthenticatedUser"]
    }],
    acceptInvitationForAuthenticatedUser: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts"],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: ["GET /repos/{owner}/{repo}/compare/{basehead}"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: ["PUT /repos/{owner}/{repo}/environments/{environment_name}"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createTagProtection: ["POST /repos/{owner}/{repo}/tags/protection"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate"],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}", {}, {
      renamed: ["repos", "declineInvitationForAuthenticatedUser"]
    }],
    declineInvitationForAuthenticatedUser: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteAnEnvironment: ["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteTagProtection: ["DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes"],
    disableLfsForRepo: ["DELETE /repos/{owner}/{repo}/lfs"],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts"],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes"],
    enableLfsForRepo: ["PUT /repos/{owner}/{repo}/lfs"],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts"],
    generateReleaseNotes: ["POST /repos/{owner}/{repo}/releases/generate-notes"],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getEnvironment: ["GET /repos/{owner}/{repo}/environments/{environment_name}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    getWebhookDelivery: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTagProtection: ["GET /repos/{owner}/{repo}/tags/protection"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForEnterprise: ["GET /enterprises/{enterprise}/secret-scanning/alerts"],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails", {}, {
      renamed: ["users", "addEmailForAuthenticatedUser"]
    }],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys", {}, {
      renamed: ["users", "createGpgKeyForAuthenticatedUser"]
    }],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys", {}, {
      renamed: ["users", "createPublicSshKeyForAuthenticatedUser"]
    }],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails", {}, {
      renamed: ["users", "deleteEmailForAuthenticatedUser"]
    }],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}", {}, {
      renamed: ["users", "deleteGpgKeyForAuthenticatedUser"]
    }],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}", {}, {
      renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"]
    }],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}", {}, {
      renamed: ["users", "getGpgKeyForAuthenticatedUser"]
    }],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}", {}, {
      renamed: ["users", "getPublicSshKeyForAuthenticatedUser"]
    }],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks", {}, {
      renamed: ["users", "listBlockedByAuthenticatedUser"]
    }],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails", {}, {
      renamed: ["users", "listEmailsForAuthenticatedUser"]
    }],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following", {}, {
      renamed: ["users", "listFollowedByAuthenticatedUser"]
    }],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys", {}, {
      renamed: ["users", "listGpgKeysForAuthenticatedUser"]
    }],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails", {}, {
      renamed: ["users", "listPublicEmailsForAuthenticatedUser"]
    }],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys", {}, {
      renamed: ["users", "listPublicSshKeysForAuthenticatedUser"]
    }],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility", {}, {
      renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"]
    }],
    setPrimaryEmailVisibilityForAuthenticatedUser: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "5.16.2";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit, Endpoints);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit, Endpoints);
  return _objectSpread2(_objectSpread2({}, api), {}, {
    rest: api
  });
}
legacyRestEndpointMethods.VERSION = VERSION;

exports.legacyRestEndpointMethods = legacyRestEndpointMethods;
exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(8932);
var once = _interopDefault(__nccwpck_require__(1223));

const logOnceCode = once(deprecation => console.warn(deprecation));
const logOnceHeaders = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    let headers;

    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }

    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    } // redact request credentials without mutating original request options


    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy; // deprecations

    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(new deprecation.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
        return headers || {};
      }

    });
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(9440);
var universalUserAgent = __nccwpck_require__(5030);
var isPlainObject = __nccwpck_require__(3287);
var nodeFetch = _interopDefault(__nccwpck_require__(467));
var requestError = __nccwpck_require__(537);

const VERSION = "5.6.3";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;

  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, // `requestOptions.request.agent` type is incompatible
  // see https://github.com/octokit/types.ts/pull/264
  requestOptions.request)).then(async response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if ("deprecation" in headers) {
      const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
      const deprecationLink = matches && matches.pop();
      log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        response: {
          url,
          status,
          headers,
          data: undefined
        },
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        response: {
          url,
          status,
          headers,
          data: await getResponseData(response)
        },
        request: requestOptions
      });
    }

    if (status >= 400) {
      const data = await getResponseData(response);
      const error = new requestError.RequestError(toErrorMessage(data), status, {
        response: {
          url,
          status,
          headers,
          data
        },
        request: requestOptions
      });
      throw error;
    }

    return getResponseData(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) throw error;
    throw new requestError.RequestError(error.message, 500, {
      request: requestOptions
    });
  });
}

async function getResponseData(response) {
  const contentType = response.headers.get("content-type");

  if (/application\/json/.test(contentType)) {
    return response.json();
  }

  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text();
  }

  return getBufferResponse(response);
}

function toErrorMessage(data) {
  if (typeof data === "string") return data; // istanbul ignore else - just in case

  if ("message" in data) {
    if (Array.isArray(data.errors)) {
      return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
    }

    return data.message;
  } // istanbul ignore next - just in case


  return `Unknown error: ${JSON.stringify(data)}`;
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(4670);
var addHook = __nccwpck_require__(5549);
var removeHook = __nccwpck_require__(6819);

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi(hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
  });
}

function HookSingular() {
  var singularHookName = "h";
  var singularHookState = {
    registry: {},
  };
  var singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}

function HookCollection() {
  var state = {
    registry: {},
  };

  var hook = register.bind(null, state);
  bindApi(hook, state);

  return hook;
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook() {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn(
      '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
    );
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection();
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

module.exports = Hook;
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook;
module.exports.Singular = Hook.Singular;
module.exports.Collection = Hook.Collection;


/***/ }),

/***/ 5549:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 4670:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 6819:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(900);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(4874);
}


/***/ }),

/***/ 4874:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(6224);
const util = __nccwpck_require__(3837);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(9318);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 8932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 1046:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m) return [str];

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  if (/\$$/.test(m.pre)) {    
    for (var k = 0; k < post.length; k++) {
      var expansion = pre+ '{' + m.body + '}' + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(',') >= 0;
    if (!isSequence && !isOptions) {
      // {a},b}
      if (m.post.match(/,.*\}/)) {
        str = m.pre + '{' + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }

    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // x{{a,b}}y ==> x{a}y x{b}y
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }

    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.
    var N;

    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length)
      var incr = n.length == 3
        ? Math.abs(numeric(n[2]))
        : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);

      N = [];

      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === '\\')
            c = '';
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join('0');
              if (i < 0)
                c = '-' + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];

      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand(n[j], false));
      }
    }

    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }

  return expansions;
}



/***/ }),

/***/ 1621:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 3287:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 2075:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMarkdownTable = exports.MarkdownTableError = exports.Align = void 0;
var Align;
(function (Align) {
    Align["Left"] = "left";
    Align["Right"] = "right";
    Align["Center"] = "center";
    Align["None"] = "none";
})(Align || (Align = {}));
exports.Align = Align;
class MarkdownTableError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, MarkdownTableError.prototype);
    }
}
exports.MarkdownTableError = MarkdownTableError;
const validateTable = (table) => {
    if (!table) {
        throw new MarkdownTableError('Missing \'table\' property.');
    }
    if (!(table.head instanceof Array)) {
        throw new MarkdownTableError(`Expected table.head to be Array<Column>, got ${typeof table.head}`);
    }
    if (table.head.length < 1) {
        throw new MarkdownTableError(`Expected table to have at least 1 header, got ${table.head.length}`);
    }
    if (!(table.body instanceof Array)) {
        throw new MarkdownTableError(`Expected table.body to be Array<Row>, got ${typeof table.body}`);
    }
    const allRows = [table.head, ...table.body];
    allRows.forEach((row, rowIndex) => {
        if (!(row instanceof Array)) {
            throw new MarkdownTableError(`Expected row ${rowIndex} to be Array<string>, got ${typeof row}.`);
        }
        row.forEach((column, columnIndex) => {
            if (typeof column !== 'string') {
                throw new MarkdownTableError(`Expected column ${columnIndex} on row ${rowIndex} to be string, got ${typeof column}.`);
            }
        });
    });
};
const validateAlignment = (alignment) => {
    if (!alignment) {
        return;
    }
    if (!(alignment instanceof Array)) {
        throw new MarkdownTableError(`Expected alignment to be undefined or Array<Align>, got ${typeof alignment}.`);
    }
    alignment.forEach((a, index) => {
        if (!Object.values(Align).includes(a)) {
            throw new MarkdownTableError(`Invalid alignment for column ${index}.`);
        }
    });
};
const validateGetTableInput = (params) => {
    if (!params) {
        throw new MarkdownTableError('Missing input parameters.');
    }
    validateTable(params.table);
    validateAlignment(params.alignment);
    if (typeof params.alignColumns !== 'undefined' && typeof params.alignColumns !== 'boolean') {
        throw new MarkdownTableError(`'alignColumns' must be either undefined or boolean, got ${typeof params.alignColumns}.`);
    }
};
const getMarkdownRow = (params) => {
    const alignment = params.alignment ? params.alignment : [];
    let markdownRow = '|';
    for (let i = 0; i < params.columnsAmount; i += 1) {
        const column = params.row[i] ? params.row[i] : '';
        const isRight = alignment[i] === Align.Right;
        const isCenter = alignment[i] === Align.Center;
        const targetLength = params.columnLengths ? params.columnLengths[i] : column.length;
        if (isRight) {
            markdownRow += ` ${column.padStart(targetLength)} |`;
        }
        else if (isCenter) {
            markdownRow += ` ${column.padStart((targetLength + column.length) / 2).padEnd(targetLength)} |`;
        }
        else {
            markdownRow += ` ${column.padEnd(targetLength)} |`;
        }
    }
    return markdownRow;
};
const getMarkdownAlignment = (params) => {
    const alignment = params.alignment ? params.alignment : [];
    let markdownAlignment = '|';
    for (let i = 0; i < params.columnsAmount; i += 1) {
        const isLeft = alignment[i] === Align.Left;
        const isRight = alignment[i] === Align.Right;
        const isCenter = alignment[i] === Align.Center;
        const isLeftOrCenter = isLeft || isCenter;
        const isRightOrCenter = isRight || isCenter;
        const targetLength = params.columnLengths ? params.columnLengths[i] - 2 : 1;
        markdownAlignment += isLeftOrCenter ? ' :' : ' -';
        markdownAlignment += '-'.padEnd(targetLength, '-');
        markdownAlignment += isRightOrCenter ? ': |' : '- |';
    }
    return markdownAlignment;
};
const getColumnLengths = (params) => {
    const columnLengths = new Array(params.maxColumnsAmount).fill(3);
    for (let row = 0; row < params.allRows.length; row += 1) {
        for (let column = 0; column < params.allRows[row].length; column += 1) {
            columnLengths[column] = Math.max(columnLengths[column], params.allRows[row][column].length);
        }
    }
    return columnLengths;
};
const getMarkdownTable = (params) => {
    validateGetTableInput(params);
    const headerColumns = params.table.head.length;
    const rowColumns = params.table.body.map((row) => row.length);
    const maxColumnsAmount = Math.max(headerColumns, ...rowColumns);
    const alignColumns = params.alignColumns ?? true;
    const columnLengths = alignColumns
        ? getColumnLengths({
            allRows: [params.table.head, ...params.table.body],
            maxColumnsAmount,
        })
        : undefined;
    const markdownTableHead = getMarkdownRow({
        alignment: params.alignment,
        row: params.table.head,
        columnsAmount: maxColumnsAmount,
        columnLengths,
    });
    const markdownTableAlignment = getMarkdownAlignment({
        alignment: params.alignment,
        columnsAmount: maxColumnsAmount,
        columnLengths,
    });
    let markdownTableBody = '';
    params.table.body.forEach((row) => {
        const markdownRow = getMarkdownRow({
            alignment: params.alignment,
            row,
            columnsAmount: maxColumnsAmount,
            columnLengths,
        });
        markdownTableBody += `${markdownRow}\n`;
    });
    return `${markdownTableHead}\n${markdownTableAlignment}\n${markdownTableBody}`.trimEnd();
};
exports.getMarkdownTable = getMarkdownTable;


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 467:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(2781));
var http = _interopDefault(__nccwpck_require__(3685));
var Url = _interopDefault(__nccwpck_require__(7310));
var whatwgUrl = _interopDefault(__nccwpck_require__(8665));
var https = _interopDefault(__nccwpck_require__(5687));
var zlib = _interopDefault(__nccwpck_require__(9796));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = (__nccwpck_require__(2877).convert);
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');
const URL = Url.URL || whatwgUrl.URL;

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

/**
 * Wrapper around `new URL` to handle arbitrary URLs
 *
 * @param  {string} urlStr
 * @return {void}
 */
function parseURL(urlStr) {
	/*
 	Check whether the URL is absolute or not
 		Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 	Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 */
	if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
		urlStr = new URL(urlStr).toString();
	}

	// Fallback to old implementation for arbitrary URLs
	return parse_url(urlStr);
}

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parseURL(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parseURL(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parseURL(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

const URL$1 = Url.URL || whatwgUrl.URL;

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;

const isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
	const orig = new URL$1(original).hostname;
	const dest = new URL$1(destination).hostname;

	return orig === dest || orig[orig.length - dest.length - 1] === '.' && orig.endsWith(dest);
};

/**
 * isSameProtocol reports whether the two provided URLs use the same protocol.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */
const isSameProtocol = function isSameProtocol(destination, original) {
	const orig = new URL$1(original).protocol;
	const dest = new URL$1(destination).protocol;

	return orig === dest;
};

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				destroyStream(request.body, error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));

			if (response && response.body) {
				destroyStream(response.body, err);
			}

			finalize();
		});

		fixResponseChunkedTransferBadEnding(req, function (err) {
			if (signal && signal.aborted) {
				return;
			}

			if (response && response.body) {
				destroyStream(response.body, err);
			}
		});

		/* c8 ignore next 18 */
		if (parseInt(process.version.substring(1)) < 14) {
			// Before Node.js 14, pipeline() does not fully support async iterators and does not always
			// properly handle when the socket close/end events are out of order.
			req.on('socket', function (s) {
				s.addListener('close', function (hadError) {
					// if a data listener is still present we didn't end cleanly
					const hasDataListener = s.listenerCount('data') > 0;

					// if end happened before close but the socket didn't emit an error, do it now
					if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
						const err = new Error('Premature close');
						err.code = 'ERR_STREAM_PREMATURE_CLOSE';
						response.body.emit('error', err);
					}
				});
			});
		}

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				let locationURL = null;
				try {
					locationURL = location === null ? null : new URL$1(location, request.url).toString();
				} catch (err) {
					// error here can only be invalid URL in Location: header
					// do not throw when options.redirect == manual
					// let the user extract the errorneous redirect URL
					if (request.redirect !== 'manual') {
						reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, 'invalid-redirect'));
						finalize();
						return;
					}
				}

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
							for (const name of ['authorization', 'www-authenticate', 'cookie', 'cookie2']) {
								requestOpts.headers.delete(name);
							}
						}

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				raw.on('end', function () {
					// some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
					if (!response) {
						response = new Response(body, response_options);
						resolve(response);
					}
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
	let socket;

	request.on('socket', function (s) {
		socket = s;
	});

	request.on('response', function (response) {
		const headers = response.headers;

		if (headers['transfer-encoding'] === 'chunked' && !headers['content-length']) {
			response.once('close', function (hadError) {
				// tests for socket presence, as in some situations the
				// the 'socket' event is not triggered for the request
				// (happens in deno), avoids `TypeError`
				// if a data listener is still present we didn't end cleanly
				const hasDataListener = socket && socket.listenerCount('data') > 0;

				if (hasDataListener && !hadError) {
					const err = new Error('Premature close');
					err.code = 'ERR_STREAM_PREMATURE_CLOSE';
					errorCallback(err);
				}
			});
		}
	});
}

function destroyStream(stream, err) {
	if (stream.destroy) {
		stream.destroy(err);
	} else {
		// node < 8
		stream.emit('error', err);
		stream.end();
	}
}

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;
exports.AbortError = AbortError;


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 9103:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache2) => {
  return (module2, temp) => {
    return cache2 && cache2.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache2 && cache2.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/lib/errors/git-error.ts
var GitError;
var init_git_error = __esm({
  "src/lib/errors/git-error.ts"() {
    GitError = class extends Error {
      constructor(task, message) {
        super(message);
        this.task = task;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
  }
});

// src/lib/errors/git-response-error.ts
var GitResponseError;
var init_git_response_error = __esm({
  "src/lib/errors/git-response-error.ts"() {
    init_git_error();
    GitResponseError = class extends GitError {
      constructor(git, message) {
        super(void 0, message || String(git));
        this.git = git;
      }
    };
  }
});

// src/lib/args/pathspec.ts
function pathspec(...paths) {
  const key = new String(paths);
  cache.set(key, paths);
  return key;
}
function isPathSpec(path) {
  return path instanceof String && cache.has(path);
}
function toPaths(pathSpec) {
  return cache.get(pathSpec) || [];
}
var cache;
var init_pathspec = __esm({
  "src/lib/args/pathspec.ts"() {
    cache = /* @__PURE__ */ new WeakMap();
  }
});

// src/lib/errors/git-construct-error.ts
var GitConstructError;
var init_git_construct_error = __esm({
  "src/lib/errors/git-construct-error.ts"() {
    init_git_error();
    GitConstructError = class extends GitError {
      constructor(config, message) {
        super(void 0, message);
        this.config = config;
      }
    };
  }
});

// src/lib/errors/git-plugin-error.ts
var GitPluginError;
var init_git_plugin_error = __esm({
  "src/lib/errors/git-plugin-error.ts"() {
    init_git_error();
    GitPluginError = class extends GitError {
      constructor(task, plugin, message) {
        super(task, message);
        this.task = task;
        this.plugin = plugin;
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
  }
});

// src/lib/errors/task-configuration-error.ts
var TaskConfigurationError;
var init_task_configuration_error = __esm({
  "src/lib/errors/task-configuration-error.ts"() {
    init_git_error();
    TaskConfigurationError = class extends GitError {
      constructor(message) {
        super(void 0, message);
      }
    };
  }
});

// src/lib/utils/util.ts
function asFunction(source) {
  return typeof source === "function" ? source : NOOP;
}
function isUserFunction(source) {
  return typeof source === "function" && source !== NOOP;
}
function splitOn(input, char) {
  const index = input.indexOf(char);
  if (index <= 0) {
    return [input, ""];
  }
  return [input.substr(0, index), input.substr(index + 1)];
}
function first(input, offset = 0) {
  return isArrayLike(input) && input.length > offset ? input[offset] : void 0;
}
function last(input, offset = 0) {
  if (isArrayLike(input) && input.length > offset) {
    return input[input.length - 1 - offset];
  }
}
function isArrayLike(input) {
  return !!(input && typeof input.length === "number");
}
function toLinesWithContent(input = "", trimmed2 = true, separator = "\n") {
  return input.split(separator).reduce((output, line) => {
    const lineContent = trimmed2 ? line.trim() : line;
    if (lineContent) {
      output.push(lineContent);
    }
    return output;
  }, []);
}
function forEachLineWithContent(input, callback) {
  return toLinesWithContent(input, true).map((line) => callback(line));
}
function folderExists(path) {
  return (0, import_file_exists.exists)(path, import_file_exists.FOLDER);
}
function append(target, item) {
  if (Array.isArray(target)) {
    if (!target.includes(item)) {
      target.push(item);
    }
  } else {
    target.add(item);
  }
  return item;
}
function including(target, item) {
  if (Array.isArray(target) && !target.includes(item)) {
    target.push(item);
  }
  return target;
}
function remove(target, item) {
  if (Array.isArray(target)) {
    const index = target.indexOf(item);
    if (index >= 0) {
      target.splice(index, 1);
    }
  } else {
    target.delete(item);
  }
  return item;
}
function asArray(source) {
  return Array.isArray(source) ? source : [source];
}
function asStringArray(source) {
  return asArray(source).map(String);
}
function asNumber(source, onNaN = 0) {
  if (source == null) {
    return onNaN;
  }
  const num = parseInt(source, 10);
  return isNaN(num) ? onNaN : num;
}
function prefixedArray(input, prefix) {
  const output = [];
  for (let i = 0, max = input.length; i < max; i++) {
    output.push(prefix, input[i]);
  }
  return output;
}
function bufferToString(input) {
  return (Array.isArray(input) ? Buffer.concat(input) : input).toString("utf-8");
}
function pick(source, properties) {
  return Object.assign({}, ...properties.map((property) => property in source ? { [property]: source[property] } : {}));
}
function delay(duration = 0) {
  return new Promise((done) => setTimeout(done, duration));
}
var import_file_exists, NULL, NOOP, objectToString;
var init_util = __esm({
  "src/lib/utils/util.ts"() {
    import_file_exists = __nccwpck_require__(4751);
    NULL = "\0";
    NOOP = () => {
    };
    objectToString = Object.prototype.toString.call.bind(Object.prototype.toString);
  }
});

// src/lib/utils/argument-filters.ts
function filterType(input, filter, def) {
  if (filter(input)) {
    return input;
  }
  return arguments.length > 2 ? def : void 0;
}
function filterPrimitives(input, omit) {
  const type = isPathSpec(input) ? "string" : typeof input;
  return /number|string|boolean/.test(type) && (!omit || !omit.includes(type));
}
function filterPlainObject(input) {
  return !!input && objectToString(input) === "[object Object]";
}
function filterFunction(input) {
  return typeof input === "function";
}
var filterArray, filterString, filterStringArray, filterStringOrStringArray, filterHasLength;
var init_argument_filters = __esm({
  "src/lib/utils/argument-filters.ts"() {
    init_util();
    init_pathspec();
    filterArray = (input) => {
      return Array.isArray(input);
    };
    filterString = (input) => {
      return typeof input === "string";
    };
    filterStringArray = (input) => {
      return Array.isArray(input) && input.every(filterString);
    };
    filterStringOrStringArray = (input) => {
      return filterString(input) || Array.isArray(input) && input.every(filterString);
    };
    filterHasLength = (input) => {
      if (input == null || "number|boolean|function".includes(typeof input)) {
        return false;
      }
      return Array.isArray(input) || typeof input === "string" || typeof input.length === "number";
    };
  }
});

// src/lib/utils/exit-codes.ts
var ExitCodes;
var init_exit_codes = __esm({
  "src/lib/utils/exit-codes.ts"() {
    ExitCodes = /* @__PURE__ */ ((ExitCodes2) => {
      ExitCodes2[ExitCodes2["SUCCESS"] = 0] = "SUCCESS";
      ExitCodes2[ExitCodes2["ERROR"] = 1] = "ERROR";
      ExitCodes2[ExitCodes2["NOT_FOUND"] = -2] = "NOT_FOUND";
      ExitCodes2[ExitCodes2["UNCLEAN"] = 128] = "UNCLEAN";
      return ExitCodes2;
    })(ExitCodes || {});
  }
});

// src/lib/utils/git-output-streams.ts
var GitOutputStreams;
var init_git_output_streams = __esm({
  "src/lib/utils/git-output-streams.ts"() {
    GitOutputStreams = class {
      constructor(stdOut, stdErr) {
        this.stdOut = stdOut;
        this.stdErr = stdErr;
      }
      asStrings() {
        return new GitOutputStreams(this.stdOut.toString("utf8"), this.stdErr.toString("utf8"));
      }
    };
  }
});

// src/lib/utils/line-parser.ts
var LineParser, RemoteLineParser;
var init_line_parser = __esm({
  "src/lib/utils/line-parser.ts"() {
    LineParser = class {
      constructor(regExp, useMatches) {
        this.matches = [];
        this.parse = (line, target) => {
          this.resetMatches();
          if (!this._regExp.every((reg, index) => this.addMatch(reg, index, line(index)))) {
            return false;
          }
          return this.useMatches(target, this.prepareMatches()) !== false;
        };
        this._regExp = Array.isArray(regExp) ? regExp : [regExp];
        if (useMatches) {
          this.useMatches = useMatches;
        }
      }
      useMatches(target, match) {
        throw new Error(`LineParser:useMatches not implemented`);
      }
      resetMatches() {
        this.matches.length = 0;
      }
      prepareMatches() {
        return this.matches;
      }
      addMatch(reg, index, line) {
        const matched = line && reg.exec(line);
        if (matched) {
          this.pushMatch(index, matched);
        }
        return !!matched;
      }
      pushMatch(_index, matched) {
        this.matches.push(...matched.slice(1));
      }
    };
    RemoteLineParser = class extends LineParser {
      addMatch(reg, index, line) {
        return /^remote:\s/.test(String(line)) && super.addMatch(reg, index, line);
      }
      pushMatch(index, matched) {
        if (index > 0 || matched.length > 1) {
          super.pushMatch(index, matched);
        }
      }
    };
  }
});

// src/lib/utils/simple-git-options.ts
function createInstanceConfig(...options) {
  const baseDir = process.cwd();
  const config = Object.assign(__spreadValues({ baseDir }, defaultOptions), ...options.filter((o) => typeof o === "object" && o));
  config.baseDir = config.baseDir || baseDir;
  config.trimmed = config.trimmed === true;
  return config;
}
var defaultOptions;
var init_simple_git_options = __esm({
  "src/lib/utils/simple-git-options.ts"() {
    defaultOptions = {
      binary: "git",
      maxConcurrentProcesses: 5,
      config: [],
      trimmed: false
    };
  }
});

// src/lib/utils/task-options.ts
function appendTaskOptions(options, commands = []) {
  if (!filterPlainObject(options)) {
    return commands;
  }
  return Object.keys(options).reduce((commands2, key) => {
    const value = options[key];
    if (isPathSpec(value)) {
      commands2.push(value);
    } else if (filterPrimitives(value, ["boolean"])) {
      commands2.push(key + "=" + value);
    } else {
      commands2.push(key);
    }
    return commands2;
  }, commands);
}
function getTrailingOptions(args, initialPrimitive = 0, objectOnly = false) {
  const command = [];
  for (let i = 0, max = initialPrimitive < 0 ? args.length : initialPrimitive; i < max; i++) {
    if ("string|number".includes(typeof args[i])) {
      command.push(String(args[i]));
    }
  }
  appendTaskOptions(trailingOptionsArgument(args), command);
  if (!objectOnly) {
    command.push(...trailingArrayArgument(args));
  }
  return command;
}
function trailingArrayArgument(args) {
  const hasTrailingCallback = typeof last(args) === "function";
  return filterType(last(args, hasTrailingCallback ? 1 : 0), filterArray, []);
}
function trailingOptionsArgument(args) {
  const hasTrailingCallback = filterFunction(last(args));
  return filterType(last(args, hasTrailingCallback ? 1 : 0), filterPlainObject);
}
function trailingFunctionArgument(args, includeNoop = true) {
  const callback = asFunction(last(args));
  return includeNoop || isUserFunction(callback) ? callback : void 0;
}
var init_task_options = __esm({
  "src/lib/utils/task-options.ts"() {
    init_argument_filters();
    init_util();
    init_pathspec();
  }
});

// src/lib/utils/task-parser.ts
function callTaskParser(parser3, streams) {
  return parser3(streams.stdOut, streams.stdErr);
}
function parseStringResponse(result, parsers12, texts, trim = true) {
  asArray(texts).forEach((text) => {
    for (let lines = toLinesWithContent(text, trim), i = 0, max = lines.length; i < max; i++) {
      const line = (offset = 0) => {
        if (i + offset >= max) {
          return;
        }
        return lines[i + offset];
      };
      parsers12.some(({ parse }) => parse(line, result));
    }
  });
  return result;
}
var init_task_parser = __esm({
  "src/lib/utils/task-parser.ts"() {
    init_util();
  }
});

// src/lib/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  ExitCodes: () => ExitCodes,
  GitOutputStreams: () => GitOutputStreams,
  LineParser: () => LineParser,
  NOOP: () => NOOP,
  NULL: () => NULL,
  RemoteLineParser: () => RemoteLineParser,
  append: () => append,
  appendTaskOptions: () => appendTaskOptions,
  asArray: () => asArray,
  asFunction: () => asFunction,
  asNumber: () => asNumber,
  asStringArray: () => asStringArray,
  bufferToString: () => bufferToString,
  callTaskParser: () => callTaskParser,
  createInstanceConfig: () => createInstanceConfig,
  delay: () => delay,
  filterArray: () => filterArray,
  filterFunction: () => filterFunction,
  filterHasLength: () => filterHasLength,
  filterPlainObject: () => filterPlainObject,
  filterPrimitives: () => filterPrimitives,
  filterString: () => filterString,
  filterStringArray: () => filterStringArray,
  filterStringOrStringArray: () => filterStringOrStringArray,
  filterType: () => filterType,
  first: () => first,
  folderExists: () => folderExists,
  forEachLineWithContent: () => forEachLineWithContent,
  getTrailingOptions: () => getTrailingOptions,
  including: () => including,
  isUserFunction: () => isUserFunction,
  last: () => last,
  objectToString: () => objectToString,
  parseStringResponse: () => parseStringResponse,
  pick: () => pick,
  prefixedArray: () => prefixedArray,
  remove: () => remove,
  splitOn: () => splitOn,
  toLinesWithContent: () => toLinesWithContent,
  trailingFunctionArgument: () => trailingFunctionArgument,
  trailingOptionsArgument: () => trailingOptionsArgument
});
var init_utils = __esm({
  "src/lib/utils/index.ts"() {
    init_argument_filters();
    init_exit_codes();
    init_git_output_streams();
    init_line_parser();
    init_simple_git_options();
    init_task_options();
    init_task_parser();
    init_util();
  }
});

// src/lib/tasks/check-is-repo.ts
var check_is_repo_exports = {};
__export(check_is_repo_exports, {
  CheckRepoActions: () => CheckRepoActions,
  checkIsBareRepoTask: () => checkIsBareRepoTask,
  checkIsRepoRootTask: () => checkIsRepoRootTask,
  checkIsRepoTask: () => checkIsRepoTask
});
function checkIsRepoTask(action) {
  switch (action) {
    case "bare" /* BARE */:
      return checkIsBareRepoTask();
    case "root" /* IS_REPO_ROOT */:
      return checkIsRepoRootTask();
  }
  const commands = ["rev-parse", "--is-inside-work-tree"];
  return {
    commands,
    format: "utf-8",
    onError,
    parser
  };
}
function checkIsRepoRootTask() {
  const commands = ["rev-parse", "--git-dir"];
  return {
    commands,
    format: "utf-8",
    onError,
    parser(path) {
      return /^\.(git)?$/.test(path.trim());
    }
  };
}
function checkIsBareRepoTask() {
  const commands = ["rev-parse", "--is-bare-repository"];
  return {
    commands,
    format: "utf-8",
    onError,
    parser
  };
}
function isNotRepoMessage(error) {
  return /(Not a git repository|Kein Git-Repository)/i.test(String(error));
}
var CheckRepoActions, onError, parser;
var init_check_is_repo = __esm({
  "src/lib/tasks/check-is-repo.ts"() {
    init_utils();
    CheckRepoActions = /* @__PURE__ */ ((CheckRepoActions2) => {
      CheckRepoActions2["BARE"] = "bare";
      CheckRepoActions2["IN_TREE"] = "tree";
      CheckRepoActions2["IS_REPO_ROOT"] = "root";
      return CheckRepoActions2;
    })(CheckRepoActions || {});
    onError = ({ exitCode }, error, done, fail) => {
      if (exitCode === 128 /* UNCLEAN */ && isNotRepoMessage(error)) {
        return done(Buffer.from("false"));
      }
      fail(error);
    };
    parser = (text) => {
      return text.trim() === "true";
    };
  }
});

// src/lib/responses/CleanSummary.ts
function cleanSummaryParser(dryRun, text) {
  const summary = new CleanResponse(dryRun);
  const regexp = dryRun ? dryRunRemovalRegexp : removalRegexp;
  toLinesWithContent(text).forEach((line) => {
    const removed = line.replace(regexp, "");
    summary.paths.push(removed);
    (isFolderRegexp.test(removed) ? summary.folders : summary.files).push(removed);
  });
  return summary;
}
var CleanResponse, removalRegexp, dryRunRemovalRegexp, isFolderRegexp;
var init_CleanSummary = __esm({
  "src/lib/responses/CleanSummary.ts"() {
    init_utils();
    CleanResponse = class {
      constructor(dryRun) {
        this.dryRun = dryRun;
        this.paths = [];
        this.files = [];
        this.folders = [];
      }
    };
    removalRegexp = /^[a-z]+\s*/i;
    dryRunRemovalRegexp = /^[a-z]+\s+[a-z]+\s*/i;
    isFolderRegexp = /\/$/;
  }
});

// src/lib/tasks/task.ts
var task_exports = {};
__export(task_exports, {
  EMPTY_COMMANDS: () => EMPTY_COMMANDS,
  adhocExecTask: () => adhocExecTask,
  configurationErrorTask: () => configurationErrorTask,
  isBufferTask: () => isBufferTask,
  isEmptyTask: () => isEmptyTask,
  straightThroughBufferTask: () => straightThroughBufferTask,
  straightThroughStringTask: () => straightThroughStringTask
});
function adhocExecTask(parser3) {
  return {
    commands: EMPTY_COMMANDS,
    format: "empty",
    parser: parser3
  };
}
function configurationErrorTask(error) {
  return {
    commands: EMPTY_COMMANDS,
    format: "empty",
    parser() {
      throw typeof error === "string" ? new TaskConfigurationError(error) : error;
    }
  };
}
function straightThroughStringTask(commands, trimmed2 = false) {
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return trimmed2 ? String(text).trim() : text;
    }
  };
}
function straightThroughBufferTask(commands) {
  return {
    commands,
    format: "buffer",
    parser(buffer) {
      return buffer;
    }
  };
}
function isBufferTask(task) {
  return task.format === "buffer";
}
function isEmptyTask(task) {
  return task.format === "empty" || !task.commands.length;
}
var EMPTY_COMMANDS;
var init_task = __esm({
  "src/lib/tasks/task.ts"() {
    init_task_configuration_error();
    EMPTY_COMMANDS = [];
  }
});

// src/lib/tasks/clean.ts
var clean_exports = {};
__export(clean_exports, {
  CONFIG_ERROR_INTERACTIVE_MODE: () => CONFIG_ERROR_INTERACTIVE_MODE,
  CONFIG_ERROR_MODE_REQUIRED: () => CONFIG_ERROR_MODE_REQUIRED,
  CONFIG_ERROR_UNKNOWN_OPTION: () => CONFIG_ERROR_UNKNOWN_OPTION,
  CleanOptions: () => CleanOptions,
  cleanTask: () => cleanTask,
  cleanWithOptionsTask: () => cleanWithOptionsTask,
  isCleanOptionsArray: () => isCleanOptionsArray
});
function cleanWithOptionsTask(mode, customArgs) {
  const { cleanMode, options, valid } = getCleanOptions(mode);
  if (!cleanMode) {
    return configurationErrorTask(CONFIG_ERROR_MODE_REQUIRED);
  }
  if (!valid.options) {
    return configurationErrorTask(CONFIG_ERROR_UNKNOWN_OPTION + JSON.stringify(mode));
  }
  options.push(...customArgs);
  if (options.some(isInteractiveMode)) {
    return configurationErrorTask(CONFIG_ERROR_INTERACTIVE_MODE);
  }
  return cleanTask(cleanMode, options);
}
function cleanTask(mode, customArgs) {
  const commands = ["clean", `-${mode}`, ...customArgs];
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return cleanSummaryParser(mode === "n" /* DRY_RUN */, text);
    }
  };
}
function isCleanOptionsArray(input) {
  return Array.isArray(input) && input.every((test) => CleanOptionValues.has(test));
}
function getCleanOptions(input) {
  let cleanMode;
  let options = [];
  let valid = { cleanMode: false, options: true };
  input.replace(/[^a-z]i/g, "").split("").forEach((char) => {
    if (isCleanMode(char)) {
      cleanMode = char;
      valid.cleanMode = true;
    } else {
      valid.options = valid.options && isKnownOption(options[options.length] = `-${char}`);
    }
  });
  return {
    cleanMode,
    options,
    valid
  };
}
function isCleanMode(cleanMode) {
  return cleanMode === "f" /* FORCE */ || cleanMode === "n" /* DRY_RUN */;
}
function isKnownOption(option) {
  return /^-[a-z]$/i.test(option) && CleanOptionValues.has(option.charAt(1));
}
function isInteractiveMode(option) {
  if (/^-[^\-]/.test(option)) {
    return option.indexOf("i") > 0;
  }
  return option === "--interactive";
}
var CONFIG_ERROR_INTERACTIVE_MODE, CONFIG_ERROR_MODE_REQUIRED, CONFIG_ERROR_UNKNOWN_OPTION, CleanOptions, CleanOptionValues;
var init_clean = __esm({
  "src/lib/tasks/clean.ts"() {
    init_CleanSummary();
    init_utils();
    init_task();
    CONFIG_ERROR_INTERACTIVE_MODE = "Git clean interactive mode is not supported";
    CONFIG_ERROR_MODE_REQUIRED = 'Git clean mode parameter ("n" or "f") is required';
    CONFIG_ERROR_UNKNOWN_OPTION = "Git clean unknown option found in: ";
    CleanOptions = /* @__PURE__ */ ((CleanOptions2) => {
      CleanOptions2["DRY_RUN"] = "n";
      CleanOptions2["FORCE"] = "f";
      CleanOptions2["IGNORED_INCLUDED"] = "x";
      CleanOptions2["IGNORED_ONLY"] = "X";
      CleanOptions2["EXCLUDING"] = "e";
      CleanOptions2["QUIET"] = "q";
      CleanOptions2["RECURSIVE"] = "d";
      return CleanOptions2;
    })(CleanOptions || {});
    CleanOptionValues = /* @__PURE__ */ new Set([
      "i",
      ...asStringArray(Object.values(CleanOptions))
    ]);
  }
});

// src/lib/responses/ConfigList.ts
function configListParser(text) {
  const config = new ConfigList();
  for (const item of configParser(text)) {
    config.addValue(item.file, String(item.key), item.value);
  }
  return config;
}
function configGetParser(text, key) {
  let value = null;
  const values = [];
  const scopes = /* @__PURE__ */ new Map();
  for (const item of configParser(text, key)) {
    if (item.key !== key) {
      continue;
    }
    values.push(value = item.value);
    if (!scopes.has(item.file)) {
      scopes.set(item.file, []);
    }
    scopes.get(item.file).push(value);
  }
  return {
    key,
    paths: Array.from(scopes.keys()),
    scopes,
    value,
    values
  };
}
function configFilePath(filePath) {
  return filePath.replace(/^(file):/, "");
}
function* configParser(text, requestedKey = null) {
  const lines = text.split("\0");
  for (let i = 0, max = lines.length - 1; i < max; ) {
    const file = configFilePath(lines[i++]);
    let value = lines[i++];
    let key = requestedKey;
    if (value.includes("\n")) {
      const line = splitOn(value, "\n");
      key = line[0];
      value = line[1];
    }
    yield { file, key, value };
  }
}
var ConfigList;
var init_ConfigList = __esm({
  "src/lib/responses/ConfigList.ts"() {
    init_utils();
    ConfigList = class {
      constructor() {
        this.files = [];
        this.values = /* @__PURE__ */ Object.create(null);
      }
      get all() {
        if (!this._all) {
          this._all = this.files.reduce((all, file) => {
            return Object.assign(all, this.values[file]);
          }, {});
        }
        return this._all;
      }
      addFile(file) {
        if (!(file in this.values)) {
          const latest = last(this.files);
          this.values[file] = latest ? Object.create(this.values[latest]) : {};
          this.files.push(file);
        }
        return this.values[file];
      }
      addValue(file, key, value) {
        const values = this.addFile(file);
        if (!values.hasOwnProperty(key)) {
          values[key] = value;
        } else if (Array.isArray(values[key])) {
          values[key].push(value);
        } else {
          values[key] = [values[key], value];
        }
        this._all = void 0;
      }
    };
  }
});

// src/lib/tasks/config.ts
function asConfigScope(scope, fallback) {
  if (typeof scope === "string" && GitConfigScope.hasOwnProperty(scope)) {
    return scope;
  }
  return fallback;
}
function addConfigTask(key, value, append2, scope) {
  const commands = ["config", `--${scope}`];
  if (append2) {
    commands.push("--add");
  }
  commands.push(key, value);
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return text;
    }
  };
}
function getConfigTask(key, scope) {
  const commands = ["config", "--null", "--show-origin", "--get-all", key];
  if (scope) {
    commands.splice(1, 0, `--${scope}`);
  }
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return configGetParser(text, key);
    }
  };
}
function listConfigTask(scope) {
  const commands = ["config", "--list", "--show-origin", "--null"];
  if (scope) {
    commands.push(`--${scope}`);
  }
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return configListParser(text);
    }
  };
}
function config_default() {
  return {
    addConfig(key, value, ...rest) {
      return this._runTask(addConfigTask(key, value, rest[0] === true, asConfigScope(rest[1], "local" /* local */)), trailingFunctionArgument(arguments));
    },
    getConfig(key, scope) {
      return this._runTask(getConfigTask(key, asConfigScope(scope, void 0)), trailingFunctionArgument(arguments));
    },
    listConfig(...rest) {
      return this._runTask(listConfigTask(asConfigScope(rest[0], void 0)), trailingFunctionArgument(arguments));
    }
  };
}
var GitConfigScope;
var init_config = __esm({
  "src/lib/tasks/config.ts"() {
    init_ConfigList();
    init_utils();
    GitConfigScope = /* @__PURE__ */ ((GitConfigScope2) => {
      GitConfigScope2["system"] = "system";
      GitConfigScope2["global"] = "global";
      GitConfigScope2["local"] = "local";
      GitConfigScope2["worktree"] = "worktree";
      return GitConfigScope2;
    })(GitConfigScope || {});
  }
});

// src/lib/tasks/grep.ts
function grepQueryBuilder(...params) {
  return new GrepQuery().param(...params);
}
function parseGrep(grep) {
  const paths = /* @__PURE__ */ new Set();
  const results = {};
  forEachLineWithContent(grep, (input) => {
    const [path, line, preview] = input.split(NULL);
    paths.add(path);
    (results[path] = results[path] || []).push({
      line: asNumber(line),
      path,
      preview
    });
  });
  return {
    paths,
    results
  };
}
function grep_default() {
  return {
    grep(searchTerm) {
      const then = trailingFunctionArgument(arguments);
      const options = getTrailingOptions(arguments);
      for (const option of disallowedOptions) {
        if (options.includes(option)) {
          return this._runTask(configurationErrorTask(`git.grep: use of "${option}" is not supported.`), then);
        }
      }
      if (typeof searchTerm === "string") {
        searchTerm = grepQueryBuilder().param(searchTerm);
      }
      const commands = ["grep", "--null", "-n", "--full-name", ...options, ...searchTerm];
      return this._runTask({
        commands,
        format: "utf-8",
        parser(stdOut) {
          return parseGrep(stdOut);
        }
      }, then);
    }
  };
}
var disallowedOptions, Query, _a, GrepQuery;
var init_grep = __esm({
  "src/lib/tasks/grep.ts"() {
    init_utils();
    init_task();
    disallowedOptions = ["-h"];
    Query = Symbol("grepQuery");
    GrepQuery = class {
      constructor() {
        this[_a] = [];
      }
      *[(_a = Query, Symbol.iterator)]() {
        for (const query of this[Query]) {
          yield query;
        }
      }
      and(...and) {
        and.length && this[Query].push("--and", "(", ...prefixedArray(and, "-e"), ")");
        return this;
      }
      param(...param) {
        this[Query].push(...prefixedArray(param, "-e"));
        return this;
      }
    };
  }
});

// src/lib/tasks/reset.ts
var reset_exports = {};
__export(reset_exports, {
  ResetMode: () => ResetMode,
  getResetMode: () => getResetMode,
  resetTask: () => resetTask
});
function resetTask(mode, customArgs) {
  const commands = ["reset"];
  if (isValidResetMode(mode)) {
    commands.push(`--${mode}`);
  }
  commands.push(...customArgs);
  return straightThroughStringTask(commands);
}
function getResetMode(mode) {
  if (isValidResetMode(mode)) {
    return mode;
  }
  switch (typeof mode) {
    case "string":
    case "undefined":
      return "soft" /* SOFT */;
  }
  return;
}
function isValidResetMode(mode) {
  return ResetModes.includes(mode);
}
var ResetMode, ResetModes;
var init_reset = __esm({
  "src/lib/tasks/reset.ts"() {
    init_task();
    ResetMode = /* @__PURE__ */ ((ResetMode2) => {
      ResetMode2["MIXED"] = "mixed";
      ResetMode2["SOFT"] = "soft";
      ResetMode2["HARD"] = "hard";
      ResetMode2["MERGE"] = "merge";
      ResetMode2["KEEP"] = "keep";
      return ResetMode2;
    })(ResetMode || {});
    ResetModes = Array.from(Object.values(ResetMode));
  }
});

// src/lib/api.ts
var api_exports = {};
__export(api_exports, {
  CheckRepoActions: () => CheckRepoActions,
  CleanOptions: () => CleanOptions,
  GitConfigScope: () => GitConfigScope,
  GitConstructError: () => GitConstructError,
  GitError: () => GitError,
  GitPluginError: () => GitPluginError,
  GitResponseError: () => GitResponseError,
  ResetMode: () => ResetMode,
  TaskConfigurationError: () => TaskConfigurationError,
  grepQueryBuilder: () => grepQueryBuilder,
  pathspec: () => pathspec
});
var init_api = __esm({
  "src/lib/api.ts"() {
    init_pathspec();
    init_git_construct_error();
    init_git_error();
    init_git_plugin_error();
    init_git_response_error();
    init_task_configuration_error();
    init_check_is_repo();
    init_clean();
    init_config();
    init_grep();
    init_reset();
  }
});

// src/lib/plugins/abort-plugin.ts
function abortPlugin(signal) {
  if (!signal) {
    return;
  }
  const onSpawnAfter = {
    type: "spawn.after",
    action(_data, context) {
      function kill() {
        context.kill(new GitPluginError(void 0, "abort", "Abort signal received"));
      }
      signal.addEventListener("abort", kill);
      context.spawned.on("close", () => signal.removeEventListener("abort", kill));
    }
  };
  const onSpawnBefore = {
    type: "spawn.before",
    action(_data, context) {
      if (signal.aborted) {
        context.kill(new GitPluginError(void 0, "abort", "Abort already signaled"));
      }
    }
  };
  return [onSpawnBefore, onSpawnAfter];
}
var init_abort_plugin = __esm({
  "src/lib/plugins/abort-plugin.ts"() {
    init_git_plugin_error();
  }
});

// src/lib/plugins/block-unsafe-operations-plugin.ts
function isConfigSwitch(arg) {
  return typeof arg === "string" && arg.trim().toLowerCase() === "-c";
}
function preventProtocolOverride(arg, next) {
  if (!isConfigSwitch(arg)) {
    return;
  }
  if (!/^\s*protocol(.[a-z]+)?.allow/.test(next)) {
    return;
  }
  throw new GitPluginError(void 0, "unsafe", "Configuring protocol.allow is not permitted without enabling allowUnsafeExtProtocol");
}
function preventUploadPack(arg, method) {
  if (/^\s*--(upload|receive)-pack/.test(arg)) {
    throw new GitPluginError(void 0, "unsafe", `Use of --upload-pack or --receive-pack is not permitted without enabling allowUnsafePack`);
  }
  if (method === "clone" && /^\s*-u\b/.test(arg)) {
    throw new GitPluginError(void 0, "unsafe", `Use of clone with option -u is not permitted without enabling allowUnsafePack`);
  }
  if (method === "push" && /^\s*--exec\b/.test(arg)) {
    throw new GitPluginError(void 0, "unsafe", `Use of push with option --exec is not permitted without enabling allowUnsafePack`);
  }
}
function blockUnsafeOperationsPlugin({
  allowUnsafeProtocolOverride = false,
  allowUnsafePack = false
} = {}) {
  return {
    type: "spawn.args",
    action(args, context) {
      args.forEach((current, index) => {
        const next = index < args.length ? args[index + 1] : "";
        allowUnsafeProtocolOverride || preventProtocolOverride(current, next);
        allowUnsafePack || preventUploadPack(current, context.method);
      });
      return args;
    }
  };
}
var init_block_unsafe_operations_plugin = __esm({
  "src/lib/plugins/block-unsafe-operations-plugin.ts"() {
    init_git_plugin_error();
  }
});

// src/lib/plugins/command-config-prefixing-plugin.ts
function commandConfigPrefixingPlugin(configuration) {
  const prefix = prefixedArray(configuration, "-c");
  return {
    type: "spawn.args",
    action(data) {
      return [...prefix, ...data];
    }
  };
}
var init_command_config_prefixing_plugin = __esm({
  "src/lib/plugins/command-config-prefixing-plugin.ts"() {
    init_utils();
  }
});

// src/lib/plugins/completion-detection.plugin.ts
function completionDetectionPlugin({
  onClose = true,
  onExit = 50
} = {}) {
  function createEvents() {
    let exitCode = -1;
    const events = {
      close: (0, import_promise_deferred.deferred)(),
      closeTimeout: (0, import_promise_deferred.deferred)(),
      exit: (0, import_promise_deferred.deferred)(),
      exitTimeout: (0, import_promise_deferred.deferred)()
    };
    const result = Promise.race([
      onClose === false ? never : events.closeTimeout.promise,
      onExit === false ? never : events.exitTimeout.promise
    ]);
    configureTimeout(onClose, events.close, events.closeTimeout);
    configureTimeout(onExit, events.exit, events.exitTimeout);
    return {
      close(code) {
        exitCode = code;
        events.close.done();
      },
      exit(code) {
        exitCode = code;
        events.exit.done();
      },
      get exitCode() {
        return exitCode;
      },
      result
    };
  }
  function configureTimeout(flag, event, timeout) {
    if (flag === false) {
      return;
    }
    (flag === true ? event.promise : event.promise.then(() => delay(flag))).then(timeout.done);
  }
  return {
    type: "spawn.after",
    action(_0, _1) {
      return __async(this, arguments, function* (_data, { spawned, close }) {
        var _a2, _b;
        const events = createEvents();
        let deferClose = true;
        let quickClose = () => void (deferClose = false);
        (_a2 = spawned.stdout) == null ? void 0 : _a2.on("data", quickClose);
        (_b = spawned.stderr) == null ? void 0 : _b.on("data", quickClose);
        spawned.on("error", quickClose);
        spawned.on("close", (code) => events.close(code));
        spawned.on("exit", (code) => events.exit(code));
        try {
          yield events.result;
          if (deferClose) {
            yield delay(50);
          }
          close(events.exitCode);
        } catch (err) {
          close(events.exitCode, err);
        }
      });
    }
  };
}
var import_promise_deferred, never;
var init_completion_detection_plugin = __esm({
  "src/lib/plugins/completion-detection.plugin.ts"() {
    import_promise_deferred = __nccwpck_require__(9819);
    init_utils();
    never = (0, import_promise_deferred.deferred)().promise;
  }
});

// src/lib/plugins/error-detection.plugin.ts
function isTaskError(result) {
  return !!(result.exitCode && result.stdErr.length);
}
function getErrorMessage(result) {
  return Buffer.concat([...result.stdOut, ...result.stdErr]);
}
function errorDetectionHandler(overwrite = false, isError = isTaskError, errorMessage = getErrorMessage) {
  return (error, result) => {
    if (!overwrite && error || !isError(result)) {
      return error;
    }
    return errorMessage(result);
  };
}
function errorDetectionPlugin(config) {
  return {
    type: "task.error",
    action(data, context) {
      const error = config(data.error, {
        stdErr: context.stdErr,
        stdOut: context.stdOut,
        exitCode: context.exitCode
      });
      if (Buffer.isBuffer(error)) {
        return { error: new GitError(void 0, error.toString("utf-8")) };
      }
      return {
        error
      };
    }
  };
}
var init_error_detection_plugin = __esm({
  "src/lib/plugins/error-detection.plugin.ts"() {
    init_git_error();
  }
});

// src/lib/plugins/plugin-store.ts
var PluginStore;
var init_plugin_store = __esm({
  "src/lib/plugins/plugin-store.ts"() {
    init_utils();
    PluginStore = class {
      constructor() {
        this.plugins = /* @__PURE__ */ new Set();
      }
      add(plugin) {
        const plugins = [];
        asArray(plugin).forEach((plugin2) => plugin2 && this.plugins.add(append(plugins, plugin2)));
        return () => {
          plugins.forEach((plugin2) => this.plugins.delete(plugin2));
        };
      }
      exec(type, data, context) {
        let output = data;
        const contextual = Object.freeze(Object.create(context));
        for (const plugin of this.plugins) {
          if (plugin.type === type) {
            output = plugin.action(output, contextual);
          }
        }
        return output;
      }
    };
  }
});

// src/lib/plugins/progress-monitor-plugin.ts
function progressMonitorPlugin(progress) {
  const progressCommand = "--progress";
  const progressMethods = ["checkout", "clone", "fetch", "pull", "push"];
  const onProgress = {
    type: "spawn.after",
    action(_data, context) {
      var _a2;
      if (!context.commands.includes(progressCommand)) {
        return;
      }
      (_a2 = context.spawned.stderr) == null ? void 0 : _a2.on("data", (chunk) => {
        const message = /^([\s\S]+?):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(chunk.toString("utf8"));
        if (!message) {
          return;
        }
        progress({
          method: context.method,
          stage: progressEventStage(message[1]),
          progress: asNumber(message[2]),
          processed: asNumber(message[3]),
          total: asNumber(message[4])
        });
      });
    }
  };
  const onArgs = {
    type: "spawn.args",
    action(args, context) {
      if (!progressMethods.includes(context.method)) {
        return args;
      }
      return including(args, progressCommand);
    }
  };
  return [onArgs, onProgress];
}
function progressEventStage(input) {
  return String(input.toLowerCase().split(" ", 1)) || "unknown";
}
var init_progress_monitor_plugin = __esm({
  "src/lib/plugins/progress-monitor-plugin.ts"() {
    init_utils();
  }
});

// src/lib/plugins/simple-git-plugin.ts
var init_simple_git_plugin = __esm({
  "src/lib/plugins/simple-git-plugin.ts"() {
  }
});

// src/lib/plugins/spawn-options-plugin.ts
function spawnOptionsPlugin(spawnOptions) {
  const options = pick(spawnOptions, ["uid", "gid"]);
  return {
    type: "spawn.options",
    action(data) {
      return __spreadValues(__spreadValues({}, options), data);
    }
  };
}
var init_spawn_options_plugin = __esm({
  "src/lib/plugins/spawn-options-plugin.ts"() {
    init_utils();
  }
});

// src/lib/plugins/timout-plugin.ts
function timeoutPlugin({
  block,
  stdErr = true,
  stdOut = true
}) {
  if (block > 0) {
    return {
      type: "spawn.after",
      action(_data, context) {
        var _a2, _b;
        let timeout;
        function wait() {
          timeout && clearTimeout(timeout);
          timeout = setTimeout(kill, block);
        }
        function stop() {
          var _a3, _b2;
          (_a3 = context.spawned.stdout) == null ? void 0 : _a3.off("data", wait);
          (_b2 = context.spawned.stderr) == null ? void 0 : _b2.off("data", wait);
          context.spawned.off("exit", stop);
          context.spawned.off("close", stop);
          timeout && clearTimeout(timeout);
        }
        function kill() {
          stop();
          context.kill(new GitPluginError(void 0, "timeout", `block timeout reached`));
        }
        stdOut && ((_a2 = context.spawned.stdout) == null ? void 0 : _a2.on("data", wait));
        stdErr && ((_b = context.spawned.stderr) == null ? void 0 : _b.on("data", wait));
        context.spawned.on("exit", stop);
        context.spawned.on("close", stop);
        wait();
      }
    };
  }
}
var init_timout_plugin = __esm({
  "src/lib/plugins/timout-plugin.ts"() {
    init_git_plugin_error();
  }
});

// src/lib/plugins/index.ts
var init_plugins = __esm({
  "src/lib/plugins/index.ts"() {
    init_abort_plugin();
    init_block_unsafe_operations_plugin();
    init_command_config_prefixing_plugin();
    init_completion_detection_plugin();
    init_error_detection_plugin();
    init_plugin_store();
    init_progress_monitor_plugin();
    init_simple_git_plugin();
    init_spawn_options_plugin();
    init_timout_plugin();
  }
});

// src/lib/plugins/suffix-paths.plugin.ts
function suffixPathsPlugin() {
  return {
    type: "spawn.args",
    action(data) {
      const prefix = [];
      let suffix;
      function append2(args) {
        (suffix = suffix || []).push(...args);
      }
      for (let i = 0; i < data.length; i++) {
        const param = data[i];
        if (isPathSpec(param)) {
          append2(toPaths(param));
          continue;
        }
        if (param === "--") {
          append2(data.slice(i + 1).flatMap((item) => isPathSpec(item) && toPaths(item) || item));
          break;
        }
        prefix.push(param);
      }
      return !suffix ? prefix : [...prefix, "--", ...suffix.map(String)];
    }
  };
}
var init_suffix_paths_plugin = __esm({
  "src/lib/plugins/suffix-paths.plugin.ts"() {
    init_pathspec();
  }
});

// src/lib/git-logger.ts
function createLog() {
  return (0, import_debug.default)("simple-git");
}
function prefixedLogger(to, prefix, forward) {
  if (!prefix || !String(prefix).replace(/\s*/, "")) {
    return !forward ? to : (message, ...args) => {
      to(message, ...args);
      forward(message, ...args);
    };
  }
  return (message, ...args) => {
    to(`%s ${message}`, prefix, ...args);
    if (forward) {
      forward(message, ...args);
    }
  };
}
function childLoggerName(name, childDebugger, { namespace: parentNamespace }) {
  if (typeof name === "string") {
    return name;
  }
  const childNamespace = childDebugger && childDebugger.namespace || "";
  if (childNamespace.startsWith(parentNamespace)) {
    return childNamespace.substr(parentNamespace.length + 1);
  }
  return childNamespace || parentNamespace;
}
function createLogger(label, verbose, initialStep, infoDebugger = createLog()) {
  const labelPrefix = label && `[${label}]` || "";
  const spawned = [];
  const debugDebugger = typeof verbose === "string" ? infoDebugger.extend(verbose) : verbose;
  const key = childLoggerName(filterType(verbose, filterString), debugDebugger, infoDebugger);
  return step(initialStep);
  function sibling(name, initial) {
    return append(spawned, createLogger(label, key.replace(/^[^:]+/, name), initial, infoDebugger));
  }
  function step(phase) {
    const stepPrefix = phase && `[${phase}]` || "";
    const debug2 = debugDebugger && prefixedLogger(debugDebugger, stepPrefix) || NOOP;
    const info = prefixedLogger(infoDebugger, `${labelPrefix} ${stepPrefix}`, debug2);
    return Object.assign(debugDebugger ? debug2 : info, {
      label,
      sibling,
      info,
      step
    });
  }
}
var import_debug;
var init_git_logger = __esm({
  "src/lib/git-logger.ts"() {
    import_debug = __toESM(__nccwpck_require__(8237));
    init_utils();
    import_debug.default.formatters.L = (value) => String(filterHasLength(value) ? value.length : "-");
    import_debug.default.formatters.B = (value) => {
      if (Buffer.isBuffer(value)) {
        return value.toString("utf8");
      }
      return objectToString(value);
    };
  }
});

// src/lib/runners/tasks-pending-queue.ts
var _TasksPendingQueue, TasksPendingQueue;
var init_tasks_pending_queue = __esm({
  "src/lib/runners/tasks-pending-queue.ts"() {
    init_git_error();
    init_git_logger();
    _TasksPendingQueue = class {
      constructor(logLabel = "GitExecutor") {
        this.logLabel = logLabel;
        this._queue = /* @__PURE__ */ new Map();
      }
      withProgress(task) {
        return this._queue.get(task);
      }
      createProgress(task) {
        const name = _TasksPendingQueue.getName(task.commands[0]);
        const logger = createLogger(this.logLabel, name);
        return {
          task,
          logger,
          name
        };
      }
      push(task) {
        const progress = this.createProgress(task);
        progress.logger("Adding task to the queue, commands = %o", task.commands);
        this._queue.set(task, progress);
        return progress;
      }
      fatal(err) {
        for (const [task, { logger }] of Array.from(this._queue.entries())) {
          if (task === err.task) {
            logger.info(`Failed %o`, err);
            logger(`Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`);
          } else {
            logger.info(`A fatal exception occurred in a previous task, the queue has been purged: %o`, err.message);
          }
          this.complete(task);
        }
        if (this._queue.size !== 0) {
          throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
        }
      }
      complete(task) {
        const progress = this.withProgress(task);
        if (progress) {
          this._queue.delete(task);
        }
      }
      attempt(task) {
        const progress = this.withProgress(task);
        if (!progress) {
          throw new GitError(void 0, "TasksPendingQueue: attempt called for an unknown task");
        }
        progress.logger("Starting task");
        return progress;
      }
      static getName(name = "empty") {
        return `task:${name}:${++_TasksPendingQueue.counter}`;
      }
    };
    TasksPendingQueue = _TasksPendingQueue;
    TasksPendingQueue.counter = 0;
  }
});

// src/lib/runners/git-executor-chain.ts
function pluginContext(task, commands) {
  return {
    method: first(task.commands) || "",
    commands
  };
}
function onErrorReceived(target, logger) {
  return (err) => {
    logger(`[ERROR] child process exception %o`, err);
    target.push(Buffer.from(String(err.stack), "ascii"));
  };
}
function onDataReceived(target, name, logger, output) {
  return (buffer) => {
    logger(`%s received %L bytes`, name, buffer);
    output(`%B`, buffer);
    target.push(buffer);
  };
}
var import_child_process, GitExecutorChain;
var init_git_executor_chain = __esm({
  "src/lib/runners/git-executor-chain.ts"() {
    import_child_process = __nccwpck_require__(2081);
    init_git_error();
    init_task();
    init_utils();
    init_tasks_pending_queue();
    GitExecutorChain = class {
      constructor(_executor, _scheduler, _plugins) {
        this._executor = _executor;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = Promise.resolve();
        this._queue = new TasksPendingQueue();
      }
      get binary() {
        return this._executor.binary;
      }
      get cwd() {
        return this._cwd || this._executor.cwd;
      }
      set cwd(cwd) {
        this._cwd = cwd;
      }
      get env() {
        return this._executor.env;
      }
      get outputHandler() {
        return this._executor.outputHandler;
      }
      chain() {
        return this;
      }
      push(task) {
        this._queue.push(task);
        return this._chain = this._chain.then(() => this.attemptTask(task));
      }
      attemptTask(task) {
        return __async(this, null, function* () {
          const onScheduleComplete = yield this._scheduler.next();
          const onQueueComplete = () => this._queue.complete(task);
          try {
            const { logger } = this._queue.attempt(task);
            return yield isEmptyTask(task) ? this.attemptEmptyTask(task, logger) : this.attemptRemoteTask(task, logger);
          } catch (e) {
            throw this.onFatalException(task, e);
          } finally {
            onQueueComplete();
            onScheduleComplete();
          }
        });
      }
      onFatalException(task, e) {
        const gitError = e instanceof GitError ? Object.assign(e, { task }) : new GitError(task, e && String(e));
        this._chain = Promise.resolve();
        this._queue.fatal(gitError);
        return gitError;
      }
      attemptRemoteTask(task, logger) {
        return __async(this, null, function* () {
          const args = this._plugins.exec("spawn.args", [...task.commands], pluginContext(task, task.commands));
          const raw = yield this.gitResponse(task, this.binary, args, this.outputHandler, logger.step("SPAWN"));
          const outputStreams = yield this.handleTaskData(task, args, raw, logger.step("HANDLE"));
          logger(`passing response to task's parser as a %s`, task.format);
          if (isBufferTask(task)) {
            return callTaskParser(task.parser, outputStreams);
          }
          return callTaskParser(task.parser, outputStreams.asStrings());
        });
      }
      attemptEmptyTask(task, logger) {
        return __async(this, null, function* () {
          logger(`empty task bypassing child process to call to task's parser`);
          return task.parser(this);
        });
      }
      handleTaskData(task, args, result, logger) {
        const { exitCode, rejection, stdOut, stdErr } = result;
        return new Promise((done, fail) => {
          logger(`Preparing to handle process response exitCode=%d stdOut=`, exitCode);
          const { error } = this._plugins.exec("task.error", { error: rejection }, __spreadValues(__spreadValues({}, pluginContext(task, args)), result));
          if (error && task.onError) {
            logger.info(`exitCode=%s handling with custom error handler`);
            return task.onError(result, error, (newStdOut) => {
              logger.info(`custom error handler treated as success`);
              logger(`custom error returned a %s`, objectToString(newStdOut));
              done(new GitOutputStreams(Array.isArray(newStdOut) ? Buffer.concat(newStdOut) : newStdOut, Buffer.concat(stdErr)));
            }, fail);
          }
          if (error) {
            logger.info(`handling as error: exitCode=%s stdErr=%s rejection=%o`, exitCode, stdErr.length, rejection);
            return fail(error);
          }
          logger.info(`retrieving task output complete`);
          done(new GitOutputStreams(Buffer.concat(stdOut), Buffer.concat(stdErr)));
        });
      }
      gitResponse(task, command, args, outputHandler, logger) {
        return __async(this, null, function* () {
          const outputLogger = logger.sibling("output");
          const spawnOptions = this._plugins.exec("spawn.options", {
            cwd: this.cwd,
            env: this.env,
            windowsHide: true
          }, pluginContext(task, task.commands));
          return new Promise((done) => {
            const stdOut = [];
            const stdErr = [];
            logger.info(`%s %o`, command, args);
            logger("%O", spawnOptions);
            let rejection = this._beforeSpawn(task, args);
            if (rejection) {
              return done({
                stdOut,
                stdErr,
                exitCode: 9901,
                rejection
              });
            }
            this._plugins.exec("spawn.before", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
              kill(reason) {
                rejection = reason || rejection;
              }
            }));
            const spawned = (0, import_child_process.spawn)(command, args, spawnOptions);
            spawned.stdout.on("data", onDataReceived(stdOut, "stdOut", logger, outputLogger.step("stdOut")));
            spawned.stderr.on("data", onDataReceived(stdErr, "stdErr", logger, outputLogger.step("stdErr")));
            spawned.on("error", onErrorReceived(stdErr, logger));
            if (outputHandler) {
              logger(`Passing child process stdOut/stdErr to custom outputHandler`);
              outputHandler(command, spawned.stdout, spawned.stderr, [...args]);
            }
            this._plugins.exec("spawn.after", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
              spawned,
              close(exitCode, reason) {
                done({
                  stdOut,
                  stdErr,
                  exitCode,
                  rejection: rejection || reason
                });
              },
              kill(reason) {
                if (spawned.killed) {
                  return;
                }
                rejection = reason;
                spawned.kill("SIGINT");
              }
            }));
          });
        });
      }
      _beforeSpawn(task, args) {
        let rejection;
        this._plugins.exec("spawn.before", void 0, __spreadProps(__spreadValues({}, pluginContext(task, args)), {
          kill(reason) {
            rejection = reason || rejection;
          }
        }));
        return rejection;
      }
    };
  }
});

// src/lib/runners/git-executor.ts
var git_executor_exports = {};
__export(git_executor_exports, {
  GitExecutor: () => GitExecutor
});
var GitExecutor;
var init_git_executor = __esm({
  "src/lib/runners/git-executor.ts"() {
    init_git_executor_chain();
    GitExecutor = class {
      constructor(binary = "git", cwd, _scheduler, _plugins) {
        this.binary = binary;
        this.cwd = cwd;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = new GitExecutorChain(this, this._scheduler, this._plugins);
      }
      chain() {
        return new GitExecutorChain(this, this._scheduler, this._plugins);
      }
      push(task) {
        return this._chain.push(task);
      }
    };
  }
});

// src/lib/task-callback.ts
function taskCallback(task, response, callback = NOOP) {
  const onSuccess = (data) => {
    callback(null, data);
  };
  const onError2 = (err) => {
    if ((err == null ? void 0 : err.task) === task) {
      callback(err instanceof GitResponseError ? addDeprecationNoticeToError(err) : err, void 0);
    }
  };
  response.then(onSuccess, onError2);
}
function addDeprecationNoticeToError(err) {
  let log = (name) => {
    console.warn(`simple-git deprecation notice: accessing GitResponseError.${name} should be GitResponseError.git.${name}, this will no longer be available in version 3`);
    log = NOOP;
  };
  return Object.create(err, Object.getOwnPropertyNames(err.git).reduce(descriptorReducer, {}));
  function descriptorReducer(all, name) {
    if (name in err) {
      return all;
    }
    all[name] = {
      enumerable: false,
      configurable: false,
      get() {
        log(name);
        return err.git[name];
      }
    };
    return all;
  }
}
var init_task_callback = __esm({
  "src/lib/task-callback.ts"() {
    init_git_response_error();
    init_utils();
  }
});

// src/lib/tasks/change-working-directory.ts
function changeWorkingDirectoryTask(directory, root) {
  return adhocExecTask((instance) => {
    if (!folderExists(directory)) {
      throw new Error(`Git.cwd: cannot change to non-directory "${directory}"`);
    }
    return (root || instance).cwd = directory;
  });
}
var init_change_working_directory = __esm({
  "src/lib/tasks/change-working-directory.ts"() {
    init_utils();
    init_task();
  }
});

// src/lib/tasks/checkout.ts
function checkoutTask(args) {
  const commands = ["checkout", ...args];
  if (commands[1] === "-b" && commands.includes("-B")) {
    commands[1] = remove(commands, "-B");
  }
  return straightThroughStringTask(commands);
}
function checkout_default() {
  return {
    checkout() {
      return this._runTask(checkoutTask(getTrailingOptions(arguments, 1)), trailingFunctionArgument(arguments));
    },
    checkoutBranch(branchName, startPoint) {
      return this._runTask(checkoutTask(["-b", branchName, startPoint, ...getTrailingOptions(arguments)]), trailingFunctionArgument(arguments));
    },
    checkoutLocalBranch(branchName) {
      return this._runTask(checkoutTask(["-b", branchName, ...getTrailingOptions(arguments)]), trailingFunctionArgument(arguments));
    }
  };
}
var init_checkout = __esm({
  "src/lib/tasks/checkout.ts"() {
    init_utils();
    init_task();
  }
});

// src/lib/parsers/parse-commit.ts
function parseCommitResult(stdOut) {
  const result = {
    author: null,
    branch: "",
    commit: "",
    root: false,
    summary: {
      changes: 0,
      insertions: 0,
      deletions: 0
    }
  };
  return parseStringResponse(result, parsers, stdOut);
}
var parsers;
var init_parse_commit = __esm({
  "src/lib/parsers/parse-commit.ts"() {
    init_utils();
    parsers = [
      new LineParser(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (result, [branch, root, commit]) => {
        result.branch = branch;
        result.commit = commit;
        result.root = !!root;
      }),
      new LineParser(/\s*Author:\s(.+)/i, (result, [author]) => {
        const parts = author.split("<");
        const email = parts.pop();
        if (!email || !email.includes("@")) {
          return;
        }
        result.author = {
          email: email.substr(0, email.length - 1),
          name: parts.join("<").trim()
        };
      }),
      new LineParser(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g, (result, [changes, insertions, deletions]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        result.summary.insertions = parseInt(insertions, 10) || 0;
        result.summary.deletions = parseInt(deletions, 10) || 0;
      }),
      new LineParser(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/, (result, [changes, lines, direction]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        const count = parseInt(lines, 10) || 0;
        if (direction === "-") {
          result.summary.deletions = count;
        } else if (direction === "+") {
          result.summary.insertions = count;
        }
      })
    ];
  }
});

// src/lib/tasks/commit.ts
function commitTask(message, files, customArgs) {
  const commands = [
    "-c",
    "core.abbrev=40",
    "commit",
    ...prefixedArray(message, "-m"),
    ...files,
    ...customArgs
  ];
  return {
    commands,
    format: "utf-8",
    parser: parseCommitResult
  };
}
function commit_default() {
  return {
    commit(message, ...rest) {
      const next = trailingFunctionArgument(arguments);
      const task = rejectDeprecatedSignatures(message) || commitTask(asArray(message), asArray(filterType(rest[0], filterStringOrStringArray, [])), [...filterType(rest[1], filterArray, []), ...getTrailingOptions(arguments, 0, true)]);
      return this._runTask(task, next);
    }
  };
  function rejectDeprecatedSignatures(message) {
    return !filterStringOrStringArray(message) && configurationErrorTask(`git.commit: requires the commit message to be supplied as a string/string[]`);
  }
}
var init_commit = __esm({
  "src/lib/tasks/commit.ts"() {
    init_parse_commit();
    init_utils();
    init_task();
  }
});

// src/lib/tasks/hash-object.ts
function hashObjectTask(filePath, write) {
  const commands = ["hash-object", filePath];
  if (write) {
    commands.push("-w");
  }
  return straightThroughStringTask(commands, true);
}
var init_hash_object = __esm({
  "src/lib/tasks/hash-object.ts"() {
    init_task();
  }
});

// src/lib/responses/InitSummary.ts
function parseInit(bare, path, text) {
  const response = String(text).trim();
  let result;
  if (result = initResponseRegex.exec(response)) {
    return new InitSummary(bare, path, false, result[1]);
  }
  if (result = reInitResponseRegex.exec(response)) {
    return new InitSummary(bare, path, true, result[1]);
  }
  let gitDir = "";
  const tokens = response.split(" ");
  while (tokens.length) {
    const token = tokens.shift();
    if (token === "in") {
      gitDir = tokens.join(" ");
      break;
    }
  }
  return new InitSummary(bare, path, /^re/i.test(response), gitDir);
}
var InitSummary, initResponseRegex, reInitResponseRegex;
var init_InitSummary = __esm({
  "src/lib/responses/InitSummary.ts"() {
    InitSummary = class {
      constructor(bare, path, existing, gitDir) {
        this.bare = bare;
        this.path = path;
        this.existing = existing;
        this.gitDir = gitDir;
      }
    };
    initResponseRegex = /^Init.+ repository in (.+)$/;
    reInitResponseRegex = /^Rein.+ in (.+)$/;
  }
});

// src/lib/tasks/init.ts
function hasBareCommand(command) {
  return command.includes(bareCommand);
}
function initTask(bare = false, path, customArgs) {
  const commands = ["init", ...customArgs];
  if (bare && !hasBareCommand(commands)) {
    commands.splice(1, 0, bareCommand);
  }
  return {
    commands,
    format: "utf-8",
    parser(text) {
      return parseInit(commands.includes("--bare"), path, text);
    }
  };
}
var bareCommand;
var init_init = __esm({
  "src/lib/tasks/init.ts"() {
    init_InitSummary();
    bareCommand = "--bare";
  }
});

// src/lib/args/log-format.ts
function logFormatFromCommand(customArgs) {
  for (let i = 0; i < customArgs.length; i++) {
    const format = logFormatRegex.exec(customArgs[i]);
    if (format) {
      return `--${format[1]}`;
    }
  }
  return "" /* NONE */;
}
function isLogFormat(customArg) {
  return logFormatRegex.test(customArg);
}
var logFormatRegex;
var init_log_format = __esm({
  "src/lib/args/log-format.ts"() {
    logFormatRegex = /^--(stat|numstat|name-only|name-status)(=|$)/;
  }
});

// src/lib/responses/DiffSummary.ts
var DiffSummary;
var init_DiffSummary = __esm({
  "src/lib/responses/DiffSummary.ts"() {
    DiffSummary = class {
      constructor() {
        this.changed = 0;
        this.deletions = 0;
        this.insertions = 0;
        this.files = [];
      }
    };
  }
});

// src/lib/parsers/parse-diff-summary.ts
function getDiffParser(format = "" /* NONE */) {
  const parser3 = diffSummaryParsers[format];
  return (stdOut) => parseStringResponse(new DiffSummary(), parser3, stdOut, false);
}
var statParser, numStatParser, nameOnlyParser, nameStatusParser, diffSummaryParsers;
var init_parse_diff_summary = __esm({
  "src/lib/parsers/parse-diff-summary.ts"() {
    init_log_format();
    init_DiffSummary();
    init_utils();
    statParser = [
      new LineParser(/(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/, (result, [file, changes, alterations = ""]) => {
        result.files.push({
          file: file.trim(),
          changes: asNumber(changes),
          insertions: alterations.replace(/[^+]/g, "").length,
          deletions: alterations.replace(/[^-]/g, "").length,
          binary: false
        });
      }),
      new LineParser(/(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)/, (result, [file, before, after]) => {
        result.files.push({
          file: file.trim(),
          before: asNumber(before),
          after: asNumber(after),
          binary: true
        });
      }),
      new LineParser(/(\d+) files? changed\s*((?:, \d+ [^,]+){0,2})/, (result, [changed, summary]) => {
        const inserted = /(\d+) i/.exec(summary);
        const deleted = /(\d+) d/.exec(summary);
        result.changed = asNumber(changed);
        result.insertions = asNumber(inserted == null ? void 0 : inserted[1]);
        result.deletions = asNumber(deleted == null ? void 0 : deleted[1]);
      })
    ];
    numStatParser = [
      new LineParser(/(\d+)\t(\d+)\t(.+)$/, (result, [changesInsert, changesDelete, file]) => {
        const insertions = asNumber(changesInsert);
        const deletions = asNumber(changesDelete);
        result.changed++;
        result.insertions += insertions;
        result.deletions += deletions;
        result.files.push({
          file,
          changes: insertions + deletions,
          insertions,
          deletions,
          binary: false
        });
      }),
      new LineParser(/-\t-\t(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          after: 0,
          before: 0,
          binary: true
        });
      })
    ];
    nameOnlyParser = [
      new LineParser(/(.+)$/, (result, [file]) => {
        result.changed++;
        result.files.push({
          file,
          changes: 0,
          insertions: 0,
          deletions: 0,
          binary: false
        });
      })
    ];
    nameStatusParser = [
      new LineParser(/([ACDMRTUXB])\s*(.+)$/, (result, [_status, file]) => {
        result.changed++;
        result.files.push({
          file,
          changes: 0,
          insertions: 0,
          deletions: 0,
          binary: false
        });
      })
    ];
    diffSummaryParsers = {
      ["" /* NONE */]: statParser,
      ["--stat" /* STAT */]: statParser,
      ["--numstat" /* NUM_STAT */]: numStatParser,
      ["--name-status" /* NAME_STATUS */]: nameStatusParser,
      ["--name-only" /* NAME_ONLY */]: nameOnlyParser
    };
  }
});

// src/lib/parsers/parse-list-log-summary.ts
function lineBuilder(tokens, fields) {
  return fields.reduce((line, field, index) => {
    line[field] = tokens[index] || "";
    return line;
  }, /* @__PURE__ */ Object.create({ diff: null }));
}
function createListLogSummaryParser(splitter = SPLITTER, fields = defaultFieldNames, logFormat = "" /* NONE */) {
  const parseDiffResult = getDiffParser(logFormat);
  return function(stdOut) {
    const all = toLinesWithContent(stdOut, true, START_BOUNDARY).map(function(item) {
      const lineDetail = item.trim().split(COMMIT_BOUNDARY);
      const listLogLine = lineBuilder(lineDetail[0].trim().split(splitter), fields);
      if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
        listLogLine.diff = parseDiffResult(lineDetail[1]);
      }
      return listLogLine;
    });
    return {
      all,
      latest: all.length && all[0] || null,
      total: all.length
    };
  };
}
var START_BOUNDARY, COMMIT_BOUNDARY, SPLITTER, defaultFieldNames;
var init_parse_list_log_summary = __esm({
  "src/lib/parsers/parse-list-log-summary.ts"() {
    init_utils();
    init_parse_diff_summary();
    init_log_format();
    START_BOUNDARY = "\xF2\xF2\xF2\xF2\xF2\xF2 ";
    COMMIT_BOUNDARY = " \xF2\xF2";
    SPLITTER = " \xF2 ";
    defaultFieldNames = ["hash", "date", "message", "refs", "author_name", "author_email"];
  }
});

// src/lib/tasks/diff.ts
var diff_exports = {};
__export(diff_exports, {
  diffSummaryTask: () => diffSummaryTask,
  validateLogFormatConfig: () => validateLogFormatConfig
});
function diffSummaryTask(customArgs) {
  let logFormat = logFormatFromCommand(customArgs);
  const commands = ["diff"];
  if (logFormat === "" /* NONE */) {
    logFormat = "--stat" /* STAT */;
    commands.push("--stat=4096");
  }
  commands.push(...customArgs);
  return validateLogFormatConfig(commands) || {
    commands,
    format: "utf-8",
    parser: getDiffParser(logFormat)
  };
}
function validateLogFormatConfig(customArgs) {
  const flags = customArgs.filter(isLogFormat);
  if (flags.length > 1) {
    return configurationErrorTask(`Summary flags are mutually exclusive - pick one of ${flags.join(",")}`);
  }
  if (flags.length && customArgs.includes("-z")) {
    return configurationErrorTask(`Summary flag ${flags} parsing is not compatible with null termination option '-z'`);
  }
}
var init_diff = __esm({
  "src/lib/tasks/diff.ts"() {
    init_log_format();
    init_parse_diff_summary();
    init_task();
  }
});

// src/lib/tasks/log.ts
function prettyFormat(format, splitter) {
  const fields = [];
  const formatStr = [];
  Object.keys(format).forEach((field) => {
    fields.push(field);
    formatStr.push(String(format[field]));
  });
  return [fields, formatStr.join(splitter)];
}
function userOptions(input) {
  return Object.keys(input).reduce((out, key) => {
    if (!(key in excludeOptions)) {
      out[key] = input[key];
    }
    return out;
  }, {});
}
function parseLogOptions(opt = {}, customArgs = []) {
  const splitter = filterType(opt.splitter, filterString, SPLITTER);
  const format = !filterPrimitives(opt.format) && opt.format ? opt.format : {
    hash: "%H",
    date: opt.strictDate === false ? "%ai" : "%aI",
    message: "%s",
    refs: "%D",
    body: opt.multiLine ? "%B" : "%b",
    author_name: opt.mailMap !== false ? "%aN" : "%an",
    author_email: opt.mailMap !== false ? "%aE" : "%ae"
  };
  const [fields, formatStr] = prettyFormat(format, splitter);
  const suffix = [];
  const command = [
    `--pretty=format:${START_BOUNDARY}${formatStr}${COMMIT_BOUNDARY}`,
    ...customArgs
  ];
  const maxCount = opt.n || opt["max-count"] || opt.maxCount;
  if (maxCount) {
    command.push(`--max-count=${maxCount}`);
  }
  if (opt.from || opt.to) {
    const rangeOperator = opt.symmetric !== false ? "..." : "..";
    suffix.push(`${opt.from || ""}${rangeOperator}${opt.to || ""}`);
  }
  if (filterString(opt.file)) {
    suffix.push("--follow", opt.file);
  }
  appendTaskOptions(userOptions(opt), command);
  return {
    fields,
    splitter,
    commands: [...command, ...suffix]
  };
}
function logTask(splitter, fields, customArgs) {
  const parser3 = createListLogSummaryParser(splitter, fields, logFormatFromCommand(customArgs));
  return {
    commands: ["log", ...customArgs],
    format: "utf-8",
    parser: parser3
  };
}
function log_default() {
  return {
    log(...rest) {
      const next = trailingFunctionArgument(arguments);
      const options = parseLogOptions(trailingOptionsArgument(arguments), filterType(arguments[0], filterArray));
      const task = rejectDeprecatedSignatures(...rest) || validateLogFormatConfig(options.commands) || createLogTask(options);
      return this._runTask(task, next);
    }
  };
  function createLogTask(options) {
    return logTask(options.splitter, options.fields, options.commands);
  }
  function rejectDeprecatedSignatures(from, to) {
    return filterString(from) && filterString(to) && configurationErrorTask(`git.log(string, string) should be replaced with git.log({ from: string, to: string })`);
  }
}
var excludeOptions;
var init_log = __esm({
  "src/lib/tasks/log.ts"() {
    init_log_format();
    init_parse_list_log_summary();
    init_utils();
    init_task();
    init_diff();
    excludeOptions = /* @__PURE__ */ ((excludeOptions2) => {
      excludeOptions2[excludeOptions2["--pretty"] = 0] = "--pretty";
      excludeOptions2[excludeOptions2["max-count"] = 1] = "max-count";
      excludeOptions2[excludeOptions2["maxCount"] = 2] = "maxCount";
      excludeOptions2[excludeOptions2["n"] = 3] = "n";
      excludeOptions2[excludeOptions2["file"] = 4] = "file";
      excludeOptions2[excludeOptions2["format"] = 5] = "format";
      excludeOptions2[excludeOptions2["from"] = 6] = "from";
      excludeOptions2[excludeOptions2["to"] = 7] = "to";
      excludeOptions2[excludeOptions2["splitter"] = 8] = "splitter";
      excludeOptions2[excludeOptions2["symmetric"] = 9] = "symmetric";
      excludeOptions2[excludeOptions2["mailMap"] = 10] = "mailMap";
      excludeOptions2[excludeOptions2["multiLine"] = 11] = "multiLine";
      excludeOptions2[excludeOptions2["strictDate"] = 12] = "strictDate";
      return excludeOptions2;
    })(excludeOptions || {});
  }
});

// src/lib/responses/MergeSummary.ts
var MergeSummaryConflict, MergeSummaryDetail;
var init_MergeSummary = __esm({
  "src/lib/responses/MergeSummary.ts"() {
    MergeSummaryConflict = class {
      constructor(reason, file = null, meta) {
        this.reason = reason;
        this.file = file;
        this.meta = meta;
      }
      toString() {
        return `${this.file}:${this.reason}`;
      }
    };
    MergeSummaryDetail = class {
      constructor() {
        this.conflicts = [];
        this.merges = [];
        this.result = "success";
      }
      get failed() {
        return this.conflicts.length > 0;
      }
      get reason() {
        return this.result;
      }
      toString() {
        if (this.conflicts.length) {
          return `CONFLICTS: ${this.conflicts.join(", ")}`;
        }
        return "OK";
      }
    };
  }
});

// src/lib/responses/PullSummary.ts
var PullSummary, PullFailedSummary;
var init_PullSummary = __esm({
  "src/lib/responses/PullSummary.ts"() {
    PullSummary = class {
      constructor() {
        this.remoteMessages = {
          all: []
        };
        this.created = [];
        this.deleted = [];
        this.files = [];
        this.deletions = {};
        this.insertions = {};
        this.summary = {
          changes: 0,
          deletions: 0,
          insertions: 0
        };
      }
    };
    PullFailedSummary = class {
      constructor() {
        this.remote = "";
        this.hash = {
          local: "",
          remote: ""
        };
        this.branch = {
          local: "",
          remote: ""
        };
        this.message = "";
      }
      toString() {
        return this.message;
      }
    };
  }
});

// src/lib/parsers/parse-remote-objects.ts
function objectEnumerationResult(remoteMessages) {
  return remoteMessages.objects = remoteMessages.objects || {
    compressing: 0,
    counting: 0,
    enumerating: 0,
    packReused: 0,
    reused: { count: 0, delta: 0 },
    total: { count: 0, delta: 0 }
  };
}
function asObjectCount(source) {
  const count = /^\s*(\d+)/.exec(source);
  const delta = /delta (\d+)/i.exec(source);
  return {
    count: asNumber(count && count[1] || "0"),
    delta: asNumber(delta && delta[1] || "0")
  };
}
var remoteMessagesObjectParsers;
var init_parse_remote_objects = __esm({
  "src/lib/parsers/parse-remote-objects.ts"() {
    init_utils();
    remoteMessagesObjectParsers = [
      new RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: asNumber(count) });
      }),
      new RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: asNumber(count) });
      }),
      new RemoteLineParser(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i, (result, [total, reused, packReused]) => {
        const objects = objectEnumerationResult(result.remoteMessages);
        objects.total = asObjectCount(total);
        objects.reused = asObjectCount(reused);
        objects.packReused = asNumber(packReused);
      })
    ];
  }
});

// src/lib/parsers/parse-remote-messages.ts
function parseRemoteMessages(_stdOut, stdErr) {
  return parseStringResponse({ remoteMessages: new RemoteMessageSummary() }, parsers2, stdErr);
}
var parsers2, RemoteMessageSummary;
var init_parse_remote_messages = __esm({
  "src/lib/parsers/parse-remote-messages.ts"() {
    init_utils();
    init_parse_remote_objects();
    parsers2 = [
      new RemoteLineParser(/^remote:\s*(.+)$/, (result, [text]) => {
        result.remoteMessages.all.push(text.trim());
        return false;
      }),
      ...remoteMessagesObjectParsers,
      new RemoteLineParser([/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/], (result, [pullRequestUrl]) => {
        result.remoteMessages.pullRequestUrl = pullRequestUrl;
      }),
      new RemoteLineParser([/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/], (result, [count, summary, url]) => {
        result.remoteMessages.vulnerabilities = {
          count: asNumber(count),
          summary,
          url
        };
      })
    ];
    RemoteMessageSummary = class {
      constructor() {
        this.all = [];
      }
    };
  }
});

// src/lib/parsers/parse-pull.ts
function parsePullErrorResult(stdOut, stdErr) {
  const pullError = parseStringResponse(new PullFailedSummary(), errorParsers, [stdOut, stdErr]);
  return pullError.message && pullError;
}
var FILE_UPDATE_REGEX, SUMMARY_REGEX, ACTION_REGEX, parsers3, errorParsers, parsePullDetail, parsePullResult;
var init_parse_pull = __esm({
  "src/lib/parsers/parse-pull.ts"() {
    init_PullSummary();
    init_utils();
    init_parse_remote_messages();
    FILE_UPDATE_REGEX = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
    SUMMARY_REGEX = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
    ACTION_REGEX = /^(create|delete) mode \d+ (.+)/;
    parsers3 = [
      new LineParser(FILE_UPDATE_REGEX, (result, [file, insertions, deletions]) => {
        result.files.push(file);
        if (insertions) {
          result.insertions[file] = insertions.length;
        }
        if (deletions) {
          result.deletions[file] = deletions.length;
        }
      }),
      new LineParser(SUMMARY_REGEX, (result, [changes, , insertions, , deletions]) => {
        if (insertions !== void 0 || deletions !== void 0) {
          result.summary.changes = +changes || 0;
          result.summary.insertions = +insertions || 0;
          result.summary.deletions = +deletions || 0;
          return true;
        }
        return false;
      }),
      new LineParser(ACTION_REGEX, (result, [action, file]) => {
        append(result.files, file);
        append(action === "create" ? result.created : result.deleted, file);
      })
    ];
    errorParsers = [
      new LineParser(/^from\s(.+)$/i, (result, [remote]) => void (result.remote = remote)),
      new LineParser(/^fatal:\s(.+)$/, (result, [message]) => void (result.message = message)),
      new LineParser(/([a-z0-9]+)\.\.([a-z0-9]+)\s+(\S+)\s+->\s+(\S+)$/, (result, [hashLocal, hashRemote, branchLocal, branchRemote]) => {
        result.branch.local = branchLocal;
        result.hash.local = hashLocal;
        result.branch.remote = branchRemote;
        result.hash.remote = hashRemote;
      })
    ];
    parsePullDetail = (stdOut, stdErr) => {
      return parseStringResponse(new PullSummary(), parsers3, [stdOut, stdErr]);
    };
    parsePullResult = (stdOut, stdErr) => {
      return Object.assign(new PullSummary(), parsePullDetail(stdOut, stdErr), parseRemoteMessages(stdOut, stdErr));
    };
  }
});

// src/lib/parsers/parse-merge.ts
var parsers4, parseMergeResult, parseMergeDetail;
var init_parse_merge = __esm({
  "src/lib/parsers/parse-merge.ts"() {
    init_MergeSummary();
    init_utils();
    init_parse_pull();
    parsers4 = [
      new LineParser(/^Auto-merging\s+(.+)$/, (summary, [autoMerge]) => {
        summary.merges.push(autoMerge);
      }),
      new LineParser(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/, (summary, [reason, file]) => {
        summary.conflicts.push(new MergeSummaryConflict(reason, file));
      }),
      new LineParser(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/, (summary, [reason, file, deleteRef]) => {
        summary.conflicts.push(new MergeSummaryConflict(reason, file, { deleteRef }));
      }),
      new LineParser(/^CONFLICT\s+\((.+)\):/, (summary, [reason]) => {
        summary.conflicts.push(new MergeSummaryConflict(reason, null));
      }),
      new LineParser(/^Automatic merge failed;\s+(.+)$/, (summary, [result]) => {
        summary.result = result;
      })
    ];
    parseMergeResult = (stdOut, stdErr) => {
      return Object.assign(parseMergeDetail(stdOut, stdErr), parsePullResult(stdOut, stdErr));
    };
    parseMergeDetail = (stdOut) => {
      return parseStringResponse(new MergeSummaryDetail(), parsers4, stdOut);
    };
  }
});

// src/lib/tasks/merge.ts
function mergeTask(customArgs) {
  if (!customArgs.length) {
    return configurationErrorTask("Git.merge requires at least one option");
  }
  return {
    commands: ["merge", ...customArgs],
    format: "utf-8",
    parser(stdOut, stdErr) {
      const merge = parseMergeResult(stdOut, stdErr);
      if (merge.failed) {
        throw new GitResponseError(merge);
      }
      return merge;
    }
  };
}
var init_merge = __esm({
  "src/lib/tasks/merge.ts"() {
    init_git_response_error();
    init_parse_merge();
    init_task();
  }
});

// src/lib/parsers/parse-push.ts
function pushResultPushedItem(local, remote, status) {
  const deleted = status.includes("deleted");
  const tag = status.includes("tag") || /^refs\/tags/.test(local);
  const alreadyUpdated = !status.includes("new");
  return {
    deleted,
    tag,
    branch: !tag,
    new: !alreadyUpdated,
    alreadyUpdated,
    local,
    remote
  };
}
var parsers5, parsePushResult, parsePushDetail;
var init_parse_push = __esm({
  "src/lib/parsers/parse-push.ts"() {
    init_utils();
    init_parse_remote_messages();
    parsers5 = [
      new LineParser(/^Pushing to (.+)$/, (result, [repo]) => {
        result.repo = repo;
      }),
      new LineParser(/^updating local tracking ref '(.+)'/, (result, [local]) => {
        result.ref = __spreadProps(__spreadValues({}, result.ref || {}), {
          local
        });
      }),
      new LineParser(/^[=*-]\s+([^:]+):(\S+)\s+\[(.+)]$/, (result, [local, remote, type]) => {
        result.pushed.push(pushResultPushedItem(local, remote, type));
      }),
      new LineParser(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/, (result, [local, remote, remoteName]) => {
        result.branch = __spreadProps(__spreadValues({}, result.branch || {}), {
          local,
          remote,
          remoteName
        });
      }),
      new LineParser(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/, (result, [local, remote, from, to]) => {
        result.update = {
          head: {
            local,
            remote
          },
          hash: {
            from,
            to
          }
        };
      })
    ];
    parsePushResult = (stdOut, stdErr) => {
      const pushDetail = parsePushDetail(stdOut, stdErr);
      const responseDetail = parseRemoteMessages(stdOut, stdErr);
      return __spreadValues(__spreadValues({}, pushDetail), responseDetail);
    };
    parsePushDetail = (stdOut, stdErr) => {
      return parseStringResponse({ pushed: [] }, parsers5, [stdOut, stdErr]);
    };
  }
});

// src/lib/tasks/push.ts
var push_exports = {};
__export(push_exports, {
  pushTagsTask: () => pushTagsTask,
  pushTask: () => pushTask
});
function pushTagsTask(ref = {}, customArgs) {
  append(customArgs, "--tags");
  return pushTask(ref, customArgs);
}
function pushTask(ref = {}, customArgs) {
  const commands = ["push", ...customArgs];
  if (ref.branch) {
    commands.splice(1, 0, ref.branch);
  }
  if (ref.remote) {
    commands.splice(1, 0, ref.remote);
  }
  remove(commands, "-v");
  append(commands, "--verbose");
  append(commands, "--porcelain");
  return {
    commands,
    format: "utf-8",
    parser: parsePushResult
  };
}
var init_push = __esm({
  "src/lib/tasks/push.ts"() {
    init_parse_push();
    init_utils();
  }
});

// src/lib/tasks/show.ts
function show_default() {
  return {
    showBuffer() {
      const commands = ["show", ...getTrailingOptions(arguments, 1)];
      if (!commands.includes("--binary")) {
        commands.splice(1, 0, "--binary");
      }
      return this._runTask(straightThroughBufferTask(commands), trailingFunctionArgument(arguments));
    },
    show() {
      const commands = ["show", ...getTrailingOptions(arguments, 1)];
      return this._runTask(straightThroughStringTask(commands), trailingFunctionArgument(arguments));
    }
  };
}
var init_show = __esm({
  "src/lib/tasks/show.ts"() {
    init_utils();
    init_task();
  }
});

// src/lib/responses/FileStatusSummary.ts
var fromPathRegex, FileStatusSummary;
var init_FileStatusSummary = __esm({
  "src/lib/responses/FileStatusSummary.ts"() {
    fromPathRegex = /^(.+) -> (.+)$/;
    FileStatusSummary = class {
      constructor(path, index, working_dir) {
        this.path = path;
        this.index = index;
        this.working_dir = working_dir;
        if (index + working_dir === "R") {
          const detail = fromPathRegex.exec(path) || [null, path, path];
          this.from = detail[1] || "";
          this.path = detail[2] || "";
        }
      }
    };
  }
});

// src/lib/responses/StatusSummary.ts
function renamedFile(line) {
  const [to, from] = line.split(NULL);
  return {
    from: from || to,
    to
  };
}
function parser2(indexX, indexY, handler) {
  return [`${indexX}${indexY}`, handler];
}
function conflicts(indexX, ...indexY) {
  return indexY.map((y) => parser2(indexX, y, (result, file) => append(result.conflicted, file)));
}
function splitLine(result, lineStr) {
  const trimmed2 = lineStr.trim();
  switch (" ") {
    case trimmed2.charAt(2):
      return data(trimmed2.charAt(0), trimmed2.charAt(1), trimmed2.substr(3));
    case trimmed2.charAt(1):
      return data(" " /* NONE */, trimmed2.charAt(0), trimmed2.substr(2));
    default:
      return;
  }
  function data(index, workingDir, path) {
    const raw = `${index}${workingDir}`;
    const handler = parsers6.get(raw);
    if (handler) {
      handler(result, path);
    }
    if (raw !== "##" && raw !== "!!") {
      result.files.push(new FileStatusSummary(path.replace(/\0.+$/, ""), index, workingDir));
    }
  }
}
var StatusSummary, parsers6, parseStatusSummary;
var init_StatusSummary = __esm({
  "src/lib/responses/StatusSummary.ts"() {
    init_utils();
    init_FileStatusSummary();
    StatusSummary = class {
      constructor() {
        this.not_added = [];
        this.conflicted = [];
        this.created = [];
        this.deleted = [];
        this.ignored = void 0;
        this.modified = [];
        this.renamed = [];
        this.files = [];
        this.staged = [];
        this.ahead = 0;
        this.behind = 0;
        this.current = null;
        this.tracking = null;
        this.detached = false;
        this.isClean = () => {
          return !this.files.length;
        };
      }
    };
    parsers6 = new Map([
      parser2(" " /* NONE */, "A" /* ADDED */, (result, file) => append(result.created, file)),
      parser2(" " /* NONE */, "D" /* DELETED */, (result, file) => append(result.deleted, file)),
      parser2(" " /* NONE */, "M" /* MODIFIED */, (result, file) => append(result.modified, file)),
      parser2("A" /* ADDED */, " " /* NONE */, (result, file) => append(result.created, file) && append(result.staged, file)),
      parser2("A" /* ADDED */, "M" /* MODIFIED */, (result, file) => append(result.created, file) && append(result.staged, file) && append(result.modified, file)),
      parser2("D" /* DELETED */, " " /* NONE */, (result, file) => append(result.deleted, file) && append(result.staged, file)),
      parser2("M" /* MODIFIED */, " " /* NONE */, (result, file) => append(result.modified, file) && append(result.staged, file)),
      parser2("M" /* MODIFIED */, "M" /* MODIFIED */, (result, file) => append(result.modified, file) && append(result.staged, file)),
      parser2("R" /* RENAMED */, " " /* NONE */, (result, file) => {
        append(result.renamed, renamedFile(file));
      }),
      parser2("R" /* RENAMED */, "M" /* MODIFIED */, (result, file) => {
        const renamed = renamedFile(file);
        append(result.renamed, renamed);
        append(result.modified, renamed.to);
      }),
      parser2("!" /* IGNORED */, "!" /* IGNORED */, (_result, _file) => {
        append(_result.ignored = _result.ignored || [], _file);
      }),
      parser2("?" /* UNTRACKED */, "?" /* UNTRACKED */, (result, file) => append(result.not_added, file)),
      ...conflicts("A" /* ADDED */, "A" /* ADDED */, "U" /* UNMERGED */),
      ...conflicts("D" /* DELETED */, "D" /* DELETED */, "U" /* UNMERGED */),
      ...conflicts("U" /* UNMERGED */, "A" /* ADDED */, "D" /* DELETED */, "U" /* UNMERGED */),
      [
        "##",
        (result, line) => {
          const aheadReg = /ahead (\d+)/;
          const behindReg = /behind (\d+)/;
          const currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
          const trackingReg = /\.{3}(\S*)/;
          const onEmptyBranchReg = /\son\s([\S]+)$/;
          let regexResult;
          regexResult = aheadReg.exec(line);
          result.ahead = regexResult && +regexResult[1] || 0;
          regexResult = behindReg.exec(line);
          result.behind = regexResult && +regexResult[1] || 0;
          regexResult = currentReg.exec(line);
          result.current = regexResult && regexResult[1];
          regexResult = trackingReg.exec(line);
          result.tracking = regexResult && regexResult[1];
          regexResult = onEmptyBranchReg.exec(line);
          result.current = regexResult && regexResult[1] || result.current;
          result.detached = /\(no branch\)/.test(line);
        }
      ]
    ]);
    parseStatusSummary = function(text) {
      const lines = text.split(NULL);
      const status = new StatusSummary();
      for (let i = 0, l = lines.length; i < l; ) {
        let line = lines[i++].trim();
        if (!line) {
          continue;
        }
        if (line.charAt(0) === "R" /* RENAMED */) {
          line += NULL + (lines[i++] || "");
        }
        splitLine(status, line);
      }
      return status;
    };
  }
});

// src/lib/tasks/status.ts
function statusTask(customArgs) {
  const commands = [
    "status",
    "--porcelain",
    "-b",
    "-u",
    "--null",
    ...customArgs.filter((arg) => !ignoredOptions.includes(arg))
  ];
  return {
    format: "utf-8",
    commands,
    parser(text) {
      return parseStatusSummary(text);
    }
  };
}
var ignoredOptions;
var init_status = __esm({
  "src/lib/tasks/status.ts"() {
    init_StatusSummary();
    ignoredOptions = ["--null", "-z"];
  }
});

// src/lib/tasks/version.ts
function versionResponse(major = 0, minor = 0, patch = 0, agent = "", installed = true) {
  return Object.defineProperty({
    major,
    minor,
    patch,
    agent,
    installed
  }, "toString", {
    value() {
      return `${this.major}.${this.minor}.${this.patch}`;
    },
    configurable: false,
    enumerable: false
  });
}
function notInstalledResponse() {
  return versionResponse(0, 0, 0, "", false);
}
function version_default() {
  return {
    version() {
      return this._runTask({
        commands: ["--version"],
        format: "utf-8",
        parser: versionParser,
        onError(result, error, done, fail) {
          if (result.exitCode === -2 /* NOT_FOUND */) {
            return done(Buffer.from(NOT_INSTALLED));
          }
          fail(error);
        }
      });
    }
  };
}
function versionParser(stdOut) {
  if (stdOut === NOT_INSTALLED) {
    return notInstalledResponse();
  }
  return parseStringResponse(versionResponse(0, 0, 0, stdOut), parsers7, stdOut);
}
var NOT_INSTALLED, parsers7;
var init_version = __esm({
  "src/lib/tasks/version.ts"() {
    init_utils();
    NOT_INSTALLED = "installed=false";
    parsers7 = [
      new LineParser(/version (\d+)\.(\d+)\.(\d+)(?:\s*\((.+)\))?/, (result, [major, minor, patch, agent = ""]) => {
        Object.assign(result, versionResponse(asNumber(major), asNumber(minor), asNumber(patch), agent));
      }),
      new LineParser(/version (\d+)\.(\d+)\.(\D+)(.+)?$/, (result, [major, minor, patch, agent = ""]) => {
        Object.assign(result, versionResponse(asNumber(major), asNumber(minor), patch, agent));
      })
    ];
  }
});

// src/lib/simple-git-api.ts
var simple_git_api_exports = {};
__export(simple_git_api_exports, {
  SimpleGitApi: () => SimpleGitApi
});
var SimpleGitApi;
var init_simple_git_api = __esm({
  "src/lib/simple-git-api.ts"() {
    init_task_callback();
    init_change_working_directory();
    init_checkout();
    init_commit();
    init_config();
    init_grep();
    init_hash_object();
    init_init();
    init_log();
    init_merge();
    init_push();
    init_show();
    init_status();
    init_task();
    init_version();
    init_utils();
    SimpleGitApi = class {
      constructor(_executor) {
        this._executor = _executor;
      }
      _runTask(task, then) {
        const chain = this._executor.chain();
        const promise = chain.push(task);
        if (then) {
          taskCallback(task, promise, then);
        }
        return Object.create(this, {
          then: { value: promise.then.bind(promise) },
          catch: { value: promise.catch.bind(promise) },
          _executor: { value: chain }
        });
      }
      add(files) {
        return this._runTask(straightThroughStringTask(["add", ...asArray(files)]), trailingFunctionArgument(arguments));
      }
      cwd(directory) {
        const next = trailingFunctionArgument(arguments);
        if (typeof directory === "string") {
          return this._runTask(changeWorkingDirectoryTask(directory, this._executor), next);
        }
        if (typeof (directory == null ? void 0 : directory.path) === "string") {
          return this._runTask(changeWorkingDirectoryTask(directory.path, directory.root && this._executor || void 0), next);
        }
        return this._runTask(configurationErrorTask("Git.cwd: workingDirectory must be supplied as a string"), next);
      }
      hashObject(path, write) {
        return this._runTask(hashObjectTask(path, write === true), trailingFunctionArgument(arguments));
      }
      init(bare) {
        return this._runTask(initTask(bare === true, this._executor.cwd, getTrailingOptions(arguments)), trailingFunctionArgument(arguments));
      }
      merge() {
        return this._runTask(mergeTask(getTrailingOptions(arguments)), trailingFunctionArgument(arguments));
      }
      mergeFromTo(remote, branch) {
        if (!(filterString(remote) && filterString(branch))) {
          return this._runTask(configurationErrorTask(`Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings`));
        }
        return this._runTask(mergeTask([remote, branch, ...getTrailingOptions(arguments)]), trailingFunctionArgument(arguments, false));
      }
      outputHandler(handler) {
        this._executor.outputHandler = handler;
        return this;
      }
      push() {
        const task = pushTask({
          remote: filterType(arguments[0], filterString),
          branch: filterType(arguments[1], filterString)
        }, getTrailingOptions(arguments));
        return this._runTask(task, trailingFunctionArgument(arguments));
      }
      stash() {
        return this._runTask(straightThroughStringTask(["stash", ...getTrailingOptions(arguments)]), trailingFunctionArgument(arguments));
      }
      status() {
        return this._runTask(statusTask(getTrailingOptions(arguments)), trailingFunctionArgument(arguments));
      }
    };
    Object.assign(SimpleGitApi.prototype, checkout_default(), commit_default(), config_default(), grep_default(), log_default(), show_default(), version_default());
  }
});

// src/lib/runners/scheduler.ts
var scheduler_exports = {};
__export(scheduler_exports, {
  Scheduler: () => Scheduler
});
var import_promise_deferred2, createScheduledTask, Scheduler;
var init_scheduler = __esm({
  "src/lib/runners/scheduler.ts"() {
    init_utils();
    import_promise_deferred2 = __nccwpck_require__(9819);
    init_git_logger();
    createScheduledTask = (() => {
      let id = 0;
      return () => {
        id++;
        const { promise, done } = (0, import_promise_deferred2.createDeferred)();
        return {
          promise,
          done,
          id
        };
      };
    })();
    Scheduler = class {
      constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.logger = createLogger("", "scheduler");
        this.pending = [];
        this.running = [];
        this.logger(`Constructed, concurrency=%s`, concurrency);
      }
      schedule() {
        if (!this.pending.length || this.running.length >= this.concurrency) {
          this.logger(`Schedule attempt ignored, pending=%s running=%s concurrency=%s`, this.pending.length, this.running.length, this.concurrency);
          return;
        }
        const task = append(this.running, this.pending.shift());
        this.logger(`Attempting id=%s`, task.id);
        task.done(() => {
          this.logger(`Completing id=`, task.id);
          remove(this.running, task);
          this.schedule();
        });
      }
      next() {
        const { promise, id } = append(this.pending, createScheduledTask());
        this.logger(`Scheduling id=%s`, id);
        this.schedule();
        return promise;
      }
    };
  }
});

// src/lib/tasks/apply-patch.ts
var apply_patch_exports = {};
__export(apply_patch_exports, {
  applyPatchTask: () => applyPatchTask
});
function applyPatchTask(patches, customArgs) {
  return straightThroughStringTask(["apply", ...customArgs, ...patches]);
}
var init_apply_patch = __esm({
  "src/lib/tasks/apply-patch.ts"() {
    init_task();
  }
});

// src/lib/responses/BranchDeleteSummary.ts
function branchDeletionSuccess(branch, hash) {
  return {
    branch,
    hash,
    success: true
  };
}
function branchDeletionFailure(branch) {
  return {
    branch,
    hash: null,
    success: false
  };
}
var BranchDeletionBatch;
var init_BranchDeleteSummary = __esm({
  "src/lib/responses/BranchDeleteSummary.ts"() {
    BranchDeletionBatch = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.errors = [];
      }
      get success() {
        return !this.errors.length;
      }
    };
  }
});

// src/lib/parsers/parse-branch-delete.ts
function hasBranchDeletionError(data, processExitCode) {
  return processExitCode === 1 /* ERROR */ && deleteErrorRegex.test(data);
}
var deleteSuccessRegex, deleteErrorRegex, parsers8, parseBranchDeletions;
var init_parse_branch_delete = __esm({
  "src/lib/parsers/parse-branch-delete.ts"() {
    init_BranchDeleteSummary();
    init_utils();
    deleteSuccessRegex = /(\S+)\s+\(\S+\s([^)]+)\)/;
    deleteErrorRegex = /^error[^']+'([^']+)'/m;
    parsers8 = [
      new LineParser(deleteSuccessRegex, (result, [branch, hash]) => {
        const deletion = branchDeletionSuccess(branch, hash);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      }),
      new LineParser(deleteErrorRegex, (result, [branch]) => {
        const deletion = branchDeletionFailure(branch);
        result.errors.push(deletion);
        result.all.push(deletion);
        result.branches[branch] = deletion;
      })
    ];
    parseBranchDeletions = (stdOut, stdErr) => {
      return parseStringResponse(new BranchDeletionBatch(), parsers8, [stdOut, stdErr]);
    };
  }
});

// src/lib/responses/BranchSummary.ts
var BranchSummaryResult;
var init_BranchSummary = __esm({
  "src/lib/responses/BranchSummary.ts"() {
    BranchSummaryResult = class {
      constructor() {
        this.all = [];
        this.branches = {};
        this.current = "";
        this.detached = false;
      }
      push(status, detached, name, commit, label) {
        if (status === "*" /* CURRENT */) {
          this.detached = detached;
          this.current = name;
        }
        this.all.push(name);
        this.branches[name] = {
          current: status === "*" /* CURRENT */,
          linkedWorkTree: status === "+" /* LINKED */,
          name,
          commit,
          label
        };
      }
    };
  }
});

// src/lib/parsers/parse-branch.ts
function branchStatus(input) {
  return input ? input.charAt(0) : "";
}
function parseBranchSummary(stdOut) {
  return parseStringResponse(new BranchSummaryResult(), parsers9, stdOut);
}
var parsers9;
var init_parse_branch = __esm({
  "src/lib/parsers/parse-branch.ts"() {
    init_BranchSummary();
    init_utils();
    parsers9 = [
      new LineParser(/^([*+]\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/, (result, [current, name, commit, label]) => {
        result.push(branchStatus(current), true, name, commit, label);
      }),
      new LineParser(/^([*+]\s)?(\S+)\s+([a-z0-9]+)\s?(.*)$/s, (result, [current, name, commit, label]) => {
        result.push(branchStatus(current), false, name, commit, label);
      })
    ];
  }
});

// src/lib/tasks/branch.ts
var branch_exports = {};
__export(branch_exports, {
  branchLocalTask: () => branchLocalTask,
  branchTask: () => branchTask,
  containsDeleteBranchCommand: () => containsDeleteBranchCommand,
  deleteBranchTask: () => deleteBranchTask,
  deleteBranchesTask: () => deleteBranchesTask
});
function containsDeleteBranchCommand(commands) {
  const deleteCommands = ["-d", "-D", "--delete"];
  return commands.some((command) => deleteCommands.includes(command));
}
function branchTask(customArgs) {
  const isDelete = containsDeleteBranchCommand(customArgs);
  const commands = ["branch", ...customArgs];
  if (commands.length === 1) {
    commands.push("-a");
  }
  if (!commands.includes("-v")) {
    commands.splice(1, 0, "-v");
  }
  return {
    format: "utf-8",
    commands,
    parser(stdOut, stdErr) {
      if (isDelete) {
        return parseBranchDeletions(stdOut, stdErr).all[0];
      }
      return parseBranchSummary(stdOut);
    }
  };
}
function branchLocalTask() {
  const parser3 = parseBranchSummary;
  return {
    format: "utf-8",
    commands: ["branch", "-v"],
    parser: parser3
  };
}
function deleteBranchesTask(branches, forceDelete = false) {
  return {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", ...branches],
    parser(stdOut, stdErr) {
      return parseBranchDeletions(stdOut, stdErr);
    },
    onError({ exitCode, stdOut }, error, done, fail) {
      if (!hasBranchDeletionError(String(error), exitCode)) {
        return fail(error);
      }
      done(stdOut);
    }
  };
}
function deleteBranchTask(branch, forceDelete = false) {
  const task = {
    format: "utf-8",
    commands: ["branch", "-v", forceDelete ? "-D" : "-d", branch],
    parser(stdOut, stdErr) {
      return parseBranchDeletions(stdOut, stdErr).branches[branch];
    },
    onError({ exitCode, stdErr, stdOut }, error, _, fail) {
      if (!hasBranchDeletionError(String(error), exitCode)) {
        return fail(error);
      }
      throw new GitResponseError(task.parser(bufferToString(stdOut), bufferToString(stdErr)), String(error));
    }
  };
  return task;
}
var init_branch = __esm({
  "src/lib/tasks/branch.ts"() {
    init_git_response_error();
    init_parse_branch_delete();
    init_parse_branch();
    init_utils();
  }
});

// src/lib/responses/CheckIgnore.ts
var parseCheckIgnore;
var init_CheckIgnore = __esm({
  "src/lib/responses/CheckIgnore.ts"() {
    parseCheckIgnore = (text) => {
      return text.split(/\n/g).map((line) => line.trim()).filter((file) => !!file);
    };
  }
});

// src/lib/tasks/check-ignore.ts
var check_ignore_exports = {};
__export(check_ignore_exports, {
  checkIgnoreTask: () => checkIgnoreTask
});
function checkIgnoreTask(paths) {
  return {
    commands: ["check-ignore", ...paths],
    format: "utf-8",
    parser: parseCheckIgnore
  };
}
var init_check_ignore = __esm({
  "src/lib/tasks/check-ignore.ts"() {
    init_CheckIgnore();
  }
});

// src/lib/tasks/clone.ts
var clone_exports = {};
__export(clone_exports, {
  cloneMirrorTask: () => cloneMirrorTask,
  cloneTask: () => cloneTask
});
function disallowedCommand(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function cloneTask(repo, directory, customArgs) {
  const commands = ["clone", ...customArgs];
  filterString(repo) && commands.push(repo);
  filterString(directory) && commands.push(directory);
  const banned = commands.find(disallowedCommand);
  if (banned) {
    return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
  }
  return straightThroughStringTask(commands);
}
function cloneMirrorTask(repo, directory, customArgs) {
  append(customArgs, "--mirror");
  return cloneTask(repo, directory, customArgs);
}
var init_clone = __esm({
  "src/lib/tasks/clone.ts"() {
    init_task();
    init_utils();
  }
});

// src/lib/parsers/parse-fetch.ts
function parseFetchResult(stdOut, stdErr) {
  const result = {
    raw: stdOut,
    remote: null,
    branches: [],
    tags: [],
    updated: [],
    deleted: []
  };
  return parseStringResponse(result, parsers10, [stdOut, stdErr]);
}
var parsers10;
var init_parse_fetch = __esm({
  "src/lib/parsers/parse-fetch.ts"() {
    init_utils();
    parsers10 = [
      new LineParser(/From (.+)$/, (result, [remote]) => {
        result.remote = remote;
      }),
      new LineParser(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.branches.push({
          name,
          tracking
        });
      }),
      new LineParser(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.tags.push({
          name,
          tracking
        });
      }),
      new LineParser(/- \[deleted]\s+\S+\s*-> (.+)$/, (result, [tracking]) => {
        result.deleted.push({
          tracking
        });
      }),
      new LineParser(/\s*([^.]+)\.\.(\S+)\s+(\S+)\s*-> (.+)$/, (result, [from, to, name, tracking]) => {
        result.updated.push({
          name,
          tracking,
          to,
          from
        });
      })
    ];
  }
});

// src/lib/tasks/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  fetchTask: () => fetchTask
});
function disallowedCommand2(command) {
  return /^--upload-pack(=|$)/.test(command);
}
function fetchTask(remote, branch, customArgs) {
  const commands = ["fetch", ...customArgs];
  if (remote && branch) {
    commands.push(remote, branch);
  }
  const banned = commands.find(disallowedCommand2);
  if (banned) {
    return configurationErrorTask(`git.fetch: potential exploit argument blocked.`);
  }
  return {
    commands,
    format: "utf-8",
    parser: parseFetchResult
  };
}
var init_fetch = __esm({
  "src/lib/tasks/fetch.ts"() {
    init_parse_fetch();
    init_task();
  }
});

// src/lib/parsers/parse-move.ts
function parseMoveResult(stdOut) {
  return parseStringResponse({ moves: [] }, parsers11, stdOut);
}
var parsers11;
var init_parse_move = __esm({
  "src/lib/parsers/parse-move.ts"() {
    init_utils();
    parsers11 = [
      new LineParser(/^Renaming (.+) to (.+)$/, (result, [from, to]) => {
        result.moves.push({ from, to });
      })
    ];
  }
});

// src/lib/tasks/move.ts
var move_exports = {};
__export(move_exports, {
  moveTask: () => moveTask
});
function moveTask(from, to) {
  return {
    commands: ["mv", "-v", ...asArray(from), to],
    format: "utf-8",
    parser: parseMoveResult
  };
}
var init_move = __esm({
  "src/lib/tasks/move.ts"() {
    init_parse_move();
    init_utils();
  }
});

// src/lib/tasks/pull.ts
var pull_exports = {};
__export(pull_exports, {
  pullTask: () => pullTask
});
function pullTask(remote, branch, customArgs) {
  const commands = ["pull", ...customArgs];
  if (remote && branch) {
    commands.splice(1, 0, remote, branch);
  }
  return {
    commands,
    format: "utf-8",
    parser(stdOut, stdErr) {
      return parsePullResult(stdOut, stdErr);
    },
    onError(result, _error, _done, fail) {
      const pullError = parsePullErrorResult(bufferToString(result.stdOut), bufferToString(result.stdErr));
      if (pullError) {
        return fail(new GitResponseError(pullError));
      }
      fail(_error);
    }
  };
}
var init_pull = __esm({
  "src/lib/tasks/pull.ts"() {
    init_git_response_error();
    init_parse_pull();
    init_utils();
  }
});

// src/lib/responses/GetRemoteSummary.ts
function parseGetRemotes(text) {
  const remotes = {};
  forEach(text, ([name]) => remotes[name] = { name });
  return Object.values(remotes);
}
function parseGetRemotesVerbose(text) {
  const remotes = {};
  forEach(text, ([name, url, purpose]) => {
    if (!remotes.hasOwnProperty(name)) {
      remotes[name] = {
        name,
        refs: { fetch: "", push: "" }
      };
    }
    if (purpose && url) {
      remotes[name].refs[purpose.replace(/[^a-z]/g, "")] = url;
    }
  });
  return Object.values(remotes);
}
function forEach(text, handler) {
  forEachLineWithContent(text, (line) => handler(line.split(/\s+/)));
}
var init_GetRemoteSummary = __esm({
  "src/lib/responses/GetRemoteSummary.ts"() {
    init_utils();
  }
});

// src/lib/tasks/remote.ts
var remote_exports = {};
__export(remote_exports, {
  addRemoteTask: () => addRemoteTask,
  getRemotesTask: () => getRemotesTask,
  listRemotesTask: () => listRemotesTask,
  remoteTask: () => remoteTask,
  removeRemoteTask: () => removeRemoteTask
});
function addRemoteTask(remoteName, remoteRepo, customArgs = []) {
  return straightThroughStringTask(["remote", "add", ...customArgs, remoteName, remoteRepo]);
}
function getRemotesTask(verbose) {
  const commands = ["remote"];
  if (verbose) {
    commands.push("-v");
  }
  return {
    commands,
    format: "utf-8",
    parser: verbose ? parseGetRemotesVerbose : parseGetRemotes
  };
}
function listRemotesTask(customArgs = []) {
  const commands = [...customArgs];
  if (commands[0] !== "ls-remote") {
    commands.unshift("ls-remote");
  }
  return straightThroughStringTask(commands);
}
function remoteTask(customArgs = []) {
  const commands = [...customArgs];
  if (commands[0] !== "remote") {
    commands.unshift("remote");
  }
  return straightThroughStringTask(commands);
}
function removeRemoteTask(remoteName) {
  return straightThroughStringTask(["remote", "remove", remoteName]);
}
var init_remote = __esm({
  "src/lib/tasks/remote.ts"() {
    init_GetRemoteSummary();
    init_task();
  }
});

// src/lib/tasks/stash-list.ts
var stash_list_exports = {};
__export(stash_list_exports, {
  stashListTask: () => stashListTask
});
function stashListTask(opt = {}, customArgs) {
  const options = parseLogOptions(opt);
  const commands = ["stash", "list", ...options.commands, ...customArgs];
  const parser3 = createListLogSummaryParser(options.splitter, options.fields, logFormatFromCommand(commands));
  return validateLogFormatConfig(commands) || {
    commands,
    format: "utf-8",
    parser: parser3
  };
}
var init_stash_list = __esm({
  "src/lib/tasks/stash-list.ts"() {
    init_log_format();
    init_parse_list_log_summary();
    init_diff();
    init_log();
  }
});

// src/lib/tasks/sub-module.ts
var sub_module_exports = {};
__export(sub_module_exports, {
  addSubModuleTask: () => addSubModuleTask,
  initSubModuleTask: () => initSubModuleTask,
  subModuleTask: () => subModuleTask,
  updateSubModuleTask: () => updateSubModuleTask
});
function addSubModuleTask(repo, path) {
  return subModuleTask(["add", repo, path]);
}
function initSubModuleTask(customArgs) {
  return subModuleTask(["init", ...customArgs]);
}
function subModuleTask(customArgs) {
  const commands = [...customArgs];
  if (commands[0] !== "submodule") {
    commands.unshift("submodule");
  }
  return straightThroughStringTask(commands);
}
function updateSubModuleTask(customArgs) {
  return subModuleTask(["update", ...customArgs]);
}
var init_sub_module = __esm({
  "src/lib/tasks/sub-module.ts"() {
    init_task();
  }
});

// src/lib/responses/TagList.ts
function singleSorted(a, b) {
  const aIsNum = isNaN(a);
  const bIsNum = isNaN(b);
  if (aIsNum !== bIsNum) {
    return aIsNum ? 1 : -1;
  }
  return aIsNum ? sorted(a, b) : 0;
}
function sorted(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
function trimmed(input) {
  return input.trim();
}
function toNumber(input) {
  if (typeof input === "string") {
    return parseInt(input.replace(/^\D+/g, ""), 10) || 0;
  }
  return 0;
}
var TagList, parseTagList;
var init_TagList = __esm({
  "src/lib/responses/TagList.ts"() {
    TagList = class {
      constructor(all, latest) {
        this.all = all;
        this.latest = latest;
      }
    };
    parseTagList = function(data, customSort = false) {
      const tags = data.split("\n").map(trimmed).filter(Boolean);
      if (!customSort) {
        tags.sort(function(tagA, tagB) {
          const partsA = tagA.split(".");
          const partsB = tagB.split(".");
          if (partsA.length === 1 || partsB.length === 1) {
            return singleSorted(toNumber(partsA[0]), toNumber(partsB[0]));
          }
          for (let i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
            const diff = sorted(toNumber(partsA[i]), toNumber(partsB[i]));
            if (diff) {
              return diff;
            }
          }
          return 0;
        });
      }
      const latest = customSort ? tags[0] : [...tags].reverse().find((tag) => tag.indexOf(".") >= 0);
      return new TagList(tags, latest);
    };
  }
});

// src/lib/tasks/tag.ts
var tag_exports = {};
__export(tag_exports, {
  addAnnotatedTagTask: () => addAnnotatedTagTask,
  addTagTask: () => addTagTask,
  tagListTask: () => tagListTask
});
function tagListTask(customArgs = []) {
  const hasCustomSort = customArgs.some((option) => /^--sort=/.test(option));
  return {
    format: "utf-8",
    commands: ["tag", "-l", ...customArgs],
    parser(text) {
      return parseTagList(text, hasCustomSort);
    }
  };
}
function addTagTask(name) {
  return {
    format: "utf-8",
    commands: ["tag", name],
    parser() {
      return { name };
    }
  };
}
function addAnnotatedTagTask(name, tagMessage) {
  return {
    format: "utf-8",
    commands: ["tag", "-a", "-m", tagMessage, name],
    parser() {
      return { name };
    }
  };
}
var init_tag = __esm({
  "src/lib/tasks/tag.ts"() {
    init_TagList();
  }
});

// src/git.js
var require_git = __commonJS({
  "src/git.js"(exports2, module2) {
    var { GitExecutor: GitExecutor2 } = (init_git_executor(), __toCommonJS(git_executor_exports));
    var { SimpleGitApi: SimpleGitApi2 } = (init_simple_git_api(), __toCommonJS(simple_git_api_exports));
    var { Scheduler: Scheduler2 } = (init_scheduler(), __toCommonJS(scheduler_exports));
    var { configurationErrorTask: configurationErrorTask2 } = (init_task(), __toCommonJS(task_exports));
    var {
      asArray: asArray2,
      filterArray: filterArray2,
      filterPrimitives: filterPrimitives2,
      filterString: filterString2,
      filterStringOrStringArray: filterStringOrStringArray2,
      filterType: filterType2,
      getTrailingOptions: getTrailingOptions2,
      trailingFunctionArgument: trailingFunctionArgument2,
      trailingOptionsArgument: trailingOptionsArgument2
    } = (init_utils(), __toCommonJS(utils_exports));
    var { applyPatchTask: applyPatchTask2 } = (init_apply_patch(), __toCommonJS(apply_patch_exports));
    var {
      branchTask: branchTask2,
      branchLocalTask: branchLocalTask2,
      deleteBranchesTask: deleteBranchesTask2,
      deleteBranchTask: deleteBranchTask2
    } = (init_branch(), __toCommonJS(branch_exports));
    var { checkIgnoreTask: checkIgnoreTask2 } = (init_check_ignore(), __toCommonJS(check_ignore_exports));
    var { checkIsRepoTask: checkIsRepoTask2 } = (init_check_is_repo(), __toCommonJS(check_is_repo_exports));
    var { cloneTask: cloneTask2, cloneMirrorTask: cloneMirrorTask2 } = (init_clone(), __toCommonJS(clone_exports));
    var { cleanWithOptionsTask: cleanWithOptionsTask2, isCleanOptionsArray: isCleanOptionsArray2 } = (init_clean(), __toCommonJS(clean_exports));
    var { diffSummaryTask: diffSummaryTask2 } = (init_diff(), __toCommonJS(diff_exports));
    var { fetchTask: fetchTask2 } = (init_fetch(), __toCommonJS(fetch_exports));
    var { moveTask: moveTask2 } = (init_move(), __toCommonJS(move_exports));
    var { pullTask: pullTask2 } = (init_pull(), __toCommonJS(pull_exports));
    var { pushTagsTask: pushTagsTask2 } = (init_push(), __toCommonJS(push_exports));
    var {
      addRemoteTask: addRemoteTask2,
      getRemotesTask: getRemotesTask2,
      listRemotesTask: listRemotesTask2,
      remoteTask: remoteTask2,
      removeRemoteTask: removeRemoteTask2
    } = (init_remote(), __toCommonJS(remote_exports));
    var { getResetMode: getResetMode2, resetTask: resetTask2 } = (init_reset(), __toCommonJS(reset_exports));
    var { stashListTask: stashListTask2 } = (init_stash_list(), __toCommonJS(stash_list_exports));
    var {
      addSubModuleTask: addSubModuleTask2,
      initSubModuleTask: initSubModuleTask2,
      subModuleTask: subModuleTask2,
      updateSubModuleTask: updateSubModuleTask2
    } = (init_sub_module(), __toCommonJS(sub_module_exports));
    var { addAnnotatedTagTask: addAnnotatedTagTask2, addTagTask: addTagTask2, tagListTask: tagListTask2 } = (init_tag(), __toCommonJS(tag_exports));
    var { straightThroughBufferTask: straightThroughBufferTask2, straightThroughStringTask: straightThroughStringTask2 } = (init_task(), __toCommonJS(task_exports));
    function Git2(options, plugins) {
      this._executor = new GitExecutor2(options.binary, options.baseDir, new Scheduler2(options.maxConcurrentProcesses), plugins);
      this._trimmed = options.trimmed;
    }
    (Git2.prototype = Object.create(SimpleGitApi2.prototype)).constructor = Git2;
    Git2.prototype.customBinary = function(command) {
      this._executor.binary = command;
      return this;
    };
    Git2.prototype.env = function(name, value) {
      if (arguments.length === 1 && typeof name === "object") {
        this._executor.env = name;
      } else {
        (this._executor.env = this._executor.env || {})[name] = value;
      }
      return this;
    };
    Git2.prototype.stashList = function(options) {
      return this._runTask(stashListTask2(trailingOptionsArgument2(arguments) || {}, filterArray2(options) && options || []), trailingFunctionArgument2(arguments));
    };
    function createCloneTask(api, task, repoPath, localPath) {
      if (typeof repoPath !== "string") {
        return configurationErrorTask2(`git.${api}() requires a string 'repoPath'`);
      }
      return task(repoPath, filterType2(localPath, filterString2), getTrailingOptions2(arguments));
    }
    Git2.prototype.clone = function() {
      return this._runTask(createCloneTask("clone", cloneTask2, ...arguments), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.mirror = function() {
      return this._runTask(createCloneTask("mirror", cloneMirrorTask2, ...arguments), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.mv = function(from, to) {
      return this._runTask(moveTask2(from, to), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.checkoutLatestTag = function(then) {
      var git = this;
      return this.pull(function() {
        git.tags(function(err, tags) {
          git.checkout(tags.latest, then);
        });
      });
    };
    Git2.prototype.pull = function(remote, branch, options, then) {
      return this._runTask(pullTask2(filterType2(remote, filterString2), filterType2(branch, filterString2), getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.fetch = function(remote, branch) {
      return this._runTask(fetchTask2(filterType2(remote, filterString2), filterType2(branch, filterString2), getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.silent = function(silence) {
      console.warn("simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3");
      return this;
    };
    Git2.prototype.tags = function(options, then) {
      return this._runTask(tagListTask2(getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.rebase = function() {
      return this._runTask(straightThroughStringTask2(["rebase", ...getTrailingOptions2(arguments)]), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.reset = function(mode) {
      return this._runTask(resetTask2(getResetMode2(mode), getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.revert = function(commit) {
      const next = trailingFunctionArgument2(arguments);
      if (typeof commit !== "string") {
        return this._runTask(configurationErrorTask2("Commit must be a string"), next);
      }
      return this._runTask(straightThroughStringTask2(["revert", ...getTrailingOptions2(arguments, 0, true), commit]), next);
    };
    Git2.prototype.addTag = function(name) {
      const task = typeof name === "string" ? addTagTask2(name) : configurationErrorTask2("Git.addTag requires a tag name");
      return this._runTask(task, trailingFunctionArgument2(arguments));
    };
    Git2.prototype.addAnnotatedTag = function(tagName, tagMessage) {
      return this._runTask(addAnnotatedTagTask2(tagName, tagMessage), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.deleteLocalBranch = function(branchName, forceDelete, then) {
      return this._runTask(deleteBranchTask2(branchName, typeof forceDelete === "boolean" ? forceDelete : false), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.deleteLocalBranches = function(branchNames, forceDelete, then) {
      return this._runTask(deleteBranchesTask2(branchNames, typeof forceDelete === "boolean" ? forceDelete : false), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.branch = function(options, then) {
      return this._runTask(branchTask2(getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.branchLocal = function(then) {
      return this._runTask(branchLocalTask2(), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.raw = function(commands) {
      const createRestCommands = !Array.isArray(commands);
      const command = [].slice.call(createRestCommands ? arguments : commands, 0);
      for (let i = 0; i < command.length && createRestCommands; i++) {
        if (!filterPrimitives2(command[i])) {
          command.splice(i, command.length - i);
          break;
        }
      }
      command.push(...getTrailingOptions2(arguments, 0, true));
      var next = trailingFunctionArgument2(arguments);
      if (!command.length) {
        return this._runTask(configurationErrorTask2("Raw: must supply one or more command to execute"), next);
      }
      return this._runTask(straightThroughStringTask2(command, this._trimmed), next);
    };
    Git2.prototype.submoduleAdd = function(repo, path, then) {
      return this._runTask(addSubModuleTask2(repo, path), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.submoduleUpdate = function(args, then) {
      return this._runTask(updateSubModuleTask2(getTrailingOptions2(arguments, true)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.submoduleInit = function(args, then) {
      return this._runTask(initSubModuleTask2(getTrailingOptions2(arguments, true)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.subModule = function(options, then) {
      return this._runTask(subModuleTask2(getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.listRemote = function() {
      return this._runTask(listRemotesTask2(getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.addRemote = function(remoteName, remoteRepo, then) {
      return this._runTask(addRemoteTask2(remoteName, remoteRepo, getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.removeRemote = function(remoteName, then) {
      return this._runTask(removeRemoteTask2(remoteName), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.getRemotes = function(verbose, then) {
      return this._runTask(getRemotesTask2(verbose === true), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.remote = function(options, then) {
      return this._runTask(remoteTask2(getTrailingOptions2(arguments)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.tag = function(options, then) {
      const command = getTrailingOptions2(arguments);
      if (command[0] !== "tag") {
        command.unshift("tag");
      }
      return this._runTask(straightThroughStringTask2(command), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.updateServerInfo = function(then) {
      return this._runTask(straightThroughStringTask2(["update-server-info"]), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.pushTags = function(remote, then) {
      const task = pushTagsTask2({ remote: filterType2(remote, filterString2) }, getTrailingOptions2(arguments));
      return this._runTask(task, trailingFunctionArgument2(arguments));
    };
    Git2.prototype.rm = function(files) {
      return this._runTask(straightThroughStringTask2(["rm", "-f", ...asArray2(files)]), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.rmKeepLocal = function(files) {
      return this._runTask(straightThroughStringTask2(["rm", "--cached", ...asArray2(files)]), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.catFile = function(options, then) {
      return this._catFile("utf-8", arguments);
    };
    Git2.prototype.binaryCatFile = function() {
      return this._catFile("buffer", arguments);
    };
    Git2.prototype._catFile = function(format, args) {
      var handler = trailingFunctionArgument2(args);
      var command = ["cat-file"];
      var options = args[0];
      if (typeof options === "string") {
        return this._runTask(configurationErrorTask2("Git.catFile: options must be supplied as an array of strings"), handler);
      }
      if (Array.isArray(options)) {
        command.push.apply(command, options);
      }
      const task = format === "buffer" ? straightThroughBufferTask2(command) : straightThroughStringTask2(command);
      return this._runTask(task, handler);
    };
    Git2.prototype.diff = function(options, then) {
      const task = filterString2(options) ? configurationErrorTask2("git.diff: supplying options as a single string is no longer supported, switch to an array of strings") : straightThroughStringTask2(["diff", ...getTrailingOptions2(arguments)]);
      return this._runTask(task, trailingFunctionArgument2(arguments));
    };
    Git2.prototype.diffSummary = function() {
      return this._runTask(diffSummaryTask2(getTrailingOptions2(arguments, 1)), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.applyPatch = function(patches) {
      const task = !filterStringOrStringArray2(patches) ? configurationErrorTask2(`git.applyPatch requires one or more string patches as the first argument`) : applyPatchTask2(asArray2(patches), getTrailingOptions2([].slice.call(arguments, 1)));
      return this._runTask(task, trailingFunctionArgument2(arguments));
    };
    Git2.prototype.revparse = function() {
      const commands = ["rev-parse", ...getTrailingOptions2(arguments, true)];
      return this._runTask(straightThroughStringTask2(commands, true), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.clean = function(mode, options, then) {
      const usingCleanOptionsArray = isCleanOptionsArray2(mode);
      const cleanMode = usingCleanOptionsArray && mode.join("") || filterType2(mode, filterString2) || "";
      const customArgs = getTrailingOptions2([].slice.call(arguments, usingCleanOptionsArray ? 1 : 0));
      return this._runTask(cleanWithOptionsTask2(cleanMode, customArgs), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.exec = function(then) {
      const task = {
        commands: [],
        format: "utf-8",
        parser() {
          if (typeof then === "function") {
            then();
          }
        }
      };
      return this._runTask(task);
    };
    Git2.prototype.clearQueue = function() {
      return this;
    };
    Git2.prototype.checkIgnore = function(pathnames, then) {
      return this._runTask(checkIgnoreTask2(asArray2(filterType2(pathnames, filterStringOrStringArray2, []))), trailingFunctionArgument2(arguments));
    };
    Git2.prototype.checkIsRepo = function(checkType, then) {
      return this._runTask(checkIsRepoTask2(filterType2(checkType, filterString2)), trailingFunctionArgument2(arguments));
    };
    module2.exports = Git2;
  }
});

// src/lib/git-factory.ts
var git_factory_exports = {};
__export(git_factory_exports, {
  esModuleFactory: () => esModuleFactory,
  gitExportFactory: () => gitExportFactory,
  gitInstanceFactory: () => gitInstanceFactory
});
function esModuleFactory(defaultExport) {
  return Object.defineProperties(defaultExport, {
    __esModule: { value: true },
    default: { value: defaultExport }
  });
}
function gitExportFactory(factory) {
  return Object.assign(factory.bind(null), api_exports);
}
function gitInstanceFactory(baseDir, options) {
  const plugins = new PluginStore();
  const config = createInstanceConfig(baseDir && (typeof baseDir === "string" ? { baseDir } : baseDir) || {}, options);
  if (!folderExists(config.baseDir)) {
    throw new GitConstructError(config, `Cannot use simple-git on a directory that does not exist`);
  }
  if (Array.isArray(config.config)) {
    plugins.add(commandConfigPrefixingPlugin(config.config));
  }
  plugins.add(blockUnsafeOperationsPlugin(config.unsafe));
  plugins.add(suffixPathsPlugin());
  plugins.add(completionDetectionPlugin(config.completion));
  config.abort && plugins.add(abortPlugin(config.abort));
  config.progress && plugins.add(progressMonitorPlugin(config.progress));
  config.timeout && plugins.add(timeoutPlugin(config.timeout));
  config.spawnOptions && plugins.add(spawnOptionsPlugin(config.spawnOptions));
  plugins.add(errorDetectionPlugin(errorDetectionHandler(true)));
  config.errors && plugins.add(errorDetectionPlugin(config.errors));
  return new Git(config, plugins);
}
var Git;
var init_git_factory = __esm({
  "src/lib/git-factory.ts"() {
    init_api();
    init_plugins();
    init_suffix_paths_plugin();
    init_utils();
    Git = require_git();
  }
});

// src/lib/runners/promise-wrapped.ts
var promise_wrapped_exports = {};
__export(promise_wrapped_exports, {
  gitP: () => gitP
});
function gitP(...args) {
  let git;
  let chain = Promise.resolve();
  try {
    git = gitInstanceFactory(...args);
  } catch (e) {
    chain = Promise.reject(e);
  }
  function builderReturn() {
    return promiseApi;
  }
  function chainReturn() {
    return chain;
  }
  const promiseApi = [...functionNamesBuilderApi, ...functionNamesPromiseApi].reduce((api, name) => {
    const isAsync = functionNamesPromiseApi.includes(name);
    const valid = isAsync ? asyncWrapper(name, git) : syncWrapper(name, git, api);
    const alternative = isAsync ? chainReturn : builderReturn;
    Object.defineProperty(api, name, {
      enumerable: false,
      configurable: false,
      value: git ? valid : alternative
    });
    return api;
  }, {});
  return promiseApi;
  function asyncWrapper(fn, git2) {
    return function(...args2) {
      if (typeof args2[args2.length] === "function") {
        throw new TypeError("Promise interface requires that handlers are not supplied inline, trailing function not allowed in call to " + fn);
      }
      return chain.then(function() {
        return new Promise(function(resolve, reject) {
          const callback = (err, result) => {
            if (err) {
              return reject(toError(err));
            }
            resolve(result);
          };
          args2.push(callback);
          git2[fn].apply(git2, args2);
        });
      });
    };
  }
  function syncWrapper(fn, git2, api) {
    return (...args2) => {
      git2[fn](...args2);
      return api;
    };
  }
}
function toError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "string") {
    return new Error(error);
  }
  return new GitResponseError(error);
}
var functionNamesBuilderApi, functionNamesPromiseApi;
var init_promise_wrapped = __esm({
  "src/lib/runners/promise-wrapped.ts"() {
    init_git_response_error();
    init_git_factory();
    functionNamesBuilderApi = ["customBinary", "env", "outputHandler", "silent"];
    functionNamesPromiseApi = [
      "add",
      "addAnnotatedTag",
      "addConfig",
      "addRemote",
      "addTag",
      "applyPatch",
      "binaryCatFile",
      "branch",
      "branchLocal",
      "catFile",
      "checkIgnore",
      "checkIsRepo",
      "checkout",
      "checkoutBranch",
      "checkoutLatestTag",
      "checkoutLocalBranch",
      "clean",
      "clone",
      "commit",
      "cwd",
      "deleteLocalBranch",
      "deleteLocalBranches",
      "diff",
      "diffSummary",
      "exec",
      "fetch",
      "getRemotes",
      "init",
      "listConfig",
      "listRemote",
      "log",
      "merge",
      "mergeFromTo",
      "mirror",
      "mv",
      "pull",
      "push",
      "pushTags",
      "raw",
      "rebase",
      "remote",
      "removeRemote",
      "reset",
      "revert",
      "revparse",
      "rm",
      "rmKeepLocal",
      "show",
      "stash",
      "stashList",
      "status",
      "subModule",
      "submoduleAdd",
      "submoduleInit",
      "submoduleUpdate",
      "tag",
      "tags",
      "updateServerInfo"
    ];
  }
});

// src/index.js
var { gitP: gitP2 } = (init_promise_wrapped(), __toCommonJS(promise_wrapped_exports));
var { esModuleFactory: esModuleFactory2, gitInstanceFactory: gitInstanceFactory2, gitExportFactory: gitExportFactory2 } = (init_git_factory(), __toCommonJS(git_factory_exports));
var simpleGit = esModuleFactory2(gitExportFactory2(gitInstanceFactory2));
module.exports = Object.assign(simpleGit, { gitP: gitP2, simpleGit });
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2037);
const tty = __nccwpck_require__(6224);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 4256:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var punycode = __nccwpck_require__(5477);
var mappingTable = __nccwpck_require__(2020);

var PROCESSING_OPTIONS = {
  TRANSITIONAL: 0,
  NONTRANSITIONAL: 1
};

function normalize(str) { // fix bug in v8
  return str.split('\u0000').map(function (s) { return s.normalize('NFC'); }).join('\u0000');
}

function findStatus(val) {
  var start = 0;
  var end = mappingTable.length - 1;

  while (start <= end) {
    var mid = Math.floor((start + end) / 2);

    var target = mappingTable[mid];
    if (target[0][0] <= val && target[0][1] >= val) {
      return target;
    } else if (target[0][0] > val) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return null;
}

var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

function countSymbols(string) {
  return string
    // replace every surrogate pair with a BMP symbol
    .replace(regexAstralSymbols, '_')
    // then get the length
    .length;
}

function mapChars(domain_name, useSTD3, processing_option) {
  var hasError = false;
  var processed = "";

  var len = countSymbols(domain_name);
  for (var i = 0; i < len; ++i) {
    var codePoint = domain_name.codePointAt(i);
    var status = findStatus(codePoint);

    switch (status[1]) {
      case "disallowed":
        hasError = true;
        processed += String.fromCodePoint(codePoint);
        break;
      case "ignored":
        break;
      case "mapped":
        processed += String.fromCodePoint.apply(String, status[2]);
        break;
      case "deviation":
        if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
          processed += String.fromCodePoint.apply(String, status[2]);
        } else {
          processed += String.fromCodePoint(codePoint);
        }
        break;
      case "valid":
        processed += String.fromCodePoint(codePoint);
        break;
      case "disallowed_STD3_mapped":
        if (useSTD3) {
          hasError = true;
          processed += String.fromCodePoint(codePoint);
        } else {
          processed += String.fromCodePoint.apply(String, status[2]);
        }
        break;
      case "disallowed_STD3_valid":
        if (useSTD3) {
          hasError = true;
        }

        processed += String.fromCodePoint(codePoint);
        break;
    }
  }

  return {
    string: processed,
    error: hasError
  };
}

var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;

function validateLabel(label, processing_option) {
  if (label.substr(0, 4) === "xn--") {
    label = punycode.toUnicode(label);
    processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
  }

  var error = false;

  if (normalize(label) !== label ||
      (label[3] === "-" && label[4] === "-") ||
      label[0] === "-" || label[label.length - 1] === "-" ||
      label.indexOf(".") !== -1 ||
      label.search(combiningMarksRegex) === 0) {
    error = true;
  }

  var len = countSymbols(label);
  for (var i = 0; i < len; ++i) {
    var status = findStatus(label.codePointAt(i));
    if ((processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid") ||
        (processing === PROCESSING_OPTIONS.NONTRANSITIONAL &&
         status[1] !== "valid" && status[1] !== "deviation")) {
      error = true;
      break;
    }
  }

  return {
    label: label,
    error: error
  };
}

function processing(domain_name, useSTD3, processing_option) {
  var result = mapChars(domain_name, useSTD3, processing_option);
  result.string = normalize(result.string);

  var labels = result.string.split(".");
  for (var i = 0; i < labels.length; ++i) {
    try {
      var validation = validateLabel(labels[i]);
      labels[i] = validation.label;
      result.error = result.error || validation.error;
    } catch(e) {
      result.error = true;
    }
  }

  return {
    string: labels.join("."),
    error: result.error
  };
}

module.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
  var result = processing(domain_name, useSTD3, processing_option);
  var labels = result.string.split(".");
  labels = labels.map(function(l) {
    try {
      return punycode.toASCII(l);
    } catch(e) {
      result.error = true;
      return l;
    }
  });

  if (verifyDnsLength) {
    var total = labels.slice(0, labels.length - 1).join(".").length;
    if (total.length > 253 || total.length === 0) {
      result.error = true;
    }

    for (var i=0; i < labels.length; ++i) {
      if (labels.length > 63 || labels.length === 0) {
        result.error = true;
        break;
      }
    }
  }

  if (result.error) return null;
  return labels.join(".");
};

module.exports.toUnicode = function(domain_name, useSTD3) {
  var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);

  return {
    domain: result.string,
    error: result.error
  };
};

module.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 4886:
/***/ ((module) => {

"use strict";


var conversions = {};
module.exports = conversions;

function sign(x) {
    return x < 0 ? -1 : 1;
}

function evenRound(x) {
    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
    if ((x % 1) === 0.5 && (x & 1) === 0) { // [even number].5; round down (i.e. floor)
        return Math.floor(x);
    } else {
        return Math.round(x);
    }
}

function createNumberConversion(bitLength, typeOpts) {
    if (!typeOpts.unsigned) {
        --bitLength;
    }
    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
    const upperBound = Math.pow(2, bitLength) - 1;

    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);

    return function(V, opts) {
        if (!opts) opts = {};

        let x = +V;

        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw new TypeError("Argument is not a finite number");
            }

            x = sign(x) * Math.floor(Math.abs(x));
            if (x < lowerBound || x > upperBound) {
                throw new TypeError("Argument is not in byte range");
            }

            return x;
        }

        if (!isNaN(x) && opts.clamp) {
            x = evenRound(x);

            if (x < lowerBound) x = lowerBound;
            if (x > upperBound) x = upperBound;
            return x;
        }

        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }

        x = sign(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;

        if (!typeOpts.unsigned && x >= moduloBound) {
            return x - moduloVal;
        } else if (typeOpts.unsigned) {
            if (x < 0) {
              x += moduloVal;
            } else if (x === -0) { // don't return negative zero
              return 0;
            }
        }

        return x;
    }
}

conversions["void"] = function () {
    return undefined;
};

conversions["boolean"] = function (val) {
    return !!val;
};

conversions["byte"] = createNumberConversion(8, { unsigned: false });
conversions["octet"] = createNumberConversion(8, { unsigned: true });

conversions["short"] = createNumberConversion(16, { unsigned: false });
conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });

conversions["long"] = createNumberConversion(32, { unsigned: false });
conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });

conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });

conversions["double"] = function (V) {
    const x = +V;

    if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
    }

    return x;
};

conversions["unrestricted double"] = function (V) {
    const x = +V;

    if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
    }

    return x;
};

// not quite valid, but good enough for JS
conversions["float"] = conversions["double"];
conversions["unrestricted float"] = conversions["unrestricted double"];

conversions["DOMString"] = function (V, opts) {
    if (!opts) opts = {};

    if (opts.treatNullAsEmptyString && V === null) {
        return "";
    }

    return String(V);
};

conversions["ByteString"] = function (V, opts) {
    const x = String(V);
    let c = undefined;
    for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
        if (c > 255) {
            throw new TypeError("Argument is not a valid bytestring");
        }
    }

    return x;
};

conversions["USVString"] = function (V) {
    const S = String(V);
    const n = S.length;
    const U = [];
    for (let i = 0; i < n; ++i) {
        const c = S.charCodeAt(i);
        if (c < 0xD800 || c > 0xDFFF) {
            U.push(String.fromCodePoint(c));
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            U.push(String.fromCodePoint(0xFFFD));
        } else {
            if (i === n - 1) {
                U.push(String.fromCodePoint(0xFFFD));
            } else {
                const d = S.charCodeAt(i + 1);
                if (0xDC00 <= d && d <= 0xDFFF) {
                    const a = c & 0x3FF;
                    const b = d & 0x3FF;
                    U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
                    ++i;
                } else {
                    U.push(String.fromCodePoint(0xFFFD));
                }
            }
        }
    }

    return U.join('');
};

conversions["Date"] = function (V, opts) {
    if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
    }
    if (isNaN(V)) {
        return undefined;
    }

    return V;
};

conversions["RegExp"] = function (V, opts) {
    if (!(V instanceof RegExp)) {
        V = new RegExp(V);
    }

    return V;
};


/***/ }),

/***/ 7537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

const usm = __nccwpck_require__(2158);

exports.implementation = class URLImpl {
  constructor(constructorArgs) {
    const url = constructorArgs[0];
    const base = constructorArgs[1];

    let parsedBase = null;
    if (base !== undefined) {
      parsedBase = usm.basicURLParse(base);
      if (parsedBase === "failure") {
        throw new TypeError("Invalid base URL");
      }
    }

    const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
    if (parsedURL === "failure") {
      throw new TypeError("Invalid URL");
    }

    this._url = parsedURL;

    // TODO: query stuff
  }

  get href() {
    return usm.serializeURL(this._url);
  }

  set href(v) {
    const parsedURL = usm.basicURLParse(v);
    if (parsedURL === "failure") {
      throw new TypeError("Invalid URL");
    }

    this._url = parsedURL;
  }

  get origin() {
    return usm.serializeURLOrigin(this._url);
  }

  get protocol() {
    return this._url.scheme + ":";
  }

  set protocol(v) {
    usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
  }

  get username() {
    return this._url.username;
  }

  set username(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    usm.setTheUsername(this._url, v);
  }

  get password() {
    return this._url.password;
  }

  set password(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    usm.setThePassword(this._url, v);
  }

  get host() {
    const url = this._url;

    if (url.host === null) {
      return "";
    }

    if (url.port === null) {
      return usm.serializeHost(url.host);
    }

    return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
  }

  set host(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
  }

  get hostname() {
    if (this._url.host === null) {
      return "";
    }

    return usm.serializeHost(this._url.host);
  }

  set hostname(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
  }

  get port() {
    if (this._url.port === null) {
      return "";
    }

    return usm.serializeInteger(this._url.port);
  }

  set port(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    if (v === "") {
      this._url.port = null;
    } else {
      usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
    }
  }

  get pathname() {
    if (this._url.cannotBeABaseURL) {
      return this._url.path[0];
    }

    if (this._url.path.length === 0) {
      return "";
    }

    return "/" + this._url.path.join("/");
  }

  set pathname(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    this._url.path = [];
    usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
  }

  get search() {
    if (this._url.query === null || this._url.query === "") {
      return "";
    }

    return "?" + this._url.query;
  }

  set search(v) {
    // TODO: query stuff

    const url = this._url;

    if (v === "") {
      url.query = null;
      return;
    }

    const input = v[0] === "?" ? v.substring(1) : v;
    url.query = "";
    usm.basicURLParse(input, { url, stateOverride: "query" });
  }

  get hash() {
    if (this._url.fragment === null || this._url.fragment === "") {
      return "";
    }

    return "#" + this._url.fragment;
  }

  set hash(v) {
    if (v === "") {
      this._url.fragment = null;
      return;
    }

    const input = v[0] === "#" ? v.substring(1) : v;
    this._url.fragment = "";
    usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
  }

  toJSON() {
    return this.href;
  }
};


/***/ }),

/***/ 3394:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const conversions = __nccwpck_require__(4886);
const utils = __nccwpck_require__(3185);
const Impl = __nccwpck_require__(7537);

const impl = utils.implSymbol;

function URL(url) {
  if (!this || this[impl] || !(this instanceof URL)) {
    throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
  }
  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["USVString"](args[0]);
  if (args[1] !== undefined) {
  args[1] = conversions["USVString"](args[1]);
  }

  module.exports.setup(this, args);
}

URL.prototype.toJSON = function toJSON() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  const args = [];
  for (let i = 0; i < arguments.length && i < 0; ++i) {
    args[i] = arguments[i];
  }
  return this[impl].toJSON.apply(this[impl], args);
};
Object.defineProperty(URL.prototype, "href", {
  get() {
    return this[impl].href;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].href = V;
  },
  enumerable: true,
  configurable: true
});

URL.prototype.toString = function () {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this.href;
};

Object.defineProperty(URL.prototype, "origin", {
  get() {
    return this[impl].origin;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "protocol", {
  get() {
    return this[impl].protocol;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].protocol = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "username", {
  get() {
    return this[impl].username;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].username = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "password", {
  get() {
    return this[impl].password;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].password = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "host", {
  get() {
    return this[impl].host;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].host = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "hostname", {
  get() {
    return this[impl].hostname;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].hostname = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "port", {
  get() {
    return this[impl].port;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].port = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "pathname", {
  get() {
    return this[impl].pathname;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].pathname = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "search", {
  get() {
    return this[impl].search;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].search = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(URL.prototype, "hash", {
  get() {
    return this[impl].hash;
  },
  set(V) {
    V = conversions["USVString"](V);
    this[impl].hash = V;
  },
  enumerable: true,
  configurable: true
});


module.exports = {
  is(obj) {
    return !!obj && obj[impl] instanceof Impl.implementation;
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(URL.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  setup(obj, constructorArgs, privateData) {
    if (!privateData) privateData = {};
    privateData.wrapper = obj;

    obj[impl] = new Impl.implementation(constructorArgs, privateData);
    obj[impl][utils.wrapperSymbol] = obj;
  },
  interface: URL,
  expose: {
    Window: { URL: URL },
    Worker: { URL: URL }
  }
};



/***/ }),

/***/ 8665:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


exports.URL = __nccwpck_require__(3394)["interface"];
exports.serializeURL = __nccwpck_require__(2158).serializeURL;
exports.serializeURLOrigin = __nccwpck_require__(2158).serializeURLOrigin;
exports.basicURLParse = __nccwpck_require__(2158).basicURLParse;
exports.setTheUsername = __nccwpck_require__(2158).setTheUsername;
exports.setThePassword = __nccwpck_require__(2158).setThePassword;
exports.serializeHost = __nccwpck_require__(2158).serializeHost;
exports.serializeInteger = __nccwpck_require__(2158).serializeInteger;
exports.parseURL = __nccwpck_require__(2158).parseURL;


/***/ }),

/***/ 2158:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const punycode = __nccwpck_require__(5477);
const tr46 = __nccwpck_require__(4256);

const specialSchemes = {
  ftp: 21,
  file: null,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

const failure = Symbol("failure");

function countSymbols(str) {
  return punycode.ucs2.decode(str).length;
}

function at(input, idx) {
  const c = input[idx];
  return isNaN(c) ? undefined : String.fromCodePoint(c);
}

function isASCIIDigit(c) {
  return c >= 0x30 && c <= 0x39;
}

function isASCIIAlpha(c) {
  return (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
}

function isASCIIAlphanumeric(c) {
  return isASCIIAlpha(c) || isASCIIDigit(c);
}

function isASCIIHex(c) {
  return isASCIIDigit(c) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66);
}

function isSingleDot(buffer) {
  return buffer === "." || buffer.toLowerCase() === "%2e";
}

function isDoubleDot(buffer) {
  buffer = buffer.toLowerCase();
  return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}

function isWindowsDriveLetterCodePoints(cp1, cp2) {
  return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
}

function isWindowsDriveLetterString(string) {
  return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}

function isNormalizedWindowsDriveLetterString(string) {
  return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}

function containsForbiddenHostCodePoint(string) {
  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
}

function containsForbiddenHostCodePointExcludingPercent(string) {
  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
}

function isSpecialScheme(scheme) {
  return specialSchemes[scheme] !== undefined;
}

function isSpecial(url) {
  return isSpecialScheme(url.scheme);
}

function defaultPort(scheme) {
  return specialSchemes[scheme];
}

function percentEncode(c) {
  let hex = c.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = "0" + hex;
  }

  return "%" + hex;
}

function utf8PercentEncode(c) {
  const buf = new Buffer(c);

  let str = "";

  for (let i = 0; i < buf.length; ++i) {
    str += percentEncode(buf[i]);
  }

  return str;
}

function utf8PercentDecode(str) {
  const input = new Buffer(str);
  const output = [];
  for (let i = 0; i < input.length; ++i) {
    if (input[i] !== 37) {
      output.push(input[i]);
    } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
      output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
      i += 2;
    } else {
      output.push(input[i]);
    }
  }
  return new Buffer(output).toString();
}

function isC0ControlPercentEncode(c) {
  return c <= 0x1F || c > 0x7E;
}

const extraPathPercentEncodeSet = new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
function isPathPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}

const extraUserinfoPercentEncodeSet =
  new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
function isUserinfoPercentEncode(c) {
  return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}

function percentEncodeChar(c, encodeSetPredicate) {
  const cStr = String.fromCodePoint(c);

  if (encodeSetPredicate(c)) {
    return utf8PercentEncode(cStr);
  }

  return cStr;
}

function parseIPv4Number(input) {
  let R = 10;

  if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
    input = input.substring(2);
    R = 16;
  } else if (input.length >= 2 && input.charAt(0) === "0") {
    input = input.substring(1);
    R = 8;
  }

  if (input === "") {
    return 0;
  }

  const regex = R === 10 ? /[^0-9]/ : (R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/);
  if (regex.test(input)) {
    return failure;
  }

  return parseInt(input, R);
}

function parseIPv4(input) {
  const parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    if (parts.length > 1) {
      parts.pop();
    }
  }

  if (parts.length > 4) {
    return input;
  }

  const numbers = [];
  for (const part of parts) {
    if (part === "") {
      return input;
    }
    const n = parseIPv4Number(part);
    if (n === failure) {
      return input;
    }

    numbers.push(n);
  }

  for (let i = 0; i < numbers.length - 1; ++i) {
    if (numbers[i] > 255) {
      return failure;
    }
  }
  if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
    return failure;
  }

  let ipv4 = numbers.pop();
  let counter = 0;

  for (const n of numbers) {
    ipv4 += n * Math.pow(256, 3 - counter);
    ++counter;
  }

  return ipv4;
}

function serializeIPv4(address) {
  let output = "";
  let n = address;

  for (let i = 1; i <= 4; ++i) {
    output = String(n % 256) + output;
    if (i !== 4) {
      output = "." + output;
    }
    n = Math.floor(n / 256);
  }

  return output;
}

function parseIPv6(input) {
  const address = [0, 0, 0, 0, 0, 0, 0, 0];
  let pieceIndex = 0;
  let compress = null;
  let pointer = 0;

  input = punycode.ucs2.decode(input);

  if (input[pointer] === 58) {
    if (input[pointer + 1] !== 58) {
      return failure;
    }

    pointer += 2;
    ++pieceIndex;
    compress = pieceIndex;
  }

  while (pointer < input.length) {
    if (pieceIndex === 8) {
      return failure;
    }

    if (input[pointer] === 58) {
      if (compress !== null) {
        return failure;
      }
      ++pointer;
      ++pieceIndex;
      compress = pieceIndex;
      continue;
    }

    let value = 0;
    let length = 0;

    while (length < 4 && isASCIIHex(input[pointer])) {
      value = value * 0x10 + parseInt(at(input, pointer), 16);
      ++pointer;
      ++length;
    }

    if (input[pointer] === 46) {
      if (length === 0) {
        return failure;
      }

      pointer -= length;

      if (pieceIndex > 6) {
        return failure;
      }

      let numbersSeen = 0;

      while (input[pointer] !== undefined) {
        let ipv4Piece = null;

        if (numbersSeen > 0) {
          if (input[pointer] === 46 && numbersSeen < 4) {
            ++pointer;
          } else {
            return failure;
          }
        }

        if (!isASCIIDigit(input[pointer])) {
          return failure;
        }

        while (isASCIIDigit(input[pointer])) {
          const number = parseInt(at(input, pointer));
          if (ipv4Piece === null) {
            ipv4Piece = number;
          } else if (ipv4Piece === 0) {
            return failure;
          } else {
            ipv4Piece = ipv4Piece * 10 + number;
          }
          if (ipv4Piece > 255) {
            return failure;
          }
          ++pointer;
        }

        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

        ++numbersSeen;

        if (numbersSeen === 2 || numbersSeen === 4) {
          ++pieceIndex;
        }
      }

      if (numbersSeen !== 4) {
        return failure;
      }

      break;
    } else if (input[pointer] === 58) {
      ++pointer;
      if (input[pointer] === undefined) {
        return failure;
      }
    } else if (input[pointer] !== undefined) {
      return failure;
    }

    address[pieceIndex] = value;
    ++pieceIndex;
  }

  if (compress !== null) {
    let swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      const temp = address[compress + swaps - 1];
      address[compress + swaps - 1] = address[pieceIndex];
      address[pieceIndex] = temp;
      --pieceIndex;
      --swaps;
    }
  } else if (compress === null && pieceIndex !== 8) {
    return failure;
  }

  return address;
}

function serializeIPv6(address) {
  let output = "";
  const seqResult = findLongestZeroSequence(address);
  const compress = seqResult.idx;
  let ignore0 = false;

  for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
    if (ignore0 && address[pieceIndex] === 0) {
      continue;
    } else if (ignore0) {
      ignore0 = false;
    }

    if (compress === pieceIndex) {
      const separator = pieceIndex === 0 ? "::" : ":";
      output += separator;
      ignore0 = true;
      continue;
    }

    output += address[pieceIndex].toString(16);

    if (pieceIndex !== 7) {
      output += ":";
    }
  }

  return output;
}

function parseHost(input, isSpecialArg) {
  if (input[0] === "[") {
    if (input[input.length - 1] !== "]") {
      return failure;
    }

    return parseIPv6(input.substring(1, input.length - 1));
  }

  if (!isSpecialArg) {
    return parseOpaqueHost(input);
  }

  const domain = utf8PercentDecode(input);
  const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
  if (asciiDomain === null) {
    return failure;
  }

  if (containsForbiddenHostCodePoint(asciiDomain)) {
    return failure;
  }

  const ipv4Host = parseIPv4(asciiDomain);
  if (typeof ipv4Host === "number" || ipv4Host === failure) {
    return ipv4Host;
  }

  return asciiDomain;
}

function parseOpaqueHost(input) {
  if (containsForbiddenHostCodePointExcludingPercent(input)) {
    return failure;
  }

  let output = "";
  const decoded = punycode.ucs2.decode(input);
  for (let i = 0; i < decoded.length; ++i) {
    output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
  }
  return output;
}

function findLongestZeroSequence(arr) {
  let maxIdx = null;
  let maxLen = 1; // only find elements > 1
  let currStart = null;
  let currLen = 0;

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] !== 0) {
      if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
      }

      currStart = null;
      currLen = 0;
    } else {
      if (currStart === null) {
        currStart = i;
      }
      ++currLen;
    }
  }

  // if trailing zeros
  if (currLen > maxLen) {
    maxIdx = currStart;
    maxLen = currLen;
  }

  return {
    idx: maxIdx,
    len: maxLen
  };
}

function serializeHost(host) {
  if (typeof host === "number") {
    return serializeIPv4(host);
  }

  // IPv6 serializer
  if (host instanceof Array) {
    return "[" + serializeIPv6(host) + "]";
  }

  return host;
}

function trimControlChars(url) {
  return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
}

function trimTabAndNewline(url) {
  return url.replace(/\u0009|\u000A|\u000D/g, "");
}

function shortenPath(url) {
  const path = url.path;
  if (path.length === 0) {
    return;
  }
  if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
    return;
  }

  path.pop();
}

function includesCredentials(url) {
  return url.username !== "" || url.password !== "";
}

function cannotHaveAUsernamePasswordPort(url) {
  return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
}

function isNormalizedWindowsDriveLetter(string) {
  return /^[A-Za-z]:$/.test(string);
}

function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
  this.pointer = 0;
  this.input = input;
  this.base = base || null;
  this.encodingOverride = encodingOverride || "utf-8";
  this.stateOverride = stateOverride;
  this.url = url;
  this.failure = false;
  this.parseError = false;

  if (!this.url) {
    this.url = {
      scheme: "",
      username: "",
      password: "",
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null,

      cannotBeABaseURL: false
    };

    const res = trimControlChars(this.input);
    if (res !== this.input) {
      this.parseError = true;
    }
    this.input = res;
  }

  const res = trimTabAndNewline(this.input);
  if (res !== this.input) {
    this.parseError = true;
  }
  this.input = res;

  this.state = stateOverride || "scheme start";

  this.buffer = "";
  this.atFlag = false;
  this.arrFlag = false;
  this.passwordTokenSeenFlag = false;

  this.input = punycode.ucs2.decode(this.input);

  for (; this.pointer <= this.input.length; ++this.pointer) {
    const c = this.input[this.pointer];
    const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

    // exec state machine
    const ret = this["parse " + this.state](c, cStr);
    if (!ret) {
      break; // terminate algorithm
    } else if (ret === failure) {
      this.failure = true;
      break;
    }
  }
}

URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
  if (isASCIIAlpha(c)) {
    this.buffer += cStr.toLowerCase();
    this.state = "scheme";
  } else if (!this.stateOverride) {
    this.state = "no scheme";
    --this.pointer;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
  if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
    this.buffer += cStr.toLowerCase();
  } else if (c === 58) {
    if (this.stateOverride) {
      if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
        return false;
      }

      if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
        return false;
      }

      if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
        return false;
      }

      if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
        return false;
      }
    }
    this.url.scheme = this.buffer;
    this.buffer = "";
    if (this.stateOverride) {
      return false;
    }
    if (this.url.scheme === "file") {
      if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
        this.parseError = true;
      }
      this.state = "file";
    } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
      this.state = "special relative or authority";
    } else if (isSpecial(this.url)) {
      this.state = "special authority slashes";
    } else if (this.input[this.pointer + 1] === 47) {
      this.state = "path or authority";
      ++this.pointer;
    } else {
      this.url.cannotBeABaseURL = true;
      this.url.path.push("");
      this.state = "cannot-be-a-base-URL path";
    }
  } else if (!this.stateOverride) {
    this.buffer = "";
    this.state = "no scheme";
    this.pointer = -1;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
  if (this.base === null || (this.base.cannotBeABaseURL && c !== 35)) {
    return failure;
  } else if (this.base.cannotBeABaseURL && c === 35) {
    this.url.scheme = this.base.scheme;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    this.url.fragment = "";
    this.url.cannotBeABaseURL = true;
    this.state = "fragment";
  } else if (this.base.scheme === "file") {
    this.state = "file";
    --this.pointer;
  } else {
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
  if (c === 47 && this.input[this.pointer + 1] === 47) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.parseError = true;
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
  if (c === 47) {
    this.state = "authority";
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
  this.url.scheme = this.base.scheme;
  if (isNaN(c)) {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
  } else if (c === 47) {
    this.state = "relative slash";
  } else if (c === 63) {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = "";
    this.state = "query";
  } else if (c === 35) {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    this.url.fragment = "";
    this.state = "fragment";
  } else if (isSpecial(this.url) && c === 92) {
    this.parseError = true;
    this.state = "relative slash";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice(0, this.base.path.length - 1);

    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
  if (isSpecial(this.url) && (c === 47 || c === 92)) {
    if (c === 92) {
      this.parseError = true;
    }
    this.state = "special authority ignore slashes";
  } else if (c === 47) {
    this.state = "authority";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
  if (c === 47 && this.input[this.pointer + 1] === 47) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.parseError = true;
    this.state = "special authority ignore slashes";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
  if (c !== 47 && c !== 92) {
    this.state = "authority";
    --this.pointer;
  } else {
    this.parseError = true;
  }

  return true;
};

URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
  if (c === 64) {
    this.parseError = true;
    if (this.atFlag) {
      this.buffer = "%40" + this.buffer;
    }
    this.atFlag = true;

    // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
    const len = countSymbols(this.buffer);
    for (let pointer = 0; pointer < len; ++pointer) {
      const codePoint = this.buffer.codePointAt(pointer);

      if (codePoint === 58 && !this.passwordTokenSeenFlag) {
        this.passwordTokenSeenFlag = true;
        continue;
      }
      const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
      if (this.passwordTokenSeenFlag) {
        this.url.password += encodedCodePoints;
      } else {
        this.url.username += encodedCodePoints;
      }
    }
    this.buffer = "";
  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
             (isSpecial(this.url) && c === 92)) {
    if (this.atFlag && this.buffer === "") {
      this.parseError = true;
      return failure;
    }
    this.pointer -= countSymbols(this.buffer) + 1;
    this.buffer = "";
    this.state = "host";
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse hostname"] =
URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
  if (this.stateOverride && this.url.scheme === "file") {
    --this.pointer;
    this.state = "file host";
  } else if (c === 58 && !this.arrFlag) {
    if (this.buffer === "") {
      this.parseError = true;
      return failure;
    }

    const host = parseHost(this.buffer, isSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "port";
    if (this.stateOverride === "hostname") {
      return false;
    }
  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
             (isSpecial(this.url) && c === 92)) {
    --this.pointer;
    if (isSpecial(this.url) && this.buffer === "") {
      this.parseError = true;
      return failure;
    } else if (this.stateOverride && this.buffer === "" &&
               (includesCredentials(this.url) || this.url.port !== null)) {
      this.parseError = true;
      return false;
    }

    const host = parseHost(this.buffer, isSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "path start";
    if (this.stateOverride) {
      return false;
    }
  } else {
    if (c === 91) {
      this.arrFlag = true;
    } else if (c === 93) {
      this.arrFlag = false;
    }
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
  if (isASCIIDigit(c)) {
    this.buffer += cStr;
  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
             (isSpecial(this.url) && c === 92) ||
             this.stateOverride) {
    if (this.buffer !== "") {
      const port = parseInt(this.buffer);
      if (port > Math.pow(2, 16) - 1) {
        this.parseError = true;
        return failure;
      }
      this.url.port = port === defaultPort(this.url.scheme) ? null : port;
      this.buffer = "";
    }
    if (this.stateOverride) {
      return false;
    }
    this.state = "path start";
    --this.pointer;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

const fileOtherwiseCodePoints = new Set([47, 92, 63, 35]);

URLStateMachine.prototype["parse file"] = function parseFile(c) {
  this.url.scheme = "file";

  if (c === 47 || c === 92) {
    if (c === 92) {
      this.parseError = true;
    }
    this.state = "file slash";
  } else if (this.base !== null && this.base.scheme === "file") {
    if (isNaN(c)) {
      this.url.host = this.base.host;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
    } else if (c === 63) {
      this.url.host = this.base.host;
      this.url.path = this.base.path.slice();
      this.url.query = "";
      this.state = "query";
    } else if (c === 35) {
      this.url.host = this.base.host;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
      this.url.fragment = "";
      this.state = "fragment";
    } else {
      if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
          !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) ||
          (this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
           !fileOtherwiseCodePoints.has(this.input[this.pointer + 2]))) {
        this.url.host = this.base.host;
        this.url.path = this.base.path.slice();
        shortenPath(this.url);
      } else {
        this.parseError = true;
      }

      this.state = "path";
      --this.pointer;
    }
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
  if (c === 47 || c === 92) {
    if (c === 92) {
      this.parseError = true;
    }
    this.state = "file host";
  } else {
    if (this.base !== null && this.base.scheme === "file") {
      if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
        this.url.path.push(this.base.path[0]);
      } else {
        this.url.host = this.base.host;
      }
    }
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
  if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
    --this.pointer;
    if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
      this.parseError = true;
      this.state = "path";
    } else if (this.buffer === "") {
      this.url.host = "";
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
    } else {
      let host = parseHost(this.buffer, isSpecial(this.url));
      if (host === failure) {
        return failure;
      }
      if (host === "localhost") {
        host = "";
      }
      this.url.host = host;

      if (this.stateOverride) {
        return false;
      }

      this.buffer = "";
      this.state = "path start";
    }
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
  if (isSpecial(this.url)) {
    if (c === 92) {
      this.parseError = true;
    }
    this.state = "path";

    if (c !== 47 && c !== 92) {
      --this.pointer;
    }
  } else if (!this.stateOverride && c === 63) {
    this.url.query = "";
    this.state = "query";
  } else if (!this.stateOverride && c === 35) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c !== undefined) {
    this.state = "path";
    if (c !== 47) {
      --this.pointer;
    }
  }

  return true;
};

URLStateMachine.prototype["parse path"] = function parsePath(c) {
  if (isNaN(c) || c === 47 || (isSpecial(this.url) && c === 92) ||
      (!this.stateOverride && (c === 63 || c === 35))) {
    if (isSpecial(this.url) && c === 92) {
      this.parseError = true;
    }

    if (isDoubleDot(this.buffer)) {
      shortenPath(this.url);
      if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
        this.url.path.push("");
      }
    } else if (isSingleDot(this.buffer) && c !== 47 &&
               !(isSpecial(this.url) && c === 92)) {
      this.url.path.push("");
    } else if (!isSingleDot(this.buffer)) {
      if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
        if (this.url.host !== "" && this.url.host !== null) {
          this.parseError = true;
          this.url.host = "";
        }
        this.buffer = this.buffer[0] + ":";
      }
      this.url.path.push(this.buffer);
    }
    this.buffer = "";
    if (this.url.scheme === "file" && (c === undefined || c === 63 || c === 35)) {
      while (this.url.path.length > 1 && this.url.path[0] === "") {
        this.parseError = true;
        this.url.path.shift();
      }
    }
    if (c === 63) {
      this.url.query = "";
      this.state = "query";
    }
    if (c === 35) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else {
    // TODO: If c is not a URL code point and not "%", parse error.

    if (c === 37 &&
      (!isASCIIHex(this.input[this.pointer + 1]) ||
        !isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.buffer += percentEncodeChar(c, isPathPercentEncode);
  }

  return true;
};

URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
  if (c === 63) {
    this.url.query = "";
    this.state = "query";
  } else if (c === 35) {
    this.url.fragment = "";
    this.state = "fragment";
  } else {
    // TODO: Add: not a URL code point
    if (!isNaN(c) && c !== 37) {
      this.parseError = true;
    }

    if (c === 37 &&
        (!isASCIIHex(this.input[this.pointer + 1]) ||
         !isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    if (!isNaN(c)) {
      this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
    }
  }

  return true;
};

URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
  if (isNaN(c) || (!this.stateOverride && c === 35)) {
    if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
      this.encodingOverride = "utf-8";
    }

    const buffer = new Buffer(this.buffer); // TODO: Use encoding override instead
    for (let i = 0; i < buffer.length; ++i) {
      if (buffer[i] < 0x21 || buffer[i] > 0x7E || buffer[i] === 0x22 || buffer[i] === 0x23 ||
          buffer[i] === 0x3C || buffer[i] === 0x3E) {
        this.url.query += percentEncode(buffer[i]);
      } else {
        this.url.query += String.fromCodePoint(buffer[i]);
      }
    }

    this.buffer = "";
    if (c === 35) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else {
    // TODO: If c is not a URL code point and not "%", parse error.
    if (c === 37 &&
      (!isASCIIHex(this.input[this.pointer + 1]) ||
        !isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
  if (isNaN(c)) { // do nothing
  } else if (c === 0x0) {
    this.parseError = true;
  } else {
    // TODO: If c is not a URL code point and not "%", parse error.
    if (c === 37 &&
      (!isASCIIHex(this.input[this.pointer + 1]) ||
        !isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
  }

  return true;
};

function serializeURL(url, excludeFragment) {
  let output = url.scheme + ":";
  if (url.host !== null) {
    output += "//";

    if (url.username !== "" || url.password !== "") {
      output += url.username;
      if (url.password !== "") {
        output += ":" + url.password;
      }
      output += "@";
    }

    output += serializeHost(url.host);

    if (url.port !== null) {
      output += ":" + url.port;
    }
  } else if (url.host === null && url.scheme === "file") {
    output += "//";
  }

  if (url.cannotBeABaseURL) {
    output += url.path[0];
  } else {
    for (const string of url.path) {
      output += "/" + string;
    }
  }

  if (url.query !== null) {
    output += "?" + url.query;
  }

  if (!excludeFragment && url.fragment !== null) {
    output += "#" + url.fragment;
  }

  return output;
}

function serializeOrigin(tuple) {
  let result = tuple.scheme + "://";
  result += serializeHost(tuple.host);

  if (tuple.port !== null) {
    result += ":" + tuple.port;
  }

  return result;
}

module.exports.serializeURL = serializeURL;

module.exports.serializeURLOrigin = function (url) {
  // https://url.spec.whatwg.org/#concept-url-origin
  switch (url.scheme) {
    case "blob":
      try {
        return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
      } catch (e) {
        // serializing an opaque origin returns "null"
        return "null";
      }
    case "ftp":
    case "gopher":
    case "http":
    case "https":
    case "ws":
    case "wss":
      return serializeOrigin({
        scheme: url.scheme,
        host: url.host,
        port: url.port
      });
    case "file":
      // spec says "exercise to the reader", chrome says "file://"
      return "file://";
    default:
      // serializing an opaque origin returns "null"
      return "null";
  }
};

module.exports.basicURLParse = function (input, options) {
  if (options === undefined) {
    options = {};
  }

  const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
  if (usm.failure) {
    return "failure";
  }

  return usm.url;
};

module.exports.setTheUsername = function (url, username) {
  url.username = "";
  const decoded = punycode.ucs2.decode(username);
  for (let i = 0; i < decoded.length; ++i) {
    url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
  }
};

module.exports.setThePassword = function (url, password) {
  url.password = "";
  const decoded = punycode.ucs2.decode(password);
  for (let i = 0; i < decoded.length; ++i) {
    url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
  }
};

module.exports.serializeHost = serializeHost;

module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;

module.exports.serializeInteger = function (integer) {
  return String(integer);
};

module.exports.parseURL = function (input, options) {
  if (options === undefined) {
    options = {};
  }

  // We don't handle blobs, so this just delegates:
  return module.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
};


/***/ }),

/***/ 3185:
/***/ ((module) => {

"use strict";


module.exports.mixin = function mixin(target, source) {
  const keys = Object.getOwnPropertyNames(source);
  for (let i = 0; i < keys.length; ++i) {
    Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
  }
};

module.exports.wrapperSymbol = Symbol("wrapper");
module.exports.implSymbol = Symbol("impl");

module.exports.wrapperForImpl = function (impl) {
  return impl[module.exports.wrapperSymbol];
};

module.exports.implForWrapper = function (wrapper) {
  return wrapper[module.exports.implSymbol];
};



/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 9084:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.computeCoverage = void 0;
const core = __importStar(__nccwpck_require__(2186));
const glob_1 = __nccwpck_require__(3277);
const path_1 = __importDefault(__nccwpck_require__(1017));
const fs_1 = __nccwpck_require__(7147);
async function computeCoverage(projects, folders) {
    const promises = projects.map(project => {
        return new Promise((resolve, reject) => {
            const branchPath = path_1.default.join(folders.branch, project.path);
            const basePath = path_1.default.join(folders.base, project.path);
            const [branchCoverageFile] = glob_1.glob.globSync(`${branchPath}/**/coverage-summary.json`);
            const [baseCoverageFile] = glob_1.glob.globSync(`${basePath}/**/coverage-summary.json`);
            if (!branchCoverageFile || !baseCoverageFile) {
                core.setFailed(`Could not find coverage-summary.json for ${project.name}`);
                reject();
                return;
            }
            const base = JSON.parse((0, fs_1.readFileSync)(baseCoverageFile).toString());
            const branch = JSON.parse((0, fs_1.readFileSync)(branchCoverageFile).toString());
            const computeCoverage = (base, branch) => {
                return {
                    pct: branch.pct - base.pct,
                    covered: branch.covered - base.covered,
                    skipped: branch.skipped - base.skipped,
                    total: branch.total - base.total,
                    branch
                };
            };
            const compareFiles = (base, branch) => {
                // Added file
                if (!base) {
                    return {
                        branches: branch.branches,
                        functions: branch.functions,
                        lines: branch.lines,
                        statements: branch.statements
                    };
                }
                return {
                    branches: computeCoverage(base.branches, branch.branches),
                    functions: computeCoverage(base.functions, branch.functions),
                    lines: computeCoverage(base.lines, branch.lines),
                    statements: computeCoverage(base.statements, branch.statements)
                };
            };
            const rootDir = process.cwd();
            const baseMap = Object.keys(base).reduce((acc, key) => {
                return {
                    ...acc,
                    [key.replace(folders.base, '.')]: base[key]
                };
            }, {});
            const branchMap = Object.keys(branch).reduce((acc, key) => {
                return {
                    ...acc,
                    [key.replace(rootDir, '.')]: branch[key]
                };
            }, {});
            resolve({
                name: project.name,
                path: project.path,
                coverage: Object.keys(branchMap).reduce((acc, key) => {
                    return {
                        ...acc,
                        [key]: compareFiles(baseMap[key], branchMap[key])
                    };
                }, {})
            });
        });
    });
    return Promise.all(promises);
}
exports.computeCoverage = computeCoverage;


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core = __importStar(__nccwpck_require__(2186));
const pull_branch_1 = __nccwpck_require__(7993);
const prepare_1 = __nccwpck_require__(7294);
const coverage_1 = __nccwpck_require__(9084);
const postMessage_1 = __nccwpck_require__(9717);
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const baseBranch = core.getInput('base') || 'main';
        const commands = core.getInput('commands').split('\n');
        const github_token = core.getInput('token');
        const projects = core
            .getInput('projects')
            .split('\n')
            .map(projectStr => ({
            name: projectStr.split(':')[0],
            path: projectStr.split(':')[1]
        }));
        const folders = {
            branch: '.',
            base: '/tmp/base'
        };
        await (0, pull_branch_1.pullBranch)(github_token, baseBranch, folders.base);
        await (0, prepare_1.prepare)(commands, folders);
        const summaries = await (0, coverage_1.computeCoverage)(projects, folders);
        await (0, postMessage_1.postMessage)(github_token, summaries);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;


/***/ }),

/***/ 9073:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatCoverageNumber = void 0;
const formatCoverageNumber = (info) => {
    const style = info.pct === 0
        ? ''
        : info.pct < 0
            ? 'color:red;font-weight:bold'
            : 'color:green;font-weight:bold';
    const symbol = info.pct === 0 ? '' : info.pct < 0 ? '+' : '-';
    const num = Math.abs(info.pct).toFixed(2);
    return `<span style="${style}">${symbol} ${num}<span> (${info.branch.pct.toFixed(2)}%)`;
};
exports.formatCoverageNumber = formatCoverageNumber;


/***/ }),

/***/ 9717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.postMessage = void 0;
const core = __importStar(__nccwpck_require__(2186));
const github = __importStar(__nccwpck_require__(5438));
const markdown_table_ts_1 = __nccwpck_require__(2075);
const format_1 = __nccwpck_require__(9073);
const messageStart = 'Noodly Coverage!\n';
async function postMessage(token, summaries) {
    const context = github.context;
    if (context.payload.pull_request == null) {
        core.setFailed('No pull request found.');
        return;
    }
    const pull_request_number = context.payload.pull_request.number;
    const octokit = github.getOctokit(token);
    const existingComments = await octokit.rest.issues.listComments({
        ...context.repo,
        issue_number: pull_request_number
    });
    let body = `${messageStart}
`;
    const decreasedSummaries = summaries.filter(summary => summary.coverage.total.lines.pct < 0 ||
        summary.coverage.total.branches.pct < 0 ||
        summary.coverage.total.statements.pct < 0 ||
        summary.coverage.total.functions.pct < 0);
    if (decreasedSummaries.length > 0) {
        const decreasedTable = (0, markdown_table_ts_1.getMarkdownTable)({
            alignColumns: true,
            alignment: [
                markdown_table_ts_1.Align.Left,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right
            ],
            table: {
                head: ['Project', 'Lines', 'Statements', 'Functions', 'Branches'],
                body: decreasedSummaries.map(summary => {
                    const { total } = summary.coverage;
                    return [
                        summary.name,
                        (0, format_1.formatCoverageNumber)(total.lines),
                        (0, format_1.formatCoverageNumber)(total.statements),
                        (0, format_1.formatCoverageNumber)(total.functions),
                        (0, format_1.formatCoverageNumber)(total.branches)
                    ];
                })
            }
        });
        body += `
:warning: These projects have a decreasing coverage:

${decreasedTable}
    `;
    }
    const increasedSummaries = summaries.filter(summary => summary.coverage.total.lines.pct > 0 ||
        summary.coverage.total.branches.pct > 0 ||
        summary.coverage.total.statements.pct > 0 ||
        summary.coverage.total.functions.pct > 0);
    if (increasedSummaries.length > 0) {
        const increasedTable = (0, markdown_table_ts_1.getMarkdownTable)({
            alignColumns: true,
            alignment: [
                markdown_table_ts_1.Align.Left,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right,
                markdown_table_ts_1.Align.Right
            ],
            table: {
                head: ['Project', 'Lines', 'Statements', 'Functions', 'Branches'],
                body: decreasedSummaries.map(summary => {
                    const { total } = summary.coverage;
                    return [
                        summary.name,
                        (0, format_1.formatCoverageNumber)(total.lines),
                        (0, format_1.formatCoverageNumber)(total.statements),
                        (0, format_1.formatCoverageNumber)(total.functions),
                        (0, format_1.formatCoverageNumber)(total.branches)
                    ];
                })
            }
        });
        body += `
:fire: These projects have an increasing coverage:

${increasedTable}
    `;
    }
    if (decreasedSummaries.length === 0 && increasedSummaries.length === 0) {
        body += `
:+1: All projects have a stable coverage!

<details>
  <summary>Coverage diff details</summary>

  ${summaries.map(summary => {
            return `
## ${summary.name}
${(0, markdown_table_ts_1.getMarkdownTable)({
                alignColumns: true,
                alignment: [markdown_table_ts_1.Align.Left, markdown_table_ts_1.Align.Right, markdown_table_ts_1.Align.Right, markdown_table_ts_1.Align.Right, markdown_table_ts_1.Align.Right],
                table: {
                    head: ['File', 'Lines', 'Statements', 'Functions', 'Branches'],
                    body: Object.keys(summary.coverage)
                        .map(key => {
                        if (key === 'total')
                            return [];
                        const info = summary.coverage[key];
                        if (!info)
                            return [];
                        return [
                            key.replace(`/${summary.path}`, ''),
                            (0, format_1.formatCoverageNumber)(info.lines),
                            (0, format_1.formatCoverageNumber)(info.statements),
                            (0, format_1.formatCoverageNumber)(info.functions),
                            (0, format_1.formatCoverageNumber)(info.branches)
                        ];
                    })
                        .filter(s => s.length > 0)
                }
            })}
`;
        })}
</details>`;
    }
    core.info('Posting message to branch');
    const existingComment = existingComments.data.find(comment => comment.body?.startsWith(messageStart));
    if (existingComment) {
        await octokit.rest.issues.updateComment({
            ...context.repo,
            comment_id: existingComment.id,
            body
        });
        return;
    }
    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request_number,
        body
    });
}
exports.postMessage = postMessage;


/***/ }),

/***/ 7294:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepare = void 0;
const core = __importStar(__nccwpck_require__(2186));
const child_process_1 = __nccwpck_require__(2081);
async function prepare(commands, folders) {
    const promises = Object.values(folders).map(folder => {
        return new Promise(async (resolve, reject) => {
            for (const command of commands) {
                core.info(`${folder}: ${command}`);
                (0, child_process_1.execSync)(command, { cwd: folder });
            }
            resolve(undefined);
        });
    });
    try {
        await Promise.all(promises);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            console.error(error.message);
    }
}
exports.prepare = prepare;


/***/ }),

/***/ 7993:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pullBranch = void 0;
const core = __importStar(__nccwpck_require__(2186));
const simple_git_1 = __importDefault(__nccwpck_require__(9103));
const github = __importStar(__nccwpck_require__(5438));
const git = (0, simple_git_1.default)();
async function pullBranch(token, branchName, folder) {
    try {
        const context = github.context;
        const url = `https://oauth2:${token}@github.com/${context.repo.owner}/${context.repo.repo}.git`;
        core.info(`Cloning ${branchName} in ${folder}`);
        await git.clone(url, folder, {
            '--branch': branchName
        });
        core.info(`${branchName} cloned`);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.pullBranch = pullBranch;


/***/ }),

/***/ 2877:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 5477:
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 6463:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Glob = void 0;
const minimatch_1 = __nccwpck_require__(266);
const path_scurry_1 = __nccwpck_require__(9569);
const url_1 = __nccwpck_require__(7310);
const pattern_js_1 = __nccwpck_require__(6722);
const walker_js_1 = __nccwpck_require__(9173);
// if no process global, just call it linux.
// so we default to case-sensitive, / separators
const defaultPlatform = typeof process === 'object' &&
    process &&
    typeof process.platform === 'string'
    ? process.platform
    : 'linux';
/**
 * An object that can perform glob pattern traversals.
 */
class Glob {
    absolute;
    cwd;
    root;
    dot;
    dotRelative;
    follow;
    ignore;
    magicalBraces;
    mark;
    matchBase;
    maxDepth;
    nobrace;
    nocase;
    nodir;
    noext;
    noglobstar;
    pattern;
    platform;
    realpath;
    scurry;
    stat;
    signal;
    windowsPathsNoEscape;
    withFileTypes;
    /**
     * The options provided to the constructor.
     */
    opts;
    /**
     * An array of parsed immutable {@link Pattern} objects.
     */
    patterns;
    /**
     * All options are stored as properties on the `Glob` object.
     *
     * See {@link GlobOptions} for full options descriptions.
     *
     * Note that a previous `Glob` object can be passed as the
     * `GlobOptions` to another `Glob` instantiation to re-use settings
     * and caches with a new pattern.
     *
     * Traversal functions can be called multiple times to run the walk
     * again.
     */
    constructor(pattern, opts) {
        /* c8 ignore start */
        if (!opts)
            throw new TypeError('glob options required');
        /* c8 ignore stop */
        this.withFileTypes = !!opts.withFileTypes;
        this.signal = opts.signal;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.dotRelative = !!opts.dotRelative;
        this.nodir = !!opts.nodir;
        this.mark = !!opts.mark;
        if (!opts.cwd) {
            this.cwd = '';
        }
        else if (opts.cwd instanceof URL || opts.cwd.startsWith('file://')) {
            opts.cwd = (0, url_1.fileURLToPath)(opts.cwd);
        }
        this.cwd = opts.cwd || '';
        this.root = opts.root;
        this.magicalBraces = !!opts.magicalBraces;
        this.nobrace = !!opts.nobrace;
        this.noext = !!opts.noext;
        this.realpath = !!opts.realpath;
        this.absolute = opts.absolute;
        this.noglobstar = !!opts.noglobstar;
        this.matchBase = !!opts.matchBase;
        this.maxDepth =
            typeof opts.maxDepth === 'number' ? opts.maxDepth : Infinity;
        this.stat = !!opts.stat;
        this.ignore = opts.ignore;
        if (this.withFileTypes && this.absolute !== undefined) {
            throw new Error('cannot set absolute and withFileTypes:true');
        }
        if (typeof pattern === 'string') {
            pattern = [pattern];
        }
        this.windowsPathsNoEscape =
            !!opts.windowsPathsNoEscape ||
                opts.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            pattern = pattern.map(p => p.replace(/\\/g, '/'));
        }
        if (this.matchBase) {
            if (opts.noglobstar) {
                throw new TypeError('base matching requires globstar');
            }
            pattern = pattern.map(p => (p.includes('/') ? p : `./**/${p}`));
        }
        this.pattern = pattern;
        this.platform = opts.platform || defaultPlatform;
        this.opts = { ...opts, platform: this.platform };
        if (opts.scurry) {
            this.scurry = opts.scurry;
            if (opts.nocase !== undefined &&
                opts.nocase !== opts.scurry.nocase) {
                throw new Error('nocase option contradicts provided scurry option');
            }
        }
        else {
            const Scurry = opts.platform === 'win32'
                ? path_scurry_1.PathScurryWin32
                : opts.platform === 'darwin'
                    ? path_scurry_1.PathScurryDarwin
                    : opts.platform
                        ? path_scurry_1.PathScurryPosix
                        : path_scurry_1.PathScurry;
            this.scurry = new Scurry(this.cwd, {
                nocase: opts.nocase,
                fs: opts.fs,
            });
        }
        this.nocase = this.scurry.nocase;
        // If you do nocase:true on a case-sensitive file system, then
        // we need to use regexps instead of strings for non-magic
        // path portions, because statting `aBc` won't return results
        // for the file `AbC` for example.
        const nocaseMagicOnly = this.platform === 'darwin' || this.platform === 'win32';
        const mmo = {
            // default nocase based on platform
            ...opts,
            dot: this.dot,
            matchBase: this.matchBase,
            nobrace: this.nobrace,
            nocase: this.nocase,
            nocaseMagicOnly,
            nocomment: true,
            noext: this.noext,
            nonegate: true,
            optimizationLevel: 2,
            platform: this.platform,
            windowsPathsNoEscape: this.windowsPathsNoEscape,
            debug: !!this.opts.debug,
        };
        const mms = this.pattern.map(p => new minimatch_1.Minimatch(p, mmo));
        const [matchSet, globParts] = mms.reduce((set, m) => {
            set[0].push(...m.set);
            set[1].push(...m.globParts);
            return set;
        }, [[], []]);
        this.patterns = matchSet.map((set, i) => {
            return new pattern_js_1.Pattern(set, globParts[i], 0, this.platform);
        });
    }
    async walk() {
        // Walkers always return array of Path objects, so we just have to
        // coerce them into the right shape.  It will have already called
        // realpath() if the option was set to do so, so we know that's cached.
        // start out knowing the cwd, at least
        return [
            ...(await new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity
                    ? this.maxDepth + this.scurry.cwd.depth()
                    : Infinity,
                platform: this.platform,
                nocase: this.nocase,
            }).walk()),
        ];
    }
    walkSync() {
        return [
            ...new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity
                    ? this.maxDepth + this.scurry.cwd.depth()
                    : Infinity,
                platform: this.platform,
                nocase: this.nocase,
            }).walkSync(),
        ];
    }
    stream() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity
                ? this.maxDepth + this.scurry.cwd.depth()
                : Infinity,
            platform: this.platform,
            nocase: this.nocase,
        }).stream();
    }
    streamSync() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity
                ? this.maxDepth + this.scurry.cwd.depth()
                : Infinity,
            platform: this.platform,
            nocase: this.nocase,
        }).streamSync();
    }
    /**
     * Default sync iteration function. Returns a Generator that
     * iterates over the results.
     */
    iterateSync() {
        return this.streamSync()[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.iterateSync();
    }
    /**
     * Default async iteration function. Returns an AsyncGenerator that
     * iterates over the results.
     */
    iterate() {
        return this.stream()[Symbol.asyncIterator]();
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
}
exports.Glob = Glob;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 4131:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasMagic = void 0;
const minimatch_1 = __nccwpck_require__(266);
/**
 * Return true if the patterns provided contain any magic glob characters,
 * given the options provided.
 *
 * Brace expansion is not considered "magic" unless the `magicalBraces` option
 * is set, as brace expansion just turns one string into an array of strings.
 * So a pattern like `'x{a,b}y'` would return `false`, because `'xay'` and
 * `'xby'` both do not contain any magic glob characters, and it's treated the
 * same as if you had called it on `['xay', 'xby']`. When `magicalBraces:true`
 * is in the options, brace expansion _is_ treated as a pattern having magic.
 */
const hasMagic = (pattern, options = {}) => {
    if (!Array.isArray(pattern)) {
        pattern = [pattern];
    }
    for (const p of pattern) {
        if (new minimatch_1.Minimatch(p, options).hasMagic())
            return true;
    }
    return false;
};
exports.hasMagic = hasMagic;
//# sourceMappingURL=has-magic.js.map

/***/ }),

/***/ 7639:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// give it a pattern, and it'll be able to tell you if
// a given path should be ignored.
// Ignoring a path ignores its children if the pattern ends in /**
// Ignores are always parsed in dot:true mode
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ignore = void 0;
const minimatch_1 = __nccwpck_require__(266);
const pattern_js_1 = __nccwpck_require__(6722);
const defaultPlatform = typeof process === 'object' &&
    process &&
    typeof process.platform === 'string'
    ? process.platform
    : 'linux';
/**
 * Class used to process ignored patterns
 */
class Ignore {
    relative;
    relativeChildren;
    absolute;
    absoluteChildren;
    constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform, }) {
        this.relative = [];
        this.absolute = [];
        this.relativeChildren = [];
        this.absoluteChildren = [];
        const mmopts = {
            dot: true,
            nobrace,
            nocase,
            noext,
            noglobstar,
            optimizationLevel: 2,
            platform,
            nocomment: true,
            nonegate: true,
        };
        // this is a little weird, but it gives us a clean set of optimized
        // minimatch matchers, without getting tripped up if one of them
        // ends in /** inside a brace section, and it's only inefficient at
        // the start of the walk, not along it.
        // It'd be nice if the Pattern class just had a .test() method, but
        // handling globstars is a bit of a pita, and that code already lives
        // in minimatch anyway.
        // Another way would be if maybe Minimatch could take its set/globParts
        // as an option, and then we could at least just use Pattern to test
        // for absolute-ness.
        // Yet another way, Minimatch could take an array of glob strings, and
        // a cwd option, and do the right thing.
        for (const ign of ignored) {
            const mm = new minimatch_1.Minimatch(ign, mmopts);
            for (let i = 0; i < mm.set.length; i++) {
                const parsed = mm.set[i];
                const globParts = mm.globParts[i];
                const p = new pattern_js_1.Pattern(parsed, globParts, 0, platform);
                const m = new minimatch_1.Minimatch(p.globString(), mmopts);
                const children = globParts[globParts.length - 1] === '**';
                const absolute = p.isAbsolute();
                if (absolute)
                    this.absolute.push(m);
                else
                    this.relative.push(m);
                if (children) {
                    if (absolute)
                        this.absoluteChildren.push(m);
                    else
                        this.relativeChildren.push(m);
                }
            }
        }
    }
    ignored(p) {
        const fullpath = p.fullpath();
        const fullpaths = `${fullpath}/`;
        const relative = p.relative() || '.';
        const relatives = `${relative}/`;
        for (const m of this.relative) {
            if (m.match(relative) || m.match(relatives))
                return true;
        }
        for (const m of this.absolute) {
            if (m.match(fullpath) || m.match(fullpaths))
                return true;
        }
        return false;
    }
    childrenIgnored(p) {
        const fullpath = p.fullpath() + '/';
        const relative = (p.relative() || '.') + '/';
        for (const m of this.relativeChildren) {
            if (m.match(relative))
                return true;
        }
        for (const m of this.absoluteChildren) {
            if (m.match(fullpath))
                return true;
        }
        return false;
    }
}
exports.Ignore = Ignore;
//# sourceMappingURL=ignore.js.map

/***/ }),

/***/ 3277:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.glob = exports.hasMagic = exports.Glob = exports.unescape = exports.escape = exports.sync = exports.iterate = exports.iterateSync = exports.stream = exports.streamSync = exports.globIterate = exports.globIterateSync = exports.globSync = exports.globStream = exports.globStreamSync = void 0;
const minimatch_1 = __nccwpck_require__(266);
const glob_js_1 = __nccwpck_require__(6463);
const has_magic_js_1 = __nccwpck_require__(4131);
function globStreamSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).streamSync();
}
exports.globStreamSync = globStreamSync;
function globStream(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).stream();
}
exports.globStream = globStream;
function globSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walkSync();
}
exports.globSync = globSync;
async function glob_(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walk();
}
function globIterateSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterateSync();
}
exports.globIterateSync = globIterateSync;
function globIterate(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterate();
}
exports.globIterate = globIterate;
// aliases: glob.sync.stream() glob.stream.sync() glob.sync() etc
exports.streamSync = globStreamSync;
exports.stream = Object.assign(globStream, { sync: globStreamSync });
exports.iterateSync = globIterateSync;
exports.iterate = Object.assign(globIterate, {
    sync: globIterateSync,
});
exports.sync = Object.assign(globSync, {
    stream: globStreamSync,
    iterate: globIterateSync,
});
/* c8 ignore start */
var minimatch_2 = __nccwpck_require__(266);
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return minimatch_2.escape; } }));
Object.defineProperty(exports, "unescape", ({ enumerable: true, get: function () { return minimatch_2.unescape; } }));
var glob_js_2 = __nccwpck_require__(6463);
Object.defineProperty(exports, "Glob", ({ enumerable: true, get: function () { return glob_js_2.Glob; } }));
var has_magic_js_2 = __nccwpck_require__(4131);
Object.defineProperty(exports, "hasMagic", ({ enumerable: true, get: function () { return has_magic_js_2.hasMagic; } }));
/* c8 ignore stop */
exports.glob = Object.assign(glob_, {
    glob: glob_,
    globSync,
    sync: exports.sync,
    globStream,
    stream: exports.stream,
    globStreamSync,
    streamSync: exports.streamSync,
    globIterate,
    iterate: exports.iterate,
    globIterateSync,
    iterateSync: exports.iterateSync,
    Glob: glob_js_1.Glob,
    hasMagic: has_magic_js_1.hasMagic,
    escape: minimatch_1.escape,
    unescape: minimatch_1.unescape,
});
exports.glob.glob = exports.glob;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6722:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// this is just a very light wrapper around 2 arrays with an offset index
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pattern = void 0;
const minimatch_1 = __nccwpck_require__(266);
const isPatternList = (pl) => pl.length >= 1;
const isGlobList = (gl) => gl.length >= 1;
/**
 * An immutable-ish view on an array of glob parts and their parsed
 * results
 */
class Pattern {
    #patternList;
    #globList;
    #index;
    length;
    #platform;
    #rest;
    #globString;
    #isDrive;
    #isUNC;
    #isAbsolute;
    #followGlobstar = true;
    constructor(patternList, globList, index, platform) {
        if (!isPatternList(patternList)) {
            throw new TypeError('empty pattern list');
        }
        if (!isGlobList(globList)) {
            throw new TypeError('empty glob list');
        }
        if (globList.length !== patternList.length) {
            throw new TypeError('mismatched pattern list and glob list lengths');
        }
        this.length = patternList.length;
        if (index < 0 || index >= this.length) {
            throw new TypeError('index out of range');
        }
        this.#patternList = patternList;
        this.#globList = globList;
        this.#index = index;
        this.#platform = platform;
        // normalize root entries of absolute patterns on initial creation.
        if (this.#index === 0) {
            // c: => ['c:/']
            // C:/ => ['C:/']
            // C:/x => ['C:/', 'x']
            // //host/share => ['//host/share/']
            // //host/share/ => ['//host/share/']
            // //host/share/x => ['//host/share/', 'x']
            // /etc => ['/', 'etc']
            // / => ['/']
            if (this.isUNC()) {
                // '' / '' / 'host' / 'share'
                const [p0, p1, p2, p3, ...prest] = this.#patternList;
                const [g0, g1, g2, g3, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = [p0, p1, p2, p3, ''].join('/');
                const g = [g0, g1, g2, g3, ''].join('/');
                this.#patternList = [p, ...prest];
                this.#globList = [g, ...grest];
                this.length = this.#patternList.length;
            }
            else if (this.isDrive() || this.isAbsolute()) {
                const [p1, ...prest] = this.#patternList;
                const [g1, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = p1 + '/';
                const g = g1 + '/';
                this.#patternList = [p, ...prest];
                this.#globList = [g, ...grest];
                this.length = this.#patternList.length;
            }
        }
    }
    /**
     * The first entry in the parsed list of patterns
     */
    pattern() {
        return this.#patternList[this.#index];
    }
    /**
     * true of if pattern() returns a string
     */
    isString() {
        return typeof this.#patternList[this.#index] === 'string';
    }
    /**
     * true of if pattern() returns GLOBSTAR
     */
    isGlobstar() {
        return this.#patternList[this.#index] === minimatch_1.GLOBSTAR;
    }
    /**
     * true if pattern() returns a regexp
     */
    isRegExp() {
        return this.#patternList[this.#index] instanceof RegExp;
    }
    /**
     * The /-joined set of glob parts that make up this pattern
     */
    globString() {
        return (this.#globString =
            this.#globString ||
                (this.#index === 0
                    ? this.isAbsolute()
                        ? this.#globList[0] + this.#globList.slice(1).join('/')
                        : this.#globList.join('/')
                    : this.#globList.slice(this.#index).join('/')));
    }
    /**
     * true if there are more pattern parts after this one
     */
    hasMore() {
        return this.length > this.#index + 1;
    }
    /**
     * The rest of the pattern after this part, or null if this is the end
     */
    rest() {
        if (this.#rest !== undefined)
            return this.#rest;
        if (!this.hasMore())
            return (this.#rest = null);
        this.#rest = new Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
        this.#rest.#isAbsolute = this.#isAbsolute;
        this.#rest.#isUNC = this.#isUNC;
        this.#rest.#isDrive = this.#isDrive;
        return this.#rest;
    }
    /**
     * true if the pattern represents a //unc/path/ on windows
     */
    isUNC() {
        const pl = this.#patternList;
        return this.#isUNC !== undefined
            ? this.#isUNC
            : (this.#isUNC =
                this.#platform === 'win32' &&
                    this.#index === 0 &&
                    pl[0] === '' &&
                    pl[1] === '' &&
                    typeof pl[2] === 'string' &&
                    !!pl[2] &&
                    typeof pl[3] === 'string' &&
                    !!pl[3]);
    }
    // pattern like C:/...
    // split = ['C:', ...]
    // XXX: would be nice to handle patterns like `c:*` to test the cwd
    // in c: for *, but I don't know of a way to even figure out what that
    // cwd is without actually chdir'ing into it?
    /**
     * True if the pattern starts with a drive letter on Windows
     */
    isDrive() {
        const pl = this.#patternList;
        return this.#isDrive !== undefined
            ? this.#isDrive
            : (this.#isDrive =
                this.#platform === 'win32' &&
                    this.#index === 0 &&
                    this.length > 1 &&
                    typeof pl[0] === 'string' &&
                    /^[a-z]:$/i.test(pl[0]));
    }
    // pattern = '/' or '/...' or '/x/...'
    // split = ['', ''] or ['', ...] or ['', 'x', ...]
    // Drive and UNC both considered absolute on windows
    /**
     * True if the pattern is rooted on an absolute path
     */
    isAbsolute() {
        const pl = this.#patternList;
        return this.#isAbsolute !== undefined
            ? this.#isAbsolute
            : (this.#isAbsolute =
                (pl[0] === '' && pl.length > 1) ||
                    this.isDrive() ||
                    this.isUNC());
    }
    /**
     * consume the root of the pattern, and return it
     */
    root() {
        const p = this.#patternList[0];
        return typeof p === 'string' && this.isAbsolute() && this.#index === 0
            ? p
            : '';
    }
    /**
     * Check to see if the current globstar pattern is allowed to follow
     * a symbolic link.
     */
    checkFollowGlobstar() {
        return !(this.#index === 0 ||
            !this.isGlobstar() ||
            !this.#followGlobstar);
    }
    /**
     * Mark that the current globstar pattern is following a symbolic link
     */
    markFollowGlobstar() {
        if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
            return false;
        this.#followGlobstar = false;
        return true;
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=pattern.js.map

/***/ }),

/***/ 4601:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// synchronous utility for filtering entries and calculating subwalks
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Processor = exports.SubWalks = exports.MatchRecord = exports.HasWalkedCache = void 0;
const minimatch_1 = __nccwpck_require__(266);
/**
 * A cache of which patterns have been processed for a given Path
 */
class HasWalkedCache {
    store;
    constructor(store = new Map()) {
        this.store = store;
    }
    copy() {
        return new HasWalkedCache(new Map(this.store));
    }
    hasWalked(target, pattern) {
        return this.store.get(target.fullpath())?.has(pattern.globString());
    }
    storeWalked(target, pattern) {
        const fullpath = target.fullpath();
        const cached = this.store.get(fullpath);
        if (cached)
            cached.add(pattern.globString());
        else
            this.store.set(fullpath, new Set([pattern.globString()]));
    }
}
exports.HasWalkedCache = HasWalkedCache;
/**
 * A record of which paths have been matched in a given walk step,
 * and whether they only are considered a match if they are a directory,
 * and whether their absolute or relative path should be returned.
 */
class MatchRecord {
    store = new Map();
    add(target, absolute, ifDir) {
        const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
        const current = this.store.get(target);
        this.store.set(target, current === undefined ? n : n & current);
    }
    // match, absolute, ifdir
    entries() {
        return [...this.store.entries()].map(([path, n]) => [
            path,
            !!(n & 2),
            !!(n & 1),
        ]);
    }
}
exports.MatchRecord = MatchRecord;
/**
 * A collection of patterns that must be processed in a subsequent step
 * for a given path.
 */
class SubWalks {
    store = new Map();
    add(target, pattern) {
        if (!target.canReaddir()) {
            return;
        }
        const subs = this.store.get(target);
        if (subs) {
            if (!subs.find(p => p.globString() === pattern.globString())) {
                subs.push(pattern);
            }
        }
        else
            this.store.set(target, [pattern]);
    }
    get(target) {
        const subs = this.store.get(target);
        /* c8 ignore start */
        if (!subs) {
            throw new Error('attempting to walk unknown path');
        }
        /* c8 ignore stop */
        return subs;
    }
    entries() {
        return this.keys().map(k => [k, this.store.get(k)]);
    }
    keys() {
        return [...this.store.keys()].filter(t => t.canReaddir());
    }
}
exports.SubWalks = SubWalks;
/**
 * The class that processes patterns for a given path.
 *
 * Handles child entry filtering, and determining whether a path's
 * directory contents must be read.
 */
class Processor {
    hasWalkedCache;
    matches = new MatchRecord();
    subwalks = new SubWalks();
    patterns;
    follow;
    dot;
    opts;
    constructor(opts, hasWalkedCache) {
        this.opts = opts;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.hasWalkedCache = hasWalkedCache
            ? hasWalkedCache.copy()
            : new HasWalkedCache();
    }
    processPatterns(target, patterns) {
        this.patterns = patterns;
        const processingSet = patterns.map(p => [target, p]);
        // map of paths to the magic-starting subwalks they need to walk
        // first item in patterns is the filter
        for (let [t, pattern] of processingSet) {
            this.hasWalkedCache.storeWalked(t, pattern);
            const root = pattern.root();
            const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
            // start absolute patterns at root
            if (root) {
                t = t.resolve(root === '/' && this.opts.root !== undefined
                    ? this.opts.root
                    : root);
                const rest = pattern.rest();
                if (!rest) {
                    this.matches.add(t, true, false);
                    continue;
                }
                else {
                    pattern = rest;
                }
            }
            if (t.isENOENT())
                continue;
            let p;
            let rest;
            let changed = false;
            while (typeof (p = pattern.pattern()) === 'string' &&
                (rest = pattern.rest())) {
                const c = t.resolve(p);
                t = c;
                pattern = rest;
                changed = true;
            }
            p = pattern.pattern();
            rest = pattern.rest();
            if (changed) {
                if (this.hasWalkedCache.hasWalked(t, pattern))
                    continue;
                this.hasWalkedCache.storeWalked(t, pattern);
            }
            // now we have either a final string for a known entry,
            // more strings for an unknown entry,
            // or a pattern starting with magic, mounted on t.
            if (typeof p === 'string') {
                // must not be final entry, otherwise we would have
                // concatenated it earlier.
                const ifDir = p === '..' || p === '' || p === '.';
                this.matches.add(t.resolve(p), absolute, ifDir);
                continue;
            }
            else if (p === minimatch_1.GLOBSTAR) {
                // if no rest, match and subwalk pattern
                // if rest, process rest and subwalk pattern
                // if it's a symlink, but we didn't get here by way of a
                // globstar match (meaning it's the first time THIS globstar
                // has traversed a symlink), then we follow it. Otherwise, stop.
                if (!t.isSymbolicLink() ||
                    this.follow ||
                    pattern.checkFollowGlobstar()) {
                    this.subwalks.add(t, pattern);
                }
                const rp = rest?.pattern();
                const rrest = rest?.rest();
                if (!rest || ((rp === '' || rp === '.') && !rrest)) {
                    // only HAS to be a dir if it ends in **/ or **/.
                    // but ending in ** will match files as well.
                    this.matches.add(t, absolute, rp === '' || rp === '.');
                }
                else {
                    if (rp === '..') {
                        // this would mean you're matching **/.. at the fs root,
                        // and no thanks, I'm not gonna test that specific case.
                        /* c8 ignore start */
                        const tp = t.parent || t;
                        /* c8 ignore stop */
                        if (!rrest)
                            this.matches.add(tp, absolute, true);
                        else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
                            this.subwalks.add(tp, rrest);
                        }
                    }
                }
            }
            else if (p instanceof RegExp) {
                this.subwalks.add(t, pattern);
            }
        }
        return this;
    }
    subwalkTargets() {
        return this.subwalks.keys();
    }
    child() {
        return new Processor(this.opts, this.hasWalkedCache);
    }
    // return a new Processor containing the subwalks for each
    // child entry, and a set of matches, and
    // a hasWalkedCache that's a copy of this one
    // then we're going to call
    filterEntries(parent, entries) {
        const patterns = this.subwalks.get(parent);
        // put matches and entry walks into the results processor
        const results = this.child();
        for (const e of entries) {
            for (const pattern of patterns) {
                const absolute = pattern.isAbsolute();
                const p = pattern.pattern();
                const rest = pattern.rest();
                if (p === minimatch_1.GLOBSTAR) {
                    results.testGlobstar(e, pattern, rest, absolute);
                }
                else if (p instanceof RegExp) {
                    results.testRegExp(e, p, rest, absolute);
                }
                else {
                    results.testString(e, p, rest, absolute);
                }
            }
        }
        return results;
    }
    testGlobstar(e, pattern, rest, absolute) {
        if (this.dot || !e.name.startsWith('.')) {
            if (!pattern.hasMore()) {
                this.matches.add(e, absolute, false);
            }
            if (e.canReaddir()) {
                // if we're in follow mode or it's not a symlink, just keep
                // testing the same pattern. If there's more after the globstar,
                // then this symlink consumes the globstar. If not, then we can
                // follow at most ONE symlink along the way, so we mark it, which
                // also checks to ensure that it wasn't already marked.
                if (this.follow || !e.isSymbolicLink()) {
                    this.subwalks.add(e, pattern);
                }
                else if (e.isSymbolicLink()) {
                    if (rest && pattern.checkFollowGlobstar()) {
                        this.subwalks.add(e, rest);
                    }
                    else if (pattern.markFollowGlobstar()) {
                        this.subwalks.add(e, pattern);
                    }
                }
            }
        }
        // if the NEXT thing matches this entry, then also add
        // the rest.
        if (rest) {
            const rp = rest.pattern();
            if (typeof rp === 'string' &&
                // dots and empty were handled already
                rp !== '..' &&
                rp !== '' &&
                rp !== '.') {
                this.testString(e, rp, rest.rest(), absolute);
            }
            else if (rp === '..') {
                /* c8 ignore start */
                const ep = e.parent || e;
                /* c8 ignore stop */
                this.subwalks.add(ep, rest);
            }
            else if (rp instanceof RegExp) {
                this.testRegExp(e, rp, rest.rest(), absolute);
            }
        }
    }
    testRegExp(e, p, rest, absolute) {
        if (!p.test(e.name))
            return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        }
        else {
            this.subwalks.add(e, rest);
        }
    }
    testString(e, p, rest, absolute) {
        // should never happen?
        if (!e.isNamed(p))
            return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        }
        else {
            this.subwalks.add(e, rest);
        }
    }
}
exports.Processor = Processor;
//# sourceMappingURL=processor.js.map

/***/ }),

/***/ 9173:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobStream = exports.GlobWalker = exports.GlobUtil = void 0;
/**
 * Single-use utility classes to provide functionality to the {@link Glob}
 * methods.
 *
 * @module
 */
const minipass_1 = __nccwpck_require__(8865);
const ignore_js_1 = __nccwpck_require__(7639);
const processor_js_1 = __nccwpck_require__(4601);
const makeIgnore = (ignore, opts) => typeof ignore === 'string'
    ? new ignore_js_1.Ignore([ignore], opts)
    : Array.isArray(ignore)
        ? new ignore_js_1.Ignore(ignore, opts)
        : ignore;
/**
 * basic walking utilities that all the glob walker types use
 */
class GlobUtil {
    path;
    patterns;
    opts;
    seen = new Set();
    paused = false;
    aborted = false;
    #onResume = [];
    #ignore;
    #sep;
    signal;
    maxDepth;
    constructor(patterns, path, opts) {
        this.patterns = patterns;
        this.path = path;
        this.opts = opts;
        this.#sep = !opts.posix && opts.platform === 'win32' ? '\\' : '/';
        if (opts.ignore) {
            this.#ignore = makeIgnore(opts.ignore, opts);
        }
        // ignore, always set with maxDepth, but it's optional on the
        // GlobOptions type
        /* c8 ignore start */
        this.maxDepth = opts.maxDepth || Infinity;
        /* c8 ignore stop */
        if (opts.signal) {
            this.signal = opts.signal;
            this.signal.addEventListener('abort', () => {
                this.#onResume.length = 0;
            });
        }
    }
    #ignored(path) {
        return this.seen.has(path) || !!this.#ignore?.ignored?.(path);
    }
    #childrenIgnored(path) {
        return !!this.#ignore?.childrenIgnored?.(path);
    }
    // backpressure mechanism
    pause() {
        this.paused = true;
    }
    resume() {
        /* c8 ignore start */
        if (this.signal?.aborted)
            return;
        /* c8 ignore stop */
        this.paused = false;
        let fn = undefined;
        while (!this.paused && (fn = this.#onResume.shift())) {
            fn();
        }
    }
    onResume(fn) {
        if (this.signal?.aborted)
            return;
        /* c8 ignore start */
        if (!this.paused) {
            fn();
        }
        else {
            /* c8 ignore stop */
            this.#onResume.push(fn);
        }
    }
    // do the requisite realpath/stat checking, and return the path
    // to add or undefined to filter it out.
    async matchCheck(e, ifDir) {
        if (ifDir && this.opts.nodir)
            return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || (await e.realpath());
            if (!rpc)
                return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? await e.lstat() : e, ifDir);
    }
    matchCheckTest(e, ifDir) {
        return e &&
            (this.maxDepth === Infinity || e.depth() <= this.maxDepth) &&
            (!ifDir || e.canReaddir()) &&
            (!this.opts.nodir || !e.isDirectory()) &&
            !this.#ignored(e)
            ? e
            : undefined;
    }
    matchCheckSync(e, ifDir) {
        if (ifDir && this.opts.nodir)
            return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || e.realpathSync();
            if (!rpc)
                return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? e.lstatSync() : e, ifDir);
    }
    matchFinish(e, absolute) {
        if (this.#ignored(e))
            return;
        const abs = this.opts.absolute === undefined ? absolute : this.opts.absolute;
        this.seen.add(e);
        const mark = this.opts.mark && e.isDirectory() ? this.#sep : '';
        // ok, we have what we need!
        if (this.opts.withFileTypes) {
            this.matchEmit(e);
        }
        else if (abs) {
            const abs = this.opts.posix ? e.fullpathPosix() : e.fullpath();
            this.matchEmit(abs + mark);
        }
        else {
            const rel = this.opts.posix ? e.relativePosix() : e.relative();
            const pre = this.opts.dotRelative && !rel.startsWith('..' + this.#sep)
                ? '.' + this.#sep
                : '';
            this.matchEmit(!rel ? '.' + mark : pre + rel + mark);
        }
    }
    async match(e, absolute, ifDir) {
        const p = await this.matchCheck(e, ifDir);
        if (p)
            this.matchFinish(p, absolute);
    }
    matchSync(e, absolute, ifDir) {
        const p = this.matchCheckSync(e, ifDir);
        if (p)
            this.matchFinish(p, absolute);
    }
    walkCB(target, patterns, cb) {
        /* c8 ignore start */
        if (this.signal?.aborted)
            cb();
        /* c8 ignore stop */
        this.walkCB2(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
            return cb();
        if (this.signal?.aborted)
            cb();
        if (this.paused) {
            this.onResume(() => this.walkCB2(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            tasks++;
            this.match(m, absolute, ifDir).then(() => next());
        }
        for (const t of processor.subwalkTargets()) {
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const childrenCached = t.readdirCached();
            if (t.calledReaddir())
                this.walkCB3(t, childrenCached, processor, next);
            else {
                t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
            }
        }
        next();
    }
    walkCB3(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            tasks++;
            this.match(m, absolute, ifDir).then(() => next());
        }
        for (const [target, patterns] of processor.subwalks.entries()) {
            tasks++;
            this.walkCB2(target, patterns, processor.child(), next);
        }
        next();
    }
    walkCBSync(target, patterns, cb) {
        /* c8 ignore start */
        if (this.signal?.aborted)
            cb();
        /* c8 ignore stop */
        this.walkCB2Sync(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2Sync(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
            return cb();
        if (this.signal?.aborted)
            cb();
        if (this.paused) {
            this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const t of processor.subwalkTargets()) {
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const children = t.readdirSync();
            this.walkCB3Sync(t, children, processor, next);
        }
        next();
    }
    walkCB3Sync(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const [target, patterns] of processor.subwalks.entries()) {
            tasks++;
            this.walkCB2Sync(target, patterns, processor.child(), next);
        }
        next();
    }
}
exports.GlobUtil = GlobUtil;
class GlobWalker extends GlobUtil {
    matches;
    constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.matches = new Set();
    }
    matchEmit(e) {
        this.matches.add(e);
    }
    async walk() {
        if (this.signal?.aborted)
            throw this.signal.reason;
        if (this.path.isUnknown()) {
            await this.path.lstat();
        }
        await new Promise((res, rej) => {
            this.walkCB(this.path, this.patterns, () => {
                if (this.signal?.aborted) {
                    rej(this.signal.reason);
                }
                else {
                    res(this.matches);
                }
            });
        });
        return this.matches;
    }
    walkSync() {
        if (this.signal?.aborted)
            throw this.signal.reason;
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        // nothing for the callback to do, because this never pauses
        this.walkCBSync(this.path, this.patterns, () => {
            if (this.signal?.aborted)
                throw this.signal.reason;
        });
        return this.matches;
    }
}
exports.GlobWalker = GlobWalker;
class GlobStream extends GlobUtil {
    results;
    constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.results = new minipass_1.Minipass({
            signal: this.signal,
            objectMode: true,
        });
        this.results.on('drain', () => this.resume());
        this.results.on('resume', () => this.resume());
    }
    matchEmit(e) {
        this.results.write(e);
        if (!this.results.flowing)
            this.pause();
    }
    stream() {
        const target = this.path;
        if (target.isUnknown()) {
            target.lstat().then(() => {
                this.walkCB(target, this.patterns, () => this.results.end());
            });
        }
        else {
            this.walkCB(target, this.patterns, () => this.results.end());
        }
        return this.results;
    }
    streamSync() {
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => this.results.end());
        return this.results;
    }
}
exports.GlobStream = GlobStream;
//# sourceMappingURL=walker.js.map

/***/ }),

/***/ 5934:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertValidPattern = void 0;
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};
exports.assertValidPattern = assertValidPattern;
//# sourceMappingURL=assert-valid-pattern.js.map

/***/ }),

/***/ 7642:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// parse a single path portion
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AST = void 0;
const brace_expressions_js_1 = __nccwpck_require__(314);
const unescape_js_1 = __nccwpck_require__(9820);
const types = new Set(['!', '?', '+', '*', '@']);
const isExtglobType = (c) => types.has(c);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set(['[', '.']);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set(['..', '.']);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    constructor(type, parent, options = {}) {
        this.type = type;
        // extglobs are inherently magical
        if (type)
            this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs)
            this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */
        if (this.#hasMagic !== undefined)
            return this.#hasMagic;
        /* c8 ignore stop */
        for (const p of this.#parts) {
            if (typeof p === 'string')
                continue;
            if (p.type || p.hasMagic)
                return (this.#hasMagic = true);
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined)
            return this.#toString;
        if (!this.type) {
            return (this.#toString = this.#parts.map(p => String(p)).join(''));
        }
        else {
            return (this.#toString =
                this.type + '(' + this.#parts.map(p => String(p)).join('|') + ')');
        }
    }
    #fillNegs() {
        /* c8 ignore start */
        if (this !== this.#root)
            throw new Error('should only call on root');
        if (this.#filledNegs)
            return this;
        /* c8 ignore stop */
        // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while ((n = this.#negs.pop())) {
            if (n.type !== '!')
                continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while (pp) {
                for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
                    for (const part of n.#parts) {
                        /* c8 ignore start */
                        if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */
                        part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts) {
            if (p === '')
                continue;
            /* c8 ignore start */
            if (typeof p !== 'string' && !(p instanceof AST && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */
            this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null
            ? this.#parts.slice().map(p => (typeof p === 'string' ? p : p.toJSON()))
            : [this.type, ...this.#parts.map(p => p.toJSON())];
        if (this.isStart() && !this.type)
            ret.unshift([]);
        if (this.isEnd() &&
            (this === this.#root ||
                (this.#root.#filledNegs && this.#parent?.type === '!'))) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this)
            return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart())
            return false;
        if (this.#parentIndex === 0)
            return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
            const pp = p.#parts[i];
            if (!(pp instanceof AST && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this)
            return true;
        if (this.#parent?.type === '!')
            return true;
        if (!this.#parent?.isEnd())
            return false;
        if (!this.type)
            return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */
        return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string')
            this.push(part);
        else
            this.push(part.clone(this));
    }
    clone(parent) {
        const c = new AST(this.type, parent);
        for (const p of this.#parts) {
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt) {
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while (i < str.length) {
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    }
                    else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                }
                else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                if (!opt.noext && isExtglobType(c) && str.charAt(i) === '(') {
                    ast.push(acc);
                    acc = '';
                    const ext = new AST(c, ast);
                    i = AST.#parseAST(str, ext, i, opt);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new AST(null, ast);
        const parts = [];
        let acc = '';
        while (i < str.length) {
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                }
                else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            }
            else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            if (isExtglobType(c) && str.charAt(i) === '(') {
                part.push(acc);
                acc = '';
                const ext = new AST(c, part);
                part.push(ext);
                i = AST.#parseAST(str, ext, i, opt);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new AST(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [str.substring(pos - 1)];
        return i;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new AST(null, undefined, options);
        AST.#parseAST(pattern, ast, 0, options);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */
        if (this !== this.#root)
            return this.#root.toMMPattern();
        /* c8 ignore stop */
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic ||
            this.#hasMagic ||
            (this.#options.nocase &&
                !this.#options.nocaseMagicOnly &&
                glob.toUpperCase() !== glob.toLowerCase());
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob,
        });
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this)
            this.#fillNegs();
        if (!this.type) {
            const noEmpty = this.isStart() && this.isEnd();
            const src = this.#parts
                .map(p => {
                const [re, _, hasMagic, uflag] = typeof p === 'string'
                    ? AST.#parseGlob(p, this.#hasMagic, noEmpty)
                    : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            })
                .join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:true is set.
                    const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
                    if (!dotTravAllowed) {
                        const aps = addPatternStart;
                        // check if we have a possibility of matching . or ..,
                        // and prevent that.
                        const needNoTrav = 
                        // dots are allowed, and the pattern starts with [ or .
                        (dot && aps.has(src.charAt(0))) ||
                            // the pattern starts with \., and then [ or .
                            (src.startsWith('\\.') && aps.has(src.charAt(2))) ||
                            // the pattern starts with \.\., and then [ or .
                            (src.startsWith('\\.\\.') && aps.has(src.charAt(4)));
                        // no need to prevent dots if it can't match a dot, or if a
                        // sub-pattern will be preventing it anyway.
                        const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                        start = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : '';
                    }
                }
            }
            // append the "end of path portion" pattern to negation tails
            let end = '';
            if (this.isEnd() &&
                this.#root.#filledNegs &&
                this.#parent?.type === '!') {
                end = '(?:$|\\/)';
            }
            const final = start + src + end;
            return [
                final,
                (0, unescape_js_1.unescape)(src),
                (this.#hasMagic = !!this.#hasMagic),
                this.#uflag,
            ];
        }
        // We need to calculate the body *twice* if it's a repeat pattern
        // at the start, once in nodot mode, then again in dot mode, so a
        // pattern like *(?) can match 'x.y'
        const repeated = this.type === '*' || this.type === '+';
        // some kind of extglob
        const start = this.type === '!' ? '(?:(?!(?:' : '(?:';
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== '!') {
            // invalid extglob, has to at least be *something* present, if it's
            // the entire path portion.
            const s = this.toString();
            this.#parts = [s];
            this.type = null;
            this.#hasMagic = undefined;
            return [s, (0, unescape_js_1.unescape)(this.toString()), false, false];
        }
        // XXX abstract out this map method
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot
            ? ''
            : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
            bodyDotAllowed = '';
        }
        if (bodyDotAllowed) {
            body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        // an empty !() is exactly equivalent to a starNoEmpty
        let final = '';
        if (this.type === '!' && this.#emptyExt) {
            final = (this.isStart() && !dot ? startNoDot : '') + starNoEmpty;
        }
        else {
            const close = this.type === '!'
                ? // !() must match something,but !(x) can match ''
                    '))' +
                        (this.isStart() && !dot && !allowDot ? startNoDot : '') +
                        star +
                        ')'
                : this.type === '@'
                    ? ')'
                    : this.type === '?'
                        ? ')?'
                        : this.type === '+' && bodyDotAllowed
                            ? ')'
                            : this.type === '*' && bodyDotAllowed
                                ? `)?`
                                : `)${this.type}`;
            final = start + body + close;
        }
        return [
            final,
            (0, unescape_js_1.unescape)(body),
            (this.#hasMagic = !!this.#hasMagic),
            this.#uflag,
        ];
    }
    #partsToRegExp(dot) {
        return this.#parts
            .map(p => {
            // extglob ASTs should only contain parent ASTs
            /* c8 ignore start */
            if (typeof p === 'string') {
                throw new Error('string type in extglob ast??');
            }
            /* c8 ignore stop */
            // can ignore hasMagic, because extglobs are already always magic
            const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
            this.#uflag = this.#uflag || uflag;
            return re;
        })
            .filter(p => !(this.isStart() && this.isEnd()) || !!p)
            .join('|');
    }
    static #parseGlob(glob, hasMagic, noEmpty = false) {
        let escaping = false;
        let re = '';
        let uflag = false;
        for (let i = 0; i < glob.length; i++) {
            const c = glob.charAt(i);
            if (escaping) {
                escaping = false;
                re += (reSpecials.has(c) ? '\\' : '') + c;
                continue;
            }
            if (c === '\\') {
                if (i === glob.length - 1) {
                    re += '\\\\';
                }
                else {
                    escaping = true;
                }
                continue;
            }
            if (c === '[') {
                const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
                if (consumed) {
                    re += src;
                    uflag = uflag || needUflag;
                    i += consumed - 1;
                    hasMagic = hasMagic || magic;
                    continue;
                }
            }
            if (c === '*') {
                if (noEmpty && glob === '*')
                    re += starNoEmpty;
                else
                    re += star;
                hasMagic = true;
                continue;
            }
            if (c === '?') {
                re += qmark;
                hasMagic = true;
                continue;
            }
            re += regExpEscape(c);
        }
        return [re, (0, unescape_js_1.unescape)(glob), !!hasMagic, uflag];
    }
}
exports.AST = AST;
//# sourceMappingURL=ast.js.map

/***/ }),

/***/ 314:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// translate the various posix character classes into unicode properties
// this works across all unicode locales
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseClass = void 0;
// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses = {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', true],
    '[:alpha:]': ['\\p{L}\\p{Nl}', true],
    '[:ascii:]': ['\\x' + '00-\\x' + '7f', false],
    '[:blank:]': ['\\p{Zs}\\t', true],
    '[:cntrl:]': ['\\p{Cc}', true],
    '[:digit:]': ['\\p{Nd}', true],
    '[:graph:]': ['\\p{Z}\\p{C}', true, true],
    '[:lower:]': ['\\p{Ll}', true],
    '[:print:]': ['\\p{C}', true],
    '[:punct:]': ['\\p{P}', true],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', true],
    '[:upper:]': ['\\p{Lu}', true],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', true],
    '[:xdigit:]': ['A-Fa-f0-9', false],
};
// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s) => s.replace(/[[\]\\-]/g, '\\$&');
// escape all regexp magic characters
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// everything has already been escaped, we just have to join
const rangesToString = (ranges) => ranges.join('');
// takes a glob string at a posix brace expression, and returns
// an equivalent regular expression source, and boolean indicating
// whether the /u flag needs to be applied, and the number of chars
// consumed to parse the character class.
// This also removes out of order ranges, and returns ($.) if the
// entire class just no good.
const parseClass = (glob, position) => {
    const pos = position;
    /* c8 ignore start */
    if (glob.charAt(pos) !== '[') {
        throw new Error('not in a brace expression');
    }
    /* c8 ignore stop */
    const ranges = [];
    const negs = [];
    let i = pos + 1;
    let sawStart = false;
    let uflag = false;
    let escaping = false;
    let negate = false;
    let endPos = pos;
    let rangeStart = '';
    WHILE: while (i < glob.length) {
        const c = glob.charAt(i);
        if ((c === '!' || c === '^') && i === pos + 1) {
            negate = true;
            i++;
            continue;
        }
        if (c === ']' && sawStart && !escaping) {
            endPos = i + 1;
            break;
        }
        sawStart = true;
        if (c === '\\') {
            if (!escaping) {
                escaping = true;
                i++;
                continue;
            }
            // escaped \ char, fall through and treat like normal char
        }
        if (c === '[' && !escaping) {
            // either a posix class, a collation equivalent, or just a [
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
                if (glob.startsWith(cls, i)) {
                    // invalid, [a-[] is fine, but not [a-[:alpha]]
                    if (rangeStart) {
                        return ['$.', false, glob.length - pos, true];
                    }
                    i += cls.length;
                    if (neg)
                        negs.push(unip);
                    else
                        ranges.push(unip);
                    uflag = uflag || u;
                    continue WHILE;
                }
            }
        }
        // now it's just a normal character, effectively
        escaping = false;
        if (rangeStart) {
            // throw this range away if it's not valid, but others
            // can still match.
            if (c > rangeStart) {
                ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c));
            }
            else if (c === rangeStart) {
                ranges.push(braceEscape(c));
            }
            rangeStart = '';
            i++;
            continue;
        }
        // now might be the start of a range.
        // can be either c-d or c-] or c<more...>] or c] at this point
        if (glob.startsWith('-]', i + 1)) {
            ranges.push(braceEscape(c + '-'));
            i += 2;
            continue;
        }
        if (glob.startsWith('-', i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
        }
        // not the start of a range, just a single character
        ranges.push(braceEscape(c));
        i++;
    }
    if (endPos < i) {
        // didn't see the end of the class, not a valid class,
        // but might still be valid as a literal match.
        return ['', false, 0, false];
    }
    // if we got no ranges and no negates, then we have a range that
    // cannot possibly match anything, and that poisons the whole glob
    if (!ranges.length && !negs.length) {
        return ['$.', false, glob.length - pos, true];
    }
    // if we got one positive range, and it's a single character, then that's
    // not actually a magic pattern, it's just that one literal character.
    // we should not treat that as "magic", we should just return the literal
    // character. [_] is a perfectly valid way to escape glob magic chars.
    if (negs.length === 0 &&
        ranges.length === 1 &&
        /^\\?.$/.test(ranges[0]) &&
        !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
    }
    const sranges = '[' + (negate ? '^' : '') + rangesToString(ranges) + ']';
    const snegs = '[' + (negate ? '' : '^') + rangesToString(negs) + ']';
    const comb = ranges.length && negs.length
        ? '(' + sranges + '|' + snegs + ')'
        : ranges.length
            ? sranges
            : snegs;
    return [comb, uflag, endPos - pos, true];
};
exports.parseClass = parseClass;
//# sourceMappingURL=brace-expressions.js.map

/***/ }),

/***/ 1477:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escape = void 0;
/**
 * Escape all magic characters in a glob pattern.
 *
 * If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
 * option is used, then characters are escaped by wrapping in `[]`, because
 * a magic character wrapped in a character class can only be satisfied by
 * that exact character.  In this mode, `\` is _not_ escaped, because it is
 * not interpreted as a magic character, but instead as a path separator.
 */
const escape = (s, { windowsPathsNoEscape = false, } = {}) => {
    // don't need to escape +@! because we escape the parens
    // that make those magic, and escaping ! as [!] isn't valid,
    // because [!]] is a valid glob class meaning not ']'.
    return windowsPathsNoEscape
        ? s.replace(/[?*()[\]]/g, '[$&]')
        : s.replace(/[?*()[\]\\]/g, '\\$&');
};
exports.escape = escape;
//# sourceMappingURL=escape.js.map

/***/ }),

/***/ 266:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = exports.escape = exports.AST = exports.Minimatch = exports.match = exports.makeRe = exports.braceExpand = exports.defaults = exports.filter = exports.GLOBSTAR = exports.sep = exports.minimatch = void 0;
const brace_expansion_1 = __importDefault(__nccwpck_require__(1046));
const assert_valid_pattern_js_1 = __nccwpck_require__(5934);
const ast_js_1 = __nccwpck_require__(7642);
const escape_js_1 = __nccwpck_require__(1477);
const unescape_js_1 = __nccwpck_require__(9820);
const minimatch = (p, pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
exports.minimatch = minimatch;
// Optimized checking for the most common glob patterns.
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext) => (f) => !f.startsWith('.') && f.endsWith(ext);
const starDotExtTestDot = (ext) => (f) => f.endsWith(ext);
const starDotExtTestNocase = (ext) => {
    ext = ext.toLowerCase();
    return (f) => !f.startsWith('.') && f.toLowerCase().endsWith(ext);
};
const starDotExtTestNocaseDot = (ext) => {
    ext = ext.toLowerCase();
    return (f) => f.toLowerCase().endsWith(ext);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith('.') && f.includes('.');
const starDotStarTestDot = (f) => f !== '.' && f !== '..' && f.includes('.');
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== '.' && f !== '..' && f.startsWith('.');
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith('.');
const starTestDot = (f) => f.length !== 0 && f !== '.' && f !== '..';
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestNocaseDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTest = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTestNoExt = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && !f.startsWith('.');
};
const qmarksTestNoExtDot = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && f !== '.' && f !== '..';
};
/* c8 ignore start */
const defaultPlatform = (typeof process === 'object' && process
    ? (typeof process.env === 'object' &&
        process.env &&
        process.env.__MINIMATCH_TESTING_PLATFORM__) ||
        process.platform
    : 'posix');
const path = {
    win32: { sep: '\\' },
    posix: { sep: '/' },
};
/* c8 ignore stop */
exports.sep = defaultPlatform === 'win32' ? path.win32.sep : path.posix.sep;
exports.minimatch.sep = exports.sep;
exports.GLOBSTAR = Symbol('globstar **');
exports.minimatch.GLOBSTAR = exports.GLOBSTAR;
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?';
const filter = (pattern, options = {}) => (p) => (0, exports.minimatch)(p, pattern, options);
exports.filter = filter;
exports.minimatch.filter = exports.filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return exports.minimatch;
    }
    const orig = exports.minimatch;
    const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
    return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
            constructor(pattern, options = {}) {
                super(pattern, ext(def, options));
            }
            static defaults(options) {
                return orig.defaults(ext(def, options)).Minimatch;
            }
        },
        AST: class AST extends orig.AST {
            /* c8 ignore start */
            constructor(type, parent, options = {}) {
                super(type, parent, ext(def, options));
            }
            /* c8 ignore stop */
            static fromGlob(pattern, options = {}) {
                return orig.AST.fromGlob(pattern, ext(def, options));
            }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports.GLOBSTAR,
    });
};
exports.defaults = defaults;
exports.minimatch.defaults = exports.defaults;
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
const braceExpand = (pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [pattern];
    }
    return (0, brace_expansion_1.default)(pattern);
};
exports.braceExpand = braceExpand;
exports.minimatch.braceExpand = exports.braceExpand;
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
exports.makeRe = makeRe;
exports.minimatch.makeRe = exports.makeRe;
const match = (list, pattern, options = {}) => {
    const mm = new Minimatch(pattern, options);
    list = list.filter(f => mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
exports.match = match;
exports.minimatch.match = exports.match;
// replace stuff like \* with *
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
class Minimatch {
    options;
    set;
    pattern;
    windowsPathsNoEscape;
    nonegate;
    negate;
    comment;
    empty;
    preserveMultipleSlashes;
    partial;
    globSet;
    globParts;
    nocase;
    isWindows;
    platform;
    windowsNoMagicRoot;
    regexp;
    constructor(pattern, options = {}) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        options = options || {};
        this.options = options;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === 'win32';
        this.windowsPathsNoEscape =
            !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot =
            options.windowsNoMagicRoot !== undefined
                ? options.windowsNoMagicRoot
                : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        // make the set of regexps etc.
        this.make();
    }
    hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
            return true;
        }
        for (const pattern of this.set) {
            for (const part of pattern) {
                if (typeof part !== 'string')
                    return true;
            }
        }
        return false;
    }
    debug(..._) { }
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
            this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        // step 3: now we have a set, so turn each one into a series of
        // path-portion matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        //
        // First, we preprocess to make the glob pattern sets a bit simpler
        // and deduped.  There are some perf-killing patterns that can cause
        // problems with a glob walk, but we can simplify them down a bit.
        const rawGlobParts = this.globSet.map(s => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        // glob --> regexps
        let set = this.globParts.map((s, _, __) => {
            if (this.isWindows && this.windowsNoMagicRoot) {
                // check if it's a drive or unc path.
                const isUNC = s[0] === '' &&
                    s[1] === '' &&
                    (s[2] === '?' || !globMagic.test(s[2])) &&
                    !globMagic.test(s[3]);
                const isDrive = /^[a-z]:/i.test(s[0]);
                if (isUNC) {
                    return [...s.slice(0, 4), ...s.slice(4).map(ss => this.parse(ss))];
                }
                else if (isDrive) {
                    return [s[0], ...s.slice(1).map(ss => this.parse(ss))];
                }
            }
            return s.map(ss => this.parse(ss));
        });
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        this.set = set.filter(s => s.indexOf(false) === -1);
        // do not treat the ? in UNC paths as magic
        if (this.isWindows) {
            for (let i = 0; i < this.set.length; i++) {
                const p = this.set[i];
                if (p[0] === '' &&
                    p[1] === '' &&
                    this.globParts[i][2] === '?' &&
                    typeof p[3] === 'string' &&
                    /^[a-z]:$/i.test(p[3])) {
                    p[2] = '?';
                }
            }
        }
        this.debug(this.pattern, this.set);
    }
    // various transforms to equivalent pattern sets that are
    // faster to process in a filesystem walk.  The goal is to
    // eliminate what we can, and push all ** patterns as far
    // to the right as possible, even if it increases the number
    // of patterns that we have to process.
    preprocess(globParts) {
        // if we're not in globstar mode, then turn all ** into *
        if (this.options.noglobstar) {
            for (let i = 0; i < globParts.length; i++) {
                for (let j = 0; j < globParts[i].length; j++) {
                    if (globParts[i][j] === '**') {
                        globParts[i][j] = '*';
                    }
                }
            }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            // aggressive optimization for the purpose of fs walking
            globParts = this.firstPhasePreProcess(globParts);
            globParts = this.secondPhasePreProcess(globParts);
        }
        else if (optimizationLevel >= 1) {
            // just basic optimizations to remove some .. parts
            globParts = this.levelOneOptimize(globParts);
        }
        else {
            globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
    }
    // just get rid of adjascent ** portions
    adjascentGlobstarOptimize(globParts) {
        return globParts.map(parts => {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                let i = gs;
                while (parts[i + 1] === '**') {
                    i++;
                }
                if (i !== gs) {
                    parts.splice(gs, i - gs);
                }
            }
            return parts;
        });
    }
    // get rid of adjascent ** and resolve .. portions
    levelOneOptimize(globParts) {
        return globParts.map(parts => {
            parts = parts.reduce((set, part) => {
                const prev = set[set.length - 1];
                if (part === '**' && prev === '**') {
                    return set;
                }
                if (part === '..') {
                    if (prev && prev !== '..' && prev !== '.' && prev !== '**') {
                        set.pop();
                        return set;
                    }
                }
                set.push(part);
                return set;
            }, []);
            return parts.length === 0 ? [''] : parts;
        });
    }
    levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
            parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/<e>/<rest> -> <pre>/<rest>
            if (!this.preserveMultipleSlashes) {
                for (let i = 1; i < parts.length - 1; i++) {
                    const p = parts[i];
                    // don't squeeze out UNC patterns
                    if (i === 1 && p === '' && parts[0] === '')
                        continue;
                    if (p === '.' || p === '') {
                        didSomething = true;
                        parts.splice(i, 1);
                        i--;
                    }
                }
                if (parts[0] === '.' &&
                    parts.length === 2 &&
                    (parts[1] === '.' || parts[1] === '')) {
                    didSomething = true;
                    parts.pop();
                }
            }
            // <pre>/<p>/../<rest> -> <pre>/<rest>
            let dd = 0;
            while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                const p = parts[dd - 1];
                if (p && p !== '.' && p !== '..' && p !== '**') {
                    didSomething = true;
                    parts.splice(dd - 1, 2);
                    dd -= 2;
                }
            }
        } while (didSomething);
        return parts.length === 0 ? [''] : parts;
    }
    // First phase: single-pattern processing
    // <pre> is 1 or more portions
    // <rest> is 1 or more portions
    // <p> is any portion other than ., .., '', or **
    // <e> is . or ''
    //
    // **/.. is *brutal* for filesystem walking performance, because
    // it effectively resets the recursive walk each time it occurs,
    // and ** cannot be reduced out by a .. pattern part like a regexp
    // or most strings (other than .., ., and '') can be.
    //
    // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
    // <pre>/<e>/<rest> -> <pre>/<rest>
    // <pre>/<p>/../<rest> -> <pre>/<rest>
    // **/**/<rest> -> **/<rest>
    //
    // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
    // this WOULD be allowed if ** did follow symlinks, or * didn't
    firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
            for (let parts of globParts) {
                let gs = -1;
                while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                    let gss = gs;
                    while (parts[gss + 1] === '**') {
                        // <pre>/**/**/<rest> -> <pre>/**/<rest>
                        gss++;
                    }
                    // eg, if gs is 2 and gss is 4, that means we have 3 **
                    // parts, and can remove 2 of them.
                    if (gss > gs) {
                        parts.splice(gs + 1, gss - gs);
                    }
                    let next = parts[gs + 1];
                    const p = parts[gs + 2];
                    const p2 = parts[gs + 3];
                    if (next !== '..')
                        continue;
                    if (!p ||
                        p === '.' ||
                        p === '..' ||
                        !p2 ||
                        p2 === '.' ||
                        p2 === '..') {
                        continue;
                    }
                    didSomething = true;
                    // edit parts in place, and push the new one
                    parts.splice(gs, 1);
                    const other = parts.slice(0);
                    other[gs] = '**';
                    globParts.push(other);
                    gs--;
                }
                // <pre>/<e>/<rest> -> <pre>/<rest>
                if (!this.preserveMultipleSlashes) {
                    for (let i = 1; i < parts.length - 1; i++) {
                        const p = parts[i];
                        // don't squeeze out UNC patterns
                        if (i === 1 && p === '' && parts[0] === '')
                            continue;
                        if (p === '.' || p === '') {
                            didSomething = true;
                            parts.splice(i, 1);
                            i--;
                        }
                    }
                    if (parts[0] === '.' &&
                        parts.length === 2 &&
                        (parts[1] === '.' || parts[1] === '')) {
                        didSomething = true;
                        parts.pop();
                    }
                }
                // <pre>/<p>/../<rest> -> <pre>/<rest>
                let dd = 0;
                while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                    const p = parts[dd - 1];
                    if (p && p !== '.' && p !== '..' && p !== '**') {
                        didSomething = true;
                        const needDot = dd === 1 && parts[dd + 1] === '**';
                        const splin = needDot ? ['.'] : [];
                        parts.splice(dd - 1, 2, ...splin);
                        if (parts.length === 0)
                            parts.push('');
                        dd -= 2;
                    }
                }
            }
        } while (didSomething);
        return globParts;
    }
    // second phase: multi-pattern dedupes
    // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
    // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
    // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
    //
    // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
    // ^-- not valid because ** doens't follow symlinks
    secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
            for (let j = i + 1; j < globParts.length; j++) {
                const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
                if (!matched)
                    continue;
                globParts[i] = matched;
                globParts[j] = [];
            }
        }
        return globParts.filter(gs => gs.length);
    }
    partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = '';
        while (ai < a.length && bi < b.length) {
            if (a[ai] === b[bi]) {
                result.push(which === 'b' ? b[bi] : a[ai]);
                ai++;
                bi++;
            }
            else if (emptyGSMatch && a[ai] === '**' && b[bi] === a[ai + 1]) {
                result.push(a[ai]);
                ai++;
            }
            else if (emptyGSMatch && b[bi] === '**' && a[ai] === b[bi + 1]) {
                result.push(b[bi]);
                bi++;
            }
            else if (a[ai] === '*' &&
                b[bi] &&
                (this.options.dot || !b[bi].startsWith('.')) &&
                b[bi] !== '**') {
                if (which === 'b')
                    return false;
                which = 'a';
                result.push(a[ai]);
                ai++;
                bi++;
            }
            else if (b[bi] === '*' &&
                a[ai] &&
                (this.options.dot || !a[ai].startsWith('.')) &&
                a[ai] !== '**') {
                if (which === 'a')
                    return false;
                which = 'b';
                result.push(b[bi]);
                ai++;
                bi++;
            }
            else {
                return false;
            }
        }
        // if we fall out of the loop, it means they two are identical
        // as long as their lengths match
        return a.length === b.length && result;
    }
    parseNegate() {
        if (this.nonegate)
            return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset)
            this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial = false) {
        const options = this.options;
        // UNC paths like //?/X:/... can match X:/... and vice versa
        // Drive letters in absolute drive or unc paths are always compared
        // case-insensitively.
        if (this.isWindows) {
            const fileDrive = typeof file[0] === 'string' && /^[a-z]:$/i.test(file[0]);
            const fileUNC = !fileDrive &&
                file[0] === '' &&
                file[1] === '' &&
                file[2] === '?' &&
                /^[a-z]:$/i.test(file[3]);
            const patternDrive = typeof pattern[0] === 'string' && /^[a-z]:$/i.test(pattern[0]);
            const patternUNC = !patternDrive &&
                pattern[0] === '' &&
                pattern[1] === '' &&
                pattern[2] === '?' &&
                typeof pattern[3] === 'string' &&
                /^[a-z]:$/i.test(pattern[3]);
            const fdi = fileUNC ? 3 : fileDrive ? 0 : undefined;
            const pdi = patternUNC ? 3 : patternDrive ? 0 : undefined;
            if (typeof fdi === 'number' && typeof pdi === 'number') {
                const [fd, pd] = [file[fdi], pattern[pdi]];
                if (fd.toLowerCase() === pd.toLowerCase()) {
                    pattern[pdi] = fd;
                    if (pdi > fdi) {
                        pattern = pattern.slice(pdi);
                    }
                    else if (fdi > pdi) {
                        file = file.slice(fdi);
                    }
                }
            }
        }
        // resolve and reduce . and .. portions in the file as well.
        // dont' need to do the second phase, because it's only one string[]
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            file = this.levelTwoFileOptimize(file);
        }
        this.debug('matchOne', this, { file, pattern });
        this.debug('matchOne', file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
            this.debug('matchOne loop');
            var p = pattern[pi];
            var f = file[fi];
            this.debug(pattern, p, f);
            // should be impossible.
            // some invalid regexp stuff in the set.
            /* c8 ignore start */
            if (p === false) {
                return false;
            }
            /* c8 ignore stop */
            if (p === exports.GLOBSTAR) {
                this.debug('GLOBSTAR', [pattern, p, f]);
                // "**"
                // a/**/b/**/c would match the following:
                // a/b/x/y/z/c
                // a/x/y/z/b/c
                // a/b/x/b/x/c
                // a/b/c
                // To do this, take the rest of the pattern after
                // the **, and see if it would match the file remainder.
                // If so, return success.
                // If not, the ** "swallows" a segment, and try again.
                // This is recursively awful.
                //
                // a/**/b/**/c matching a/b/x/y/z/c
                // - a matches a
                // - doublestar
                //   - matchOne(b/x/y/z/c, b/**/c)
                //     - b matches b
                //     - doublestar
                //       - matchOne(x/y/z/c, c) -> no
                //       - matchOne(y/z/c, c) -> no
                //       - matchOne(z/c, c) -> no
                //       - matchOne(c, c) yes, hit
                var fr = fi;
                var pr = pi + 1;
                if (pr === pl) {
                    this.debug('** at the end');
                    // a ** at the end will just swallow the rest.
                    // We have found a match.
                    // however, it will not swallow /.x, unless
                    // options.dot is set.
                    // . and .. are *never* matched by **, for explosively
                    // exponential reasons.
                    for (; fi < fl; fi++) {
                        if (file[fi] === '.' ||
                            file[fi] === '..' ||
                            (!options.dot && file[fi].charAt(0) === '.'))
                            return false;
                    }
                    return true;
                }
                // ok, let's see if we can swallow whatever we can.
                while (fr < fl) {
                    var swallowee = file[fr];
                    this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
                    // XXX remove this slice.  Just pass the start index.
                    if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                        this.debug('globstar found match!', fr, fl, swallowee);
                        // found a match.
                        return true;
                    }
                    else {
                        // can't swallow "." or ".." ever.
                        // can only swallow ".foo" when explicitly asked.
                        if (swallowee === '.' ||
                            swallowee === '..' ||
                            (!options.dot && swallowee.charAt(0) === '.')) {
                            this.debug('dot detected!', file, fr, pattern, pr);
                            break;
                        }
                        // ** swallows a segment, and continue.
                        this.debug('globstar swallow a segment, and continue');
                        fr++;
                    }
                }
                // no match was found.
                // However, in partial mode, we can't say this is necessarily over.
                /* c8 ignore start */
                if (partial) {
                    // ran out of file
                    this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
                    if (fr === fl) {
                        return true;
                    }
                }
                /* c8 ignore stop */
                return false;
            }
            // something other than **
            // non-magic patterns just have to match exactly
            // patterns with magic have been turned into regexps.
            let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            }
            else {
                hit = p.test(f);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit)
                return false;
        }
        // Note: ending in / means that we'll get a final ""
        // at the end of the pattern.  This can only match a
        // corresponding "" at the end of the file.
        // If the file ends in /, then it can only match a
        // a pattern that ends in /, unless the pattern just
        // doesn't have any more for it. But, a/b/ should *not*
        // match "a/b/*", even though "" matches against the
        // [^/]*? pattern, except in partial mode, where it might
        // simply not be reached yet.
        // However, a/b/ should still satisfy a/*
        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
            // ran out of pattern and filename at the same time.
            // an exact hit!
            return true;
        }
        else if (fi === fl) {
            // ran out of file, but still had pattern left.
            // this is ok if we're doing the match as part of
            // a glob fs traversal.
            return partial;
        }
        else if (pi === pl) {
            // ran out of pattern, still have file left.
            // this is only acceptable if we're on the very last
            // empty segment of a file with a trailing slash.
            // a/* should match a/b/
            return fi === fl - 1 && file[fi] === '';
            /* c8 ignore start */
        }
        else {
            // should be unreachable.
            throw new Error('wtf?');
        }
        /* c8 ignore stop */
    }
    braceExpand() {
        return (0, exports.braceExpand)(this.pattern, this.options);
    }
    parse(pattern) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**')
            return exports.GLOBSTAR;
        if (pattern === '')
            return '';
        // far and away, the most common glob pattern parts are
        // *, *.*, and *.<ext>  Add a fast check method for those.
        let m;
        let fastTest = null;
        if ((m = pattern.match(starRE))) {
            fastTest = options.dot ? starTestDot : starTest;
        }
        else if ((m = pattern.match(starDotExtRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? starDotExtTestNocaseDot
                    : starDotExtTestNocase
                : options.dot
                    ? starDotExtTestDot
                    : starDotExtTest)(m[1]);
        }
        else if ((m = pattern.match(qmarksRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? qmarksTestNocaseDot
                    : qmarksTestNocase
                : options.dot
                    ? qmarksTestDot
                    : qmarksTest)(m);
        }
        else if ((m = pattern.match(starDotStarRE))) {
            fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        }
        else if ((m = pattern.match(dotStarRE))) {
            fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern, this.options).toMMPattern();
        return fastTest ? Object.assign(re, { test: fastTest }) : re;
    }
    makeRe() {
        if (this.regexp || this.regexp === false)
            return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar
            ? star
            : options.dot
                ? twoStarDot
                : twoStarNoDot;
        const flags = new Set(options.nocase ? ['i'] : []);
        // regexpify non-globstar patterns
        // if ** is only item, then we just do one twoStar
        // if ** is first, and there are more, prepend (\/|twoStar\/)? to next
        // if ** is last, append (\/twoStar|) to previous
        // if ** is in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set
            .map(pattern => {
            const pp = pattern.map(p => {
                if (p instanceof RegExp) {
                    for (const f of p.flags.split(''))
                        flags.add(f);
                }
                return typeof p === 'string'
                    ? regExpEscape(p)
                    : p === exports.GLOBSTAR
                        ? exports.GLOBSTAR
                        : p._src;
            });
            pp.forEach((p, i) => {
                const next = pp[i + 1];
                const prev = pp[i - 1];
                if (p !== exports.GLOBSTAR || prev === exports.GLOBSTAR) {
                    return;
                }
                if (prev === undefined) {
                    if (next !== undefined && next !== exports.GLOBSTAR) {
                        pp[i + 1] = '(?:\\/|' + twoStar + '\\/)?' + next;
                    }
                    else {
                        pp[i] = twoStar;
                    }
                }
                else if (next === undefined) {
                    pp[i - 1] = prev + '(?:\\/|' + twoStar + ')?';
                }
                else if (next !== exports.GLOBSTAR) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + '\\/)' + next;
                    pp[i + 1] = exports.GLOBSTAR;
                }
            });
            return pp.filter(p => p !== exports.GLOBSTAR).join('/');
        })
            .join('|');
        // need to wrap in parens if we had more than one thing with |,
        // otherwise only the first will be anchored to ^ and the last to $
        const [open, close] = set.length > 1 ? ['(?:', ')'] : ['', ''];
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^' + open + re + close + '$';
        // can match anything, as long as it's not this.
        if (this.negate)
            re = '^(?!' + re + ').+$';
        try {
            this.regexp = new RegExp(re, [...flags].join(''));
            /* c8 ignore start */
        }
        catch (ex) {
            // should be impossible
            this.regexp = false;
        }
        /* c8 ignore stop */
        return this.regexp;
    }
    slashSplit(p) {
        // if p starts with // on windows, we preserve that
        // so that UNC paths aren't broken.  Otherwise, any number of
        // / characters are coalesced into one, unless
        // preserveMultipleSlashes is set to true.
        if (this.preserveMultipleSlashes) {
            return p.split('/');
        }
        else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
            // add an extra '' for the one we lose
            return ['', ...p.split(/\/+/)];
        }
        else {
            return p.split(/\/+/);
        }
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) {
            return false;
        }
        if (this.empty) {
            return f === '';
        }
        if (f === '/' && partial) {
            return true;
        }
        const options = this.options;
        // windows: need to use /, not \
        if (this.isWindows) {
            f = f.split('\\').join('/');
        }
        // treat the test path as a set of pathparts.
        const ff = this.slashSplit(f);
        this.debug(this.pattern, 'split', ff);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename = ff[ff.length - 1];
        if (!filename) {
            for (let i = ff.length - 2; !filename && i >= 0; i--) {
                filename = ff[i];
            }
        }
        for (let i = 0; i < set.length; i++) {
            const pattern = set[i];
            let file = ff;
            if (options.matchBase && pattern.length === 1) {
                file = [filename];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) {
                    return true;
                }
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) {
            return false;
        }
        return this.negate;
    }
    static defaults(def) {
        return exports.minimatch.defaults(def).Minimatch;
    }
}
exports.Minimatch = Minimatch;
/* c8 ignore start */
var ast_js_2 = __nccwpck_require__(7642);
Object.defineProperty(exports, "AST", ({ enumerable: true, get: function () { return ast_js_2.AST; } }));
var escape_js_2 = __nccwpck_require__(1477);
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return escape_js_2.escape; } }));
var unescape_js_2 = __nccwpck_require__(9820);
Object.defineProperty(exports, "unescape", ({ enumerable: true, get: function () { return unescape_js_2.unescape; } }));
/* c8 ignore stop */
exports.minimatch.AST = ast_js_1.AST;
exports.minimatch.Minimatch = Minimatch;
exports.minimatch.escape = escape_js_1.escape;
exports.minimatch.unescape = unescape_js_1.unescape;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9820:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = void 0;
/**
 * Un-escape a string that has been escaped with {@link escape}.
 *
 * If the {@link windowsPathsNoEscape} option is used, then square-brace
 * escapes are removed, but not backslash escapes.  For example, it will turn
 * the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
 * becuase `\` is a path separator in `windowsPathsNoEscape` mode.
 *
 * When `windowsPathsNoEscape` is not set, then both brace escapes and
 * backslash escapes are removed.
 *
 * Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
 * or unescaped.
 */
const unescape = (s, { windowsPathsNoEscape = false, } = {}) => {
    return windowsPathsNoEscape
        ? s.replace(/\[([^\/\\])\]/g, '$1')
        : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2').replace(/\\([^\/])/g, '$1');
};
exports.unescape = unescape;
//# sourceMappingURL=unescape.js.map

/***/ }),

/***/ 8865:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Minipass = exports.isWritable = exports.isReadable = exports.isStream = void 0;
const proc = typeof process === 'object' && process
    ? process
    : {
        stdout: null,
        stderr: null,
    };
const events_1 = __nccwpck_require__(2361);
const stream_1 = __importDefault(__nccwpck_require__(2781));
const string_decoder_1 = __nccwpck_require__(1576);
/**
 * Return true if the argument is a Minipass stream, Node stream, or something
 * else that Minipass can interact with.
 */
const isStream = (s) => !!s &&
    typeof s === 'object' &&
    (s instanceof Minipass ||
        s instanceof stream_1.default ||
        (0, exports.isReadable)(s) ||
        (0, exports.isWritable)(s));
exports.isStream = isStream;
/**
 * Return true if the argument is a valid {@link Minipass.Readable}
 */
const isReadable = (s) => !!s &&
    typeof s === 'object' &&
    s instanceof events_1.EventEmitter &&
    typeof s.pipe === 'function' &&
    // node core Writable streams have a pipe() method, but it throws
    s.pipe !== stream_1.default.Writable.prototype.pipe;
exports.isReadable = isReadable;
/**
 * Return true if the argument is a valid {@link Minipass.Writable}
 */
const isWritable = (s) => !!s &&
    typeof s === 'object' &&
    s instanceof events_1.EventEmitter &&
    typeof s.write === 'function' &&
    typeof s.end === 'function';
exports.isWritable = isWritable;
const EOF = Symbol('EOF');
const MAYBE_EMIT_END = Symbol('maybeEmitEnd');
const EMITTED_END = Symbol('emittedEnd');
const EMITTING_END = Symbol('emittingEnd');
const EMITTED_ERROR = Symbol('emittedError');
const CLOSED = Symbol('closed');
const READ = Symbol('read');
const FLUSH = Symbol('flush');
const FLUSHCHUNK = Symbol('flushChunk');
const ENCODING = Symbol('encoding');
const DECODER = Symbol('decoder');
const FLOWING = Symbol('flowing');
const PAUSED = Symbol('paused');
const RESUME = Symbol('resume');
const BUFFER = Symbol('buffer');
const PIPES = Symbol('pipes');
const BUFFERLENGTH = Symbol('bufferLength');
const BUFFERPUSH = Symbol('bufferPush');
const BUFFERSHIFT = Symbol('bufferShift');
const OBJECTMODE = Symbol('objectMode');
// internal event when stream is destroyed
const DESTROYED = Symbol('destroyed');
// internal event when stream has an error
const ERROR = Symbol('error');
const EMITDATA = Symbol('emitData');
const EMITEND = Symbol('emitEnd');
const EMITEND2 = Symbol('emitEnd2');
const ASYNC = Symbol('async');
const ABORT = Symbol('abort');
const ABORTED = Symbol('aborted');
const SIGNAL = Symbol('signal');
const DATALISTENERS = Symbol('dataListeners');
const DISCARDED = Symbol('discarded');
const defer = (fn) => Promise.resolve().then(fn);
const nodefer = (fn) => fn();
const isEndish = (ev) => ev === 'end' || ev === 'finish' || ev === 'prefinish';
const isArrayBufferLike = (b) => b instanceof ArrayBuffer ||
    (!!b &&
        typeof b === 'object' &&
        b.constructor &&
        b.constructor.name === 'ArrayBuffer' &&
        b.byteLength >= 0);
const isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
/**
 * Internal class representing a pipe to a destination stream.
 *
 * @internal
 */
class Pipe {
    src;
    dest;
    opts;
    ondrain;
    constructor(src, dest, opts) {
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = () => src[RESUME]();
        this.dest.on('drain', this.ondrain);
    }
    unpipe() {
        this.dest.removeListener('drain', this.ondrain);
    }
    // only here for the prototype
    /* c8 ignore start */
    proxyErrors(_er) { }
    /* c8 ignore stop */
    end() {
        this.unpipe();
        if (this.opts.end)
            this.dest.end();
    }
}
/**
 * Internal class representing a pipe to a destination stream where
 * errors are proxied.
 *
 * @internal
 */
class PipeProxyErrors extends Pipe {
    unpipe() {
        this.src.removeListener('error', this.proxyErrors);
        super.unpipe();
    }
    constructor(src, dest, opts) {
        super(src, dest, opts);
        this.proxyErrors = er => dest.emit('error', er);
        src.on('error', this.proxyErrors);
    }
}
const isObjectModeOptions = (o) => !!o.objectMode;
const isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== 'buffer';
/**
 * Main export, the Minipass class
 *
 * `RType` is the type of data emitted, defaults to Buffer
 *
 * `WType` is the type of data to be written, if RType is buffer or string,
 * then any {@link Minipass.ContiguousData} is allowed.
 *
 * `Events` is the set of event handler signatures that this object
 * will emit, see {@link Minipass.Events}
 */
class Minipass extends events_1.EventEmitter {
    [FLOWING] = false;
    [PAUSED] = false;
    [PIPES] = [];
    [BUFFER] = [];
    [OBJECTMODE];
    [ENCODING];
    [ASYNC];
    [DECODER];
    [EOF] = false;
    [EMITTED_END] = false;
    [EMITTING_END] = false;
    [CLOSED] = false;
    [EMITTED_ERROR] = null;
    [BUFFERLENGTH] = 0;
    [DESTROYED] = false;
    [SIGNAL];
    [ABORTED] = false;
    [DATALISTENERS] = 0;
    [DISCARDED] = false;
    /**
     * true if the stream can be written
     */
    writable = true;
    /**
     * true if the stream can be read
     */
    readable = true;
    /**
     * If `RType` is Buffer, then options do not need to be provided.
     * Otherwise, an options object must be provided to specify either
     * {@link Minipass.SharedOptions.objectMode} or
     * {@link Minipass.SharedOptions.encoding}, as appropriate.
     */
    constructor(...args) {
        const options = (args[0] ||
            {});
        super();
        if (options.objectMode && typeof options.encoding === 'string') {
            throw new TypeError('Encoding and objectMode may not be used together');
        }
        if (isObjectModeOptions(options)) {
            this[OBJECTMODE] = true;
            this[ENCODING] = null;
        }
        else if (isEncodingOptions(options)) {
            this[ENCODING] = options.encoding;
            this[OBJECTMODE] = false;
        }
        else {
            this[OBJECTMODE] = false;
            this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING]
            ? new string_decoder_1.StringDecoder(this[ENCODING])
            : null;
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposeBuffer === true) {
            Object.defineProperty(this, 'buffer', { get: () => this[BUFFER] });
        }
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposePipes === true) {
            Object.defineProperty(this, 'pipes', { get: () => this[PIPES] });
        }
        const { signal } = options;
        if (signal) {
            this[SIGNAL] = signal;
            if (signal.aborted) {
                this[ABORT]();
            }
            else {
                signal.addEventListener('abort', () => this[ABORT]());
            }
        }
    }
    /**
     * The amount of data stored in the buffer waiting to be read.
     *
     * For Buffer strings, this will be the total byte length.
     * For string encoding streams, this will be the string character length,
     * according to JavaScript's `string.length` logic.
     * For objectMode streams, this is a count of the items waiting to be
     * emitted.
     */
    get bufferLength() {
        return this[BUFFERLENGTH];
    }
    /**
     * The `BufferEncoding` currently in use, or `null`
     */
    get encoding() {
        return this[ENCODING];
    }
    /**
     * @deprecated - This is a read only property
     */
    set encoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * @deprecated - Encoding may only be set at instantiation time
     */
    setEncoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * True if this is an objectMode stream
     */
    get objectMode() {
        return this[OBJECTMODE];
    }
    /**
     * @deprecated - This is a read-only property
     */
    set objectMode(_om) {
        throw new Error('objectMode must be set at instantiation time');
    }
    /**
     * true if this is an async stream
     */
    get ['async']() {
        return this[ASYNC];
    }
    /**
     * Set to true to make this stream async.
     *
     * Once set, it cannot be unset, as this would potentially cause incorrect
     * behavior.  Ie, a sync stream can be made async, but an async stream
     * cannot be safely made sync.
     */
    set ['async'](a) {
        this[ASYNC] = this[ASYNC] || !!a;
    }
    // drop everything and get out of the flow completely
    [ABORT]() {
        this[ABORTED] = true;
        this.emit('abort', this[SIGNAL]?.reason);
        this.destroy(this[SIGNAL]?.reason);
    }
    /**
     * True if the stream has been aborted.
     */
    get aborted() {
        return this[ABORTED];
    }
    /**
     * No-op setter. Stream aborted status is set via the AbortSignal provided
     * in the constructor options.
     */
    set aborted(_) { }
    write(chunk, encoding, cb) {
        if (this[ABORTED])
            return false;
        if (this[EOF])
            throw new Error('write after end');
        if (this[DESTROYED]) {
            this.emit('error', Object.assign(new Error('Cannot call write after a stream was destroyed'), { code: 'ERR_STREAM_DESTROYED' }));
            return true;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (!encoding)
            encoding = 'utf8';
        const fn = this[ASYNC] ? defer : nodefer;
        // convert array buffers and typed array views into buffers
        // at some point in the future, we may want to do the opposite!
        // leave strings and buffers as-is
        // anything is only allowed if in object mode, so throw
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
            if (isArrayBufferView(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
            }
            else if (isArrayBufferLike(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk);
            }
            else if (typeof chunk !== 'string') {
                throw new Error('Non-contiguous data written to non-objectMode stream');
            }
        }
        // handle object mode up front, since it's simpler
        // this yields better performance, fewer checks later.
        if (this[OBJECTMODE]) {
            // maybe impossible?
            /* c8 ignore start */
            if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
                this[FLUSH](true);
            /* c8 ignore stop */
            if (this[FLOWING])
                this.emit('data', chunk);
            else
                this[BUFFERPUSH](chunk);
            if (this[BUFFERLENGTH] !== 0)
                this.emit('readable');
            if (cb)
                fn(cb);
            return this[FLOWING];
        }
        // at this point the chunk is a buffer or string
        // don't buffer it up or send it to the decoder
        if (!chunk.length) {
            if (this[BUFFERLENGTH] !== 0)
                this.emit('readable');
            if (cb)
                fn(cb);
            return this[FLOWING];
        }
        // fast-path writing strings of same encoding to a stream with
        // an empty buffer, skipping the buffer/decoder dance
        if (typeof chunk === 'string' &&
            // unless it is a string already ready for us to use
            !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
            //@ts-ignore - sinful unsafe type change
            chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
            //@ts-ignore - sinful unsafe type change
            chunk = this[DECODER].write(chunk);
        }
        // Note: flushing CAN potentially switch us into not-flowing mode
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
            this[FLUSH](true);
        if (this[FLOWING])
            this.emit('data', chunk);
        else
            this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0)
            this.emit('readable');
        if (cb)
            fn(cb);
        return this[FLOWING];
    }
    /**
     * Low-level explicit read method.
     *
     * In objectMode, the argument is ignored, and one item is returned if
     * available.
     *
     * `n` is the number of bytes (or in the case of encoding streams,
     * characters) to consume. If `n` is not provided, then the entire buffer
     * is returned, or `null` is returned if no data is available.
     *
     * If `n` is greater that the amount of data in the internal buffer,
     * then `null` is returned.
     */
    read(n) {
        if (this[DESTROYED])
            return null;
        this[DISCARDED] = false;
        if (this[BUFFERLENGTH] === 0 ||
            n === 0 ||
            (n && n > this[BUFFERLENGTH])) {
            this[MAYBE_EMIT_END]();
            return null;
        }
        if (this[OBJECTMODE])
            n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
            // not object mode, so if we have an encoding, then RType is string
            // otherwise, must be Buffer
            this[BUFFER] = [
                (this[ENCODING]
                    ? this[BUFFER].join('')
                    : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])),
            ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [READ](n, chunk) {
        if (this[OBJECTMODE])
            this[BUFFERSHIFT]();
        else {
            const c = chunk;
            if (n === c.length || n === null)
                this[BUFFERSHIFT]();
            else if (typeof c === 'string') {
                this[BUFFER][0] = c.slice(n);
                chunk = c.slice(0, n);
                this[BUFFERLENGTH] -= n;
            }
            else {
                this[BUFFER][0] = c.subarray(n);
                chunk = c.subarray(0, n);
                this[BUFFERLENGTH] -= n;
            }
        }
        this.emit('data', chunk);
        if (!this[BUFFER].length && !this[EOF])
            this.emit('drain');
        return chunk;
    }
    end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
            cb = chunk;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (chunk !== undefined)
            this.write(chunk, encoding);
        if (cb)
            this.once('end', cb);
        this[EOF] = true;
        this.writable = false;
        // if we haven't written anything, then go ahead and emit,
        // even if we're not reading.
        // we'll re-emit if a new 'end' listener is added anyway.
        // This makes MP more suitable to write-only use cases.
        if (this[FLOWING] || !this[PAUSED])
            this[MAYBE_EMIT_END]();
        return this;
    }
    // don't let the internal resume be overwritten
    [RESUME]() {
        if (this[DESTROYED])
            return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
            this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit('resume');
        if (this[BUFFER].length)
            this[FLUSH]();
        else if (this[EOF])
            this[MAYBE_EMIT_END]();
        else
            this.emit('drain');
    }
    /**
     * Resume the stream if it is currently in a paused state
     *
     * If called when there are no pipe destinations or `data` event listeners,
     * this will place the stream in a "discarded" state, where all data will
     * be thrown away. The discarded state is removed if a pipe destination or
     * data handler is added, if pause() is called, or if any synchronous or
     * asynchronous iteration is started.
     */
    resume() {
        return this[RESUME]();
    }
    /**
     * Pause the stream
     */
    pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
    }
    /**
     * true if the stream has been forcibly destroyed
     */
    get destroyed() {
        return this[DESTROYED];
    }
    /**
     * true if the stream is currently in a flowing state, meaning that
     * any writes will be immediately emitted.
     */
    get flowing() {
        return this[FLOWING];
    }
    /**
     * true if the stream is currently in a paused state
     */
    get paused() {
        return this[PAUSED];
    }
    [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
            this[BUFFERLENGTH] += 1;
        else
            this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
    }
    [BUFFERSHIFT]() {
        if (this[OBJECTMODE])
            this[BUFFERLENGTH] -= 1;
        else
            this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
    }
    [FLUSH](noDrain = false) {
        do { } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) &&
            this[BUFFER].length);
        if (!noDrain && !this[BUFFER].length && !this[EOF])
            this.emit('drain');
    }
    [FLUSHCHUNK](chunk) {
        this.emit('data', chunk);
        return this[FLOWING];
    }
    /**
     * Pipe all data emitted by this stream into the destination provided.
     *
     * Triggers the flow of data.
     */
    pipe(dest, opts) {
        if (this[DESTROYED])
            return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr)
            opts.end = false;
        else
            opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        // piping an ended stream ends immediately
        if (ended) {
            if (opts.end)
                dest.end();
        }
        else {
            // "as" here just ignores the WType, which pipes don't care about,
            // since they're only consuming from us, and writing to the dest
            this[PIPES].push(!opts.proxyErrors
                ? new Pipe(this, dest, opts)
                : new PipeProxyErrors(this, dest, opts));
            if (this[ASYNC])
                defer(() => this[RESUME]());
            else
                this[RESUME]();
        }
        return dest;
    }
    /**
     * Fully unhook a piped destination stream.
     *
     * If the destination stream was the only consumer of this stream (ie,
     * there are no other piped destinations or `'data'` event listeners)
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    unpipe(dest) {
        const p = this[PIPES].find(p => p.dest === dest);
        if (p) {
            if (this[PIPES].length === 1) {
                if (this[FLOWING] && this[DATALISTENERS] === 0) {
                    this[FLOWING] = false;
                }
                this[PIPES] = [];
            }
            else
                this[PIPES].splice(this[PIPES].indexOf(p), 1);
            p.unpipe();
        }
    }
    /**
     * Alias for {@link Minipass#on}
     */
    addListener(ev, handler) {
        return this.on(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.on`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * - Adding a 'data' event handler will trigger the flow of data
     *
     * - Adding a 'readable' event handler when there is data waiting to be read
     *   will cause 'readable' to be emitted immediately.
     *
     * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
     *   already passed will cause the event to be emitted immediately and all
     *   handlers removed.
     *
     * - Adding an 'error' event handler after an error has been emitted will
     *   cause the event to be re-emitted immediately with the error previously
     *   raised.
     */
    on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === 'data') {
            this[DISCARDED] = false;
            this[DATALISTENERS]++;
            if (!this[PIPES].length && !this[FLOWING]) {
                this[RESUME]();
            }
        }
        else if (ev === 'readable' && this[BUFFERLENGTH] !== 0) {
            super.emit('readable');
        }
        else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
        }
        else if (ev === 'error' && this[EMITTED_ERROR]) {
            const h = handler;
            if (this[ASYNC])
                defer(() => h.call(this, this[EMITTED_ERROR]));
            else
                h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
    }
    /**
     * Alias for {@link Minipass#off}
     */
    removeListener(ev, handler) {
        return this.off(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.off`
     *
     * If a 'data' event handler is removed, and it was the last consumer
     * (ie, there are no pipe destinations or other 'data' event listeners),
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    off(ev, handler) {
        const ret = super.off(ev, handler);
        // if we previously had listeners, and now we don't, and we don't
        // have any pipes, then stop the flow, unless it's been explicitly
        // put in a discarded flowing state via stream.resume().
        if (ev === 'data') {
            this[DATALISTENERS] = this.listeners('data').length;
            if (this[DATALISTENERS] === 0 &&
                !this[DISCARDED] &&
                !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * Mostly identical to `EventEmitter.removeAllListeners`
     *
     * If all 'data' event handlers are removed, and they were the last consumer
     * (ie, there are no pipe destinations), then the flow of data will stop
     * until there is another consumer or {@link Minipass#resume} is explicitly
     * called.
     */
    removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === 'data' || ev === undefined) {
            this[DATALISTENERS] = 0;
            if (!this[DISCARDED] && !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * true if the 'end' event has been emitted
     */
    get emittedEnd() {
        return this[EMITTED_END];
    }
    [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] &&
            !this[EMITTED_END] &&
            !this[DESTROYED] &&
            this[BUFFER].length === 0 &&
            this[EOF]) {
            this[EMITTING_END] = true;
            this.emit('end');
            this.emit('prefinish');
            this.emit('finish');
            if (this[CLOSED])
                this.emit('close');
            this[EMITTING_END] = false;
        }
    }
    /**
     * Mostly identical to `EventEmitter.emit`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * If the stream has been destroyed, and the event is something other
     * than 'close' or 'error', then `false` is returned and no handlers
     * are called.
     *
     * If the event is 'end', and has already been emitted, then the event
     * is ignored. If the stream is in a paused or non-flowing state, then
     * the event will be deferred until data flow resumes. If the stream is
     * async, then handlers will be called on the next tick rather than
     * immediately.
     *
     * If the event is 'close', and 'end' has not yet been emitted, then
     * the event will be deferred until after 'end' is emitted.
     *
     * If the event is 'error', and an AbortSignal was provided for the stream,
     * and there are no listeners, then the event is ignored, matching the
     * behavior of node core streams in the presense of an AbortSignal.
     *
     * If the event is 'finish' or 'prefinish', then all listeners will be
     * removed after emitting the event, to prevent double-firing.
     */
    emit(ev, ...args) {
        const data = args[0];
        // error and close are only events allowed after calling destroy()
        if (ev !== 'error' &&
            ev !== 'close' &&
            ev !== DESTROYED &&
            this[DESTROYED]) {
            return false;
        }
        else if (ev === 'data') {
            return !this[OBJECTMODE] && !data
                ? false
                : this[ASYNC]
                    ? (defer(() => this[EMITDATA](data)), true)
                    : this[EMITDATA](data);
        }
        else if (ev === 'end') {
            return this[EMITEND]();
        }
        else if (ev === 'close') {
            this[CLOSED] = true;
            // don't emit close before 'end' and 'finish'
            if (!this[EMITTED_END] && !this[DESTROYED])
                return false;
            const ret = super.emit('close');
            this.removeAllListeners('close');
            return ret;
        }
        else if (ev === 'error') {
            this[EMITTED_ERROR] = data;
            super.emit(ERROR, data);
            const ret = !this[SIGNAL] || this.listeners('error').length
                ? super.emit('error', data)
                : false;
            this[MAYBE_EMIT_END]();
            return ret;
        }
        else if (ev === 'resume') {
            const ret = super.emit('resume');
            this[MAYBE_EMIT_END]();
            return ret;
        }
        else if (ev === 'finish' || ev === 'prefinish') {
            const ret = super.emit(ev);
            this.removeAllListeners(ev);
            return ret;
        }
        // Some other unknown event
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITDATA](data) {
        for (const p of this[PIPES]) {
            if (p.dest.write(data) === false)
                this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit('data', data);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITEND]() {
        if (this[EMITTED_END])
            return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC]
            ? (defer(() => this[EMITEND2]()), true)
            : this[EMITEND2]();
    }
    [EMITEND2]() {
        if (this[DECODER]) {
            const data = this[DECODER].end();
            if (data) {
                for (const p of this[PIPES]) {
                    p.dest.write(data);
                }
                if (!this[DISCARDED])
                    super.emit('data', data);
            }
        }
        for (const p of this[PIPES]) {
            p.end();
        }
        const ret = super.emit('end');
        this.removeAllListeners('end');
        return ret;
    }
    /**
     * Return a Promise that resolves to an array of all emitted data once
     * the stream ends.
     */
    async collect() {
        const buf = Object.assign([], {
            dataLength: 0,
        });
        if (!this[OBJECTMODE])
            buf.dataLength = 0;
        // set the promise first, in case an error is raised
        // by triggering the flow here.
        const p = this.promise();
        this.on('data', c => {
            buf.push(c);
            if (!this[OBJECTMODE])
                buf.dataLength += c.length;
        });
        await p;
        return buf;
    }
    /**
     * Return a Promise that resolves to the concatenation of all emitted data
     * once the stream ends.
     *
     * Not allowed on objectMode streams.
     */
    async concat() {
        if (this[OBJECTMODE]) {
            throw new Error('cannot concat in objectMode');
        }
        const buf = await this.collect();
        return (this[ENCODING]
            ? buf.join('')
            : Buffer.concat(buf, buf.dataLength));
    }
    /**
     * Return a void Promise that resolves once the stream ends.
     */
    async promise() {
        return new Promise((resolve, reject) => {
            this.on(DESTROYED, () => reject(new Error('stream destroyed')));
            this.on('error', er => reject(er));
            this.on('end', () => resolve());
        });
    }
    /**
     * Asynchronous `for await of` iteration.
     *
     * This will continue emitting all chunks until the stream terminates.
     */
    [Symbol.asyncIterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = async () => {
            this.pause();
            stopped = true;
            return { value: undefined, done: true };
        };
        const next = () => {
            if (stopped)
                return stop();
            const res = this.read();
            if (res !== null)
                return Promise.resolve({ done: false, value: res });
            if (this[EOF])
                return stop();
            let resolve;
            let reject;
            const onerr = (er) => {
                this.off('data', ondata);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                stop();
                reject(er);
            };
            const ondata = (value) => {
                this.off('error', onerr);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                this.pause();
                resolve({ value, done: !!this[EOF] });
            };
            const onend = () => {
                this.off('error', onerr);
                this.off('data', ondata);
                this.off(DESTROYED, ondestroy);
                stop();
                resolve({ done: true, value: undefined });
            };
            const ondestroy = () => onerr(new Error('stream destroyed'));
            return new Promise((res, rej) => {
                reject = rej;
                resolve = res;
                this.once(DESTROYED, ondestroy);
                this.once('error', onerr);
                this.once('end', onend);
                this.once('data', ondata);
            });
        };
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }
    /**
     * Synchronous `for of` iteration.
     *
     * The iteration will terminate when the internal buffer runs out, even
     * if the stream has not yet terminated.
     */
    [Symbol.iterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = () => {
            this.pause();
            this.off(ERROR, stop);
            this.off(DESTROYED, stop);
            this.off('end', stop);
            stopped = true;
            return { done: true, value: undefined };
        };
        const next = () => {
            if (stopped)
                return stop();
            const value = this.read();
            return value === null ? stop() : { done: false, value };
        };
        this.once('end', stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    /**
     * Destroy a stream, preventing it from being used for any further purpose.
     *
     * If the stream has a `close()` method, then it will be called on
     * destruction.
     *
     * After destruction, any attempt to write data, read data, or emit most
     * events will be ignored.
     *
     * If an error argument is provided, then it will be emitted in an
     * 'error' event.
     */
    destroy(er) {
        if (this[DESTROYED]) {
            if (er)
                this.emit('error', er);
            else
                this.emit(DESTROYED);
            return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        // throw away all buffered data, it's never coming out
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === 'function' && !this[CLOSED])
            wc.close();
        if (er)
            this.emit('error', er);
        // if no error to emit, still reject pending promises
        else
            this.emit(DESTROYED);
        return this;
    }
    /**
     * Alias for {@link isStream}
     *
     * Former export location, maintained for backwards compatibility.
     *
     * @deprecated
     */
    static get isStream() {
        return exports.isStream;
    }
}
exports.Minipass = Minipass;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9569:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathScurry = exports.Path = exports.PathScurryDarwin = exports.PathScurryPosix = exports.PathScurryWin32 = exports.PathScurryBase = exports.PathPosix = exports.PathWin32 = exports.PathBase = exports.ChildrenCache = exports.ResolveCache = void 0;
const lru_cache_1 = __nccwpck_require__(7433);
const path_1 = __nccwpck_require__(1017);
const url_1 = __nccwpck_require__(7310);
const actualFS = __importStar(__nccwpck_require__(7147));
const fs_1 = __nccwpck_require__(7147);
const realpathSync = fs_1.realpathSync.native;
// TODO: test perf of fs/promises realpath vs realpathCB,
// since the promises one uses realpath.native
const promises_1 = __nccwpck_require__(3292);
const minipass_1 = __nccwpck_require__(8865);
const defaultFS = {
    lstatSync: fs_1.lstatSync,
    readdir: fs_1.readdir,
    readdirSync: fs_1.readdirSync,
    readlinkSync: fs_1.readlinkSync,
    realpathSync,
    promises: {
        lstat: promises_1.lstat,
        readdir: promises_1.readdir,
        readlink: promises_1.readlink,
        realpath: promises_1.realpath,
    },
};
// if they just gave us require('fs') then use our default
const fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS
    ? defaultFS
    : {
        ...defaultFS,
        ...fsOption,
        promises: {
            ...defaultFS.promises,
            ...(fsOption.promises || {}),
        },
    };
// turn something like //?/c:/ into c:\
const uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
const uncToDrive = (rootPath) => rootPath.replace(/\//g, '\\').replace(uncDriveRegexp, '$1\\');
// windows paths are separated by either / or \
const eitherSep = /[\\\/]/;
const UNKNOWN = 0; // may not even exist, for all we know
const IFIFO = 0b0001;
const IFCHR = 0b0010;
const IFDIR = 0b0100;
const IFBLK = 0b0110;
const IFREG = 0b1000;
const IFLNK = 0b1010;
const IFSOCK = 0b1100;
const IFMT = 0b1111;
// mask to unset low 4 bits
const IFMT_UNKNOWN = ~IFMT;
// set after successfully calling readdir() and getting entries.
const READDIR_CALLED = 16;
// set after a successful lstat()
const LSTAT_CALLED = 32;
// set if an entry (or one of its parents) is definitely not a dir
const ENOTDIR = 64;
// set if an entry (or one of its parents) does not exist
// (can also be set on lstat errors like EACCES or ENAMETOOLONG)
const ENOENT = 128;
// cannot have child entries -- also verify &IFMT is either IFDIR or IFLNK
// set if we fail to readlink
const ENOREADLINK = 256;
// set if we know realpath() will fail
const ENOREALPATH = 512;
const ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
const TYPEMASK = 1023;
const entToType = (s) => s.isFile()
    ? IFREG
    : s.isDirectory()
        ? IFDIR
        : s.isSymbolicLink()
            ? IFLNK
            : s.isCharacterDevice()
                ? IFCHR
                : s.isBlockDevice()
                    ? IFBLK
                    : s.isSocket()
                        ? IFSOCK
                        : s.isFIFO()
                            ? IFIFO
                            : UNKNOWN;
// normalize unicode path names
const normalizeCache = new Map();
const normalize = (s) => {
    const c = normalizeCache.get(s);
    if (c)
        return c;
    const n = s.normalize('NFKD');
    normalizeCache.set(s, n);
    return n;
};
const normalizeNocaseCache = new Map();
const normalizeNocase = (s) => {
    const c = normalizeNocaseCache.get(s);
    if (c)
        return c;
    const n = normalize(s.toLowerCase());
    normalizeNocaseCache.set(s, n);
    return n;
};
/**
 * An LRUCache for storing resolved path strings or Path objects.
 * @internal
 */
class ResolveCache extends lru_cache_1.LRUCache {
    constructor() {
        super({ max: 256 });
    }
}
exports.ResolveCache = ResolveCache;
// In order to prevent blowing out the js heap by allocating hundreds of
// thousands of Path entries when walking extremely large trees, the "children"
// in this tree are represented by storing an array of Path entries in an
// LRUCache, indexed by the parent.  At any time, Path.children() may return an
// empty array, indicating that it doesn't know about any of its children, and
// thus has to rebuild that cache.  This is fine, it just means that we don't
// benefit as much from having the cached entries, but huge directory walks
// don't blow out the stack, and smaller ones are still as fast as possible.
//
//It does impose some complexity when building up the readdir data, because we
//need to pass a reference to the children array that we started with.
/**
 * an LRUCache for storing child entries.
 * @internal
 */
class ChildrenCache extends lru_cache_1.LRUCache {
    constructor(maxSize = 16 * 1024) {
        super({
            maxSize,
            // parent + children
            sizeCalculation: a => a.length + 1,
        });
    }
}
exports.ChildrenCache = ChildrenCache;
const setAsCwd = Symbol('PathScurry setAsCwd');
/**
 * Path objects are sort of like a super-powered
 * {@link https://nodejs.org/docs/latest/api/fs.html#class-fsdirent fs.Dirent}
 *
 * Each one represents a single filesystem entry on disk, which may or may not
 * exist. It includes methods for reading various types of information via
 * lstat, readlink, and readdir, and caches all information to the greatest
 * degree possible.
 *
 * Note that fs operations that would normally throw will instead return an
 * "empty" value. This is in order to prevent excessive overhead from error
 * stack traces.
 */
class PathBase {
    /**
     * the basename of this path
     *
     * **Important**: *always* test the path name against any test string
     * usingthe {@link isNamed} method, and not by directly comparing this
     * string. Otherwise, unicode path strings that the system sees as identical
     * will not be properly treated as the same path, leading to incorrect
     * behavior and possible security issues.
     */
    name;
    /**
     * the Path entry corresponding to the path root.
     *
     * @internal
     */
    root;
    /**
     * All roots found within the current PathScurry family
     *
     * @internal
     */
    roots;
    /**
     * a reference to the parent path, or undefined in the case of root entries
     *
     * @internal
     */
    parent;
    /**
     * boolean indicating whether paths are compared case-insensitively
     * @internal
     */
    nocase;
    // potential default fs override
    #fs;
    // Stats fields
    #dev;
    get dev() {
        return this.#dev;
    }
    #mode;
    get mode() {
        return this.#mode;
    }
    #nlink;
    get nlink() {
        return this.#nlink;
    }
    #uid;
    get uid() {
        return this.#uid;
    }
    #gid;
    get gid() {
        return this.#gid;
    }
    #rdev;
    get rdev() {
        return this.#rdev;
    }
    #blksize;
    get blksize() {
        return this.#blksize;
    }
    #ino;
    get ino() {
        return this.#ino;
    }
    #size;
    get size() {
        return this.#size;
    }
    #blocks;
    get blocks() {
        return this.#blocks;
    }
    #atimeMs;
    get atimeMs() {
        return this.#atimeMs;
    }
    #mtimeMs;
    get mtimeMs() {
        return this.#mtimeMs;
    }
    #ctimeMs;
    get ctimeMs() {
        return this.#ctimeMs;
    }
    #birthtimeMs;
    get birthtimeMs() {
        return this.#birthtimeMs;
    }
    #atime;
    get atime() {
        return this.#atime;
    }
    #mtime;
    get mtime() {
        return this.#mtime;
    }
    #ctime;
    get ctime() {
        return this.#ctime;
    }
    #birthtime;
    get birthtime() {
        return this.#birthtime;
    }
    #matchName;
    #depth;
    #fullpath;
    #fullpathPosix;
    #relative;
    #relativePosix;
    #type;
    #children;
    #linkTarget;
    #realpath;
    /**
     * This property is for compatibility with the Dirent class as of
     * Node v20, where Dirent['path'] refers to the path of the directory
     * that was passed to readdir.  So, somewhat counterintuitively, this
     * property refers to the *parent* path, not the path object itself.
     * For root entries, it's the path to the entry itself.
     */
    get path() {
        return (this.parent || this).fullpath();
    }
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        this.name = name;
        this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
        this.#type = type & TYPEMASK;
        this.nocase = nocase;
        this.roots = roots;
        this.root = root || this;
        this.#children = children;
        this.#fullpath = opts.fullpath;
        this.#relative = opts.relative;
        this.#relativePosix = opts.relativePosix;
        this.parent = opts.parent;
        if (this.parent) {
            this.#fs = this.parent.#fs;
        }
        else {
            this.#fs = fsFromOption(opts.fs);
        }
    }
    /**
     * Returns the depth of the Path object from its root.
     *
     * For example, a path at `/foo/bar` would have a depth of 2.
     */
    depth() {
        if (this.#depth !== undefined)
            return this.#depth;
        if (!this.parent)
            return (this.#depth = 0);
        return (this.#depth = this.parent.depth() + 1);
    }
    /**
     * @internal
     */
    childrenCache() {
        return this.#children;
    }
    /**
     * Get the Path object referenced by the string path, resolved from this Path
     */
    resolve(path) {
        if (!path) {
            return this;
        }
        const rootPath = this.getRootString(path);
        const dir = path.substring(rootPath.length);
        const dirParts = dir.split(this.splitSep);
        const result = rootPath
            ? this.getRoot(rootPath).#resolveParts(dirParts)
            : this.#resolveParts(dirParts);
        return result;
    }
    #resolveParts(dirParts) {
        let p = this;
        for (const part of dirParts) {
            p = p.child(part);
        }
        return p;
    }
    /**
     * Returns the cached children Path objects, if still available.  If they
     * have fallen out of the cache, then returns an empty array, and resets the
     * READDIR_CALLED bit, so that future calls to readdir() will require an fs
     * lookup.
     *
     * @internal
     */
    children() {
        const cached = this.#children.get(this);
        if (cached) {
            return cached;
        }
        const children = Object.assign([], { provisional: 0 });
        this.#children.set(this, children);
        this.#type &= ~READDIR_CALLED;
        return children;
    }
    /**
     * Resolves a path portion and returns or creates the child Path.
     *
     * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
     * `'..'`.
     *
     * This should not be called directly.  If `pathPart` contains any path
     * separators, it will lead to unsafe undefined behavior.
     *
     * Use `Path.resolve()` instead.
     *
     * @internal
     */
    child(pathPart, opts) {
        if (pathPart === '' || pathPart === '.') {
            return this;
        }
        if (pathPart === '..') {
            return this.parent || this;
        }
        // find the child
        const children = this.children();
        const name = this.nocase
            ? normalizeNocase(pathPart)
            : normalize(pathPart);
        for (const p of children) {
            if (p.#matchName === name) {
                return p;
            }
        }
        // didn't find it, create provisional child, since it might not
        // actually exist.  If we know the parent isn't a dir, then
        // in fact it CAN'T exist.
        const s = this.parent ? this.sep : '';
        const fullpath = this.#fullpath
            ? this.#fullpath + s + pathPart
            : undefined;
        const pchild = this.newChild(pathPart, UNKNOWN, {
            ...opts,
            parent: this,
            fullpath,
        });
        if (!this.canReaddir()) {
            pchild.#type |= ENOENT;
        }
        // don't have to update provisional, because if we have real children,
        // then provisional is set to children.length, otherwise a lower number
        children.push(pchild);
        return pchild;
    }
    /**
     * The relative path from the cwd. If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpath()
     */
    relative() {
        if (this.#relative !== undefined) {
            return this.#relative;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#relative = this.name);
        }
        const pv = p.relative();
        return pv + (!pv || !p.parent ? '' : this.sep) + name;
    }
    /**
     * The relative path from the cwd, using / as the path separator.
     * If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpathPosix()
     * On posix systems, this is identical to relative().
     */
    relativePosix() {
        if (this.sep === '/')
            return this.relative();
        if (this.#relativePosix !== undefined)
            return this.#relativePosix;
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#relativePosix = this.fullpathPosix());
        }
        const pv = p.relativePosix();
        return pv + (!pv || !p.parent ? '' : '/') + name;
    }
    /**
     * The fully resolved path string for this Path entry
     */
    fullpath() {
        if (this.#fullpath !== undefined) {
            return this.#fullpath;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#fullpath = this.name);
        }
        const pv = p.fullpath();
        const fp = pv + (!p.parent ? '' : this.sep) + name;
        return (this.#fullpath = fp);
    }
    /**
     * On platforms other than windows, this is identical to fullpath.
     *
     * On windows, this is overridden to return the forward-slash form of the
     * full UNC path.
     */
    fullpathPosix() {
        if (this.#fullpathPosix !== undefined)
            return this.#fullpathPosix;
        if (this.sep === '/')
            return (this.#fullpathPosix = this.fullpath());
        if (!this.parent) {
            const p = this.fullpath().replace(/\\/g, '/');
            if (/^[a-z]:\//i.test(p)) {
                return (this.#fullpathPosix = `//?/${p}`);
            }
            else {
                return (this.#fullpathPosix = p);
            }
        }
        const p = this.parent;
        const pfpp = p.fullpathPosix();
        const fpp = pfpp + (!pfpp || !p.parent ? '' : '/') + this.name;
        return (this.#fullpathPosix = fpp);
    }
    /**
     * Is the Path of an unknown type?
     *
     * Note that we might know *something* about it if there has been a previous
     * filesystem operation, for example that it does not exist, or is not a
     * link, or whether it has child entries.
     */
    isUnknown() {
        return (this.#type & IFMT) === UNKNOWN;
    }
    isType(type) {
        return this[`is${type}`]();
    }
    getType() {
        return this.isUnknown()
            ? 'Unknown'
            : this.isDirectory()
                ? 'Directory'
                : this.isFile()
                    ? 'File'
                    : this.isSymbolicLink()
                        ? 'SymbolicLink'
                        : this.isFIFO()
                            ? 'FIFO'
                            : this.isCharacterDevice()
                                ? 'CharacterDevice'
                                : this.isBlockDevice()
                                    ? 'BlockDevice'
                                    : /* c8 ignore start */ this.isSocket()
                                        ? 'Socket'
                                        : 'Unknown';
        /* c8 ignore stop */
    }
    /**
     * Is the Path a regular file?
     */
    isFile() {
        return (this.#type & IFMT) === IFREG;
    }
    /**
     * Is the Path a directory?
     */
    isDirectory() {
        return (this.#type & IFMT) === IFDIR;
    }
    /**
     * Is the path a character device?
     */
    isCharacterDevice() {
        return (this.#type & IFMT) === IFCHR;
    }
    /**
     * Is the path a block device?
     */
    isBlockDevice() {
        return (this.#type & IFMT) === IFBLK;
    }
    /**
     * Is the path a FIFO pipe?
     */
    isFIFO() {
        return (this.#type & IFMT) === IFIFO;
    }
    /**
     * Is the path a socket?
     */
    isSocket() {
        return (this.#type & IFMT) === IFSOCK;
    }
    /**
     * Is the path a symbolic link?
     */
    isSymbolicLink() {
        return (this.#type & IFLNK) === IFLNK;
    }
    /**
     * Return the entry if it has been subject of a successful lstat, or
     * undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* simply
     * mean that we haven't called lstat on it.
     */
    lstatCached() {
        return this.#type & LSTAT_CALLED ? this : undefined;
    }
    /**
     * Return the cached link target if the entry has been the subject of a
     * successful readlink, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readlink() has been called at some point.
     */
    readlinkCached() {
        return this.#linkTarget;
    }
    /**
     * Returns the cached realpath target if the entry has been the subject
     * of a successful realpath, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * realpath() has been called at some point.
     */
    realpathCached() {
        return this.#realpath;
    }
    /**
     * Returns the cached child Path entries array if the entry has been the
     * subject of a successful readdir(), or [] otherwise.
     *
     * Does not read the filesystem, so an empty array *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readdir() has been called recently enough to still be valid.
     */
    readdirCached() {
        const children = this.children();
        return children.slice(0, children.provisional);
    }
    /**
     * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
     * any indication that readlink will definitely fail.
     *
     * Returns false if the path is known to not be a symlink, if a previous
     * readlink failed, or if the entry does not exist.
     */
    canReadlink() {
        if (this.#linkTarget)
            return true;
        if (!this.parent)
            return false;
        // cases where it cannot possibly succeed
        const ifmt = this.#type & IFMT;
        return !((ifmt !== UNKNOWN && ifmt !== IFLNK) ||
            this.#type & ENOREADLINK ||
            this.#type & ENOENT);
    }
    /**
     * Return true if readdir has previously been successfully called on this
     * path, indicating that cachedReaddir() is likely valid.
     */
    calledReaddir() {
        return !!(this.#type & READDIR_CALLED);
    }
    /**
     * Returns true if the path is known to not exist. That is, a previous lstat
     * or readdir failed to verify its existence when that would have been
     * expected, or a parent entry was marked either enoent or enotdir.
     */
    isENOENT() {
        return !!(this.#type & ENOENT);
    }
    /**
     * Return true if the path is a match for the given path name.  This handles
     * case sensitivity and unicode normalization.
     *
     * Note: even on case-sensitive systems, it is **not** safe to test the
     * equality of the `.name` property to determine whether a given pathname
     * matches, due to unicode normalization mismatches.
     *
     * Always use this method instead of testing the `path.name` property
     * directly.
     */
    isNamed(n) {
        return !this.nocase
            ? this.#matchName === normalize(n)
            : this.#matchName === normalizeNocase(n);
    }
    /**
     * Return the Path object corresponding to the target of a symbolic link.
     *
     * If the Path is not a symbolic link, or if the readlink call fails for any
     * reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     */
    async readlink() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */
        // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */
        try {
            const read = await this.#fs.promises.readlink(this.fullpath());
            const linkTarget = this.parent.resolve(read);
            if (linkTarget) {
                return (this.#linkTarget = linkTarget);
            }
        }
        catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    /**
     * Synchronous {@link PathBase.readlink}
     */
    readlinkSync() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */
        // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */
        try {
            const read = this.#fs.readlinkSync(this.fullpath());
            const linkTarget = this.parent.resolve(read);
            if (linkTarget) {
                return (this.#linkTarget = linkTarget);
            }
        }
        catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    #readdirSuccess(children) {
        // succeeded, mark readdir called bit
        this.#type |= READDIR_CALLED;
        // mark all remaining provisional children as ENOENT
        for (let p = children.provisional; p < children.length; p++) {
            children[p].#markENOENT();
        }
    }
    #markENOENT() {
        // mark as UNKNOWN and ENOENT
        if (this.#type & ENOENT)
            return;
        this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
        this.#markChildrenENOENT();
    }
    #markChildrenENOENT() {
        // all children are provisional and do not exist
        const children = this.children();
        children.provisional = 0;
        for (const p of children) {
            p.#markENOENT();
        }
    }
    #markENOREALPATH() {
        this.#type |= ENOREALPATH;
        this.#markENOTDIR();
    }
    // save the information when we know the entry is not a dir
    #markENOTDIR() {
        // entry is not a directory, so any children can't exist.
        // this *should* be impossible, since any children created
        // after it's been marked ENOTDIR should be marked ENOENT,
        // so it won't even get to this point.
        /* c8 ignore start */
        if (this.#type & ENOTDIR)
            return;
        /* c8 ignore stop */
        let t = this.#type;
        // this could happen if we stat a dir, then delete it,
        // then try to read it or one of its children.
        if ((t & IFMT) === IFDIR)
            t &= IFMT_UNKNOWN;
        this.#type = t | ENOTDIR;
        this.#markChildrenENOENT();
    }
    #readdirFail(code = '') {
        // markENOTDIR and markENOENT also set provisional=0
        if (code === 'ENOTDIR' || code === 'EPERM') {
            this.#markENOTDIR();
        }
        else if (code === 'ENOENT') {
            this.#markENOENT();
        }
        else {
            this.children().provisional = 0;
        }
    }
    #lstatFail(code = '') {
        // Windows just raises ENOENT in this case, disable for win CI
        /* c8 ignore start */
        if (code === 'ENOTDIR') {
            // already know it has a parent by this point
            const p = this.parent;
            p.#markENOTDIR();
        }
        else if (code === 'ENOENT') {
            /* c8 ignore stop */
            this.#markENOENT();
        }
    }
    #readlinkFail(code = '') {
        let ter = this.#type;
        ter |= ENOREADLINK;
        if (code === 'ENOENT')
            ter |= ENOENT;
        // windows gets a weird error when you try to readlink a file
        if (code === 'EINVAL' || code === 'UNKNOWN') {
            // exists, but not a symlink, we don't know WHAT it is, so remove
            // all IFMT bits.
            ter &= IFMT_UNKNOWN;
        }
        this.#type = ter;
        // windows just gets ENOENT in this case.  We do cover the case,
        // just disabled because it's impossible on Windows CI
        /* c8 ignore start */
        if (code === 'ENOTDIR' && this.parent) {
            this.parent.#markENOTDIR();
        }
        /* c8 ignore stop */
    }
    #readdirAddChild(e, c) {
        return (this.#readdirMaybePromoteChild(e, c) ||
            this.#readdirAddNewChild(e, c));
    }
    #readdirAddNewChild(e, c) {
        // alloc new entry at head, so it's never provisional
        const type = entToType(e);
        const child = this.newChild(e.name, type, { parent: this });
        const ifmt = child.#type & IFMT;
        if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
            child.#type |= ENOTDIR;
        }
        c.unshift(child);
        c.provisional++;
        return child;
    }
    #readdirMaybePromoteChild(e, c) {
        for (let p = c.provisional; p < c.length; p++) {
            const pchild = c[p];
            const name = this.nocase
                ? normalizeNocase(e.name)
                : normalize(e.name);
            if (name !== pchild.#matchName) {
                continue;
            }
            return this.#readdirPromoteChild(e, pchild, p, c);
        }
    }
    #readdirPromoteChild(e, p, index, c) {
        const v = p.name;
        // retain any other flags, but set ifmt from dirent
        p.#type = (p.#type & IFMT_UNKNOWN) | entToType(e);
        // case sensitivity fixing when we learn the true name.
        if (v !== e.name)
            p.name = e.name;
        // just advance provisional index (potentially off the list),
        // otherwise we have to splice/pop it out and re-insert at head
        if (index !== c.provisional) {
            if (index === c.length - 1)
                c.pop();
            else
                c.splice(index, 1);
            c.unshift(p);
        }
        c.provisional++;
        return p;
    }
    /**
     * Call lstat() on this Path, and update all known information that can be
     * determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async lstat() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
                return this;
            }
            catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    /**
     * synchronous {@link PathBase.lstat}
     */
    lstatSync() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(this.#fs.lstatSync(this.fullpath()));
                return this;
            }
            catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    #applyStat(st) {
        const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid, } = st;
        this.#atime = atime;
        this.#atimeMs = atimeMs;
        this.#birthtime = birthtime;
        this.#birthtimeMs = birthtimeMs;
        this.#blksize = blksize;
        this.#blocks = blocks;
        this.#ctime = ctime;
        this.#ctimeMs = ctimeMs;
        this.#dev = dev;
        this.#gid = gid;
        this.#ino = ino;
        this.#mode = mode;
        this.#mtime = mtime;
        this.#mtimeMs = mtimeMs;
        this.#nlink = nlink;
        this.#rdev = rdev;
        this.#size = size;
        this.#uid = uid;
        const ifmt = entToType(st);
        // retain any other flags, but set the ifmt
        this.#type = (this.#type & IFMT_UNKNOWN) | ifmt | LSTAT_CALLED;
        if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
            this.#type |= ENOTDIR;
        }
    }
    #onReaddirCB = [];
    #readdirCBInFlight = false;
    #callOnReaddirCB(children) {
        this.#readdirCBInFlight = false;
        const cbs = this.#onReaddirCB.slice();
        this.#onReaddirCB.length = 0;
        cbs.forEach(cb => cb(null, children));
    }
    /**
     * Standard node-style callback interface to get list of directory entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     *
     * @param cb The callback called with (er, entries).  Note that the `er`
     * param is somewhat extraneous, as all readdir() errors are handled and
     * simply result in an empty set of entries being returned.
     * @param allowZalgo Boolean indicating that immediately known results should
     * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
     * zalgo at your peril, the dark pony lord is devious and unforgiving.
     */
    readdirCB(cb, allowZalgo = false) {
        if (!this.canReaddir()) {
            if (allowZalgo)
                cb(null, []);
            else
                queueMicrotask(() => cb(null, []));
            return;
        }
        const children = this.children();
        if (this.calledReaddir()) {
            const c = children.slice(0, children.provisional);
            if (allowZalgo)
                cb(null, c);
            else
                queueMicrotask(() => cb(null, c));
            return;
        }
        // don't have to worry about zalgo at this point.
        this.#onReaddirCB.push(cb);
        if (this.#readdirCBInFlight) {
            return;
        }
        this.#readdirCBInFlight = true;
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
            if (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            }
            else {
                // if we didn't get an error, we always get entries.
                //@ts-ignore
                for (const e of entries) {
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            }
            this.#callOnReaddirCB(children.slice(0, children.provisional));
            return;
        });
    }
    #asyncReaddirInFlight;
    /**
     * Return an array of known child entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async readdir() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        if (this.#asyncReaddirInFlight) {
            await this.#asyncReaddirInFlight;
        }
        else {
            /* c8 ignore start */
            let resolve = () => { };
            /* c8 ignore stop */
            this.#asyncReaddirInFlight = new Promise(res => (resolve = res));
            try {
                for (const e of await this.#fs.promises.readdir(fullpath, {
                    withFileTypes: true,
                })) {
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            }
            catch (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            }
            this.#asyncReaddirInFlight = undefined;
            resolve();
        }
        return children.slice(0, children.provisional);
    }
    /**
     * synchronous {@link PathBase.readdir}
     */
    readdirSync() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        try {
            for (const e of this.#fs.readdirSync(fullpath, {
                withFileTypes: true,
            })) {
                this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
        }
        catch (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
        }
        return children.slice(0, children.provisional);
    }
    canReaddir() {
        if (this.#type & ENOCHILD)
            return false;
        const ifmt = IFMT & this.#type;
        // we always set ENOTDIR when setting IFMT, so should be impossible
        /* c8 ignore start */
        if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
            return false;
        }
        /* c8 ignore stop */
        return true;
    }
    shouldWalk(dirs, walkFilter) {
        return ((this.#type & IFDIR) === IFDIR &&
            !(this.#type & ENOCHILD) &&
            !dirs.has(this) &&
            (!walkFilter || walkFilter(this)));
    }
    /**
     * Return the Path object corresponding to path as resolved
     * by realpath(3).
     *
     * If the realpath call fails for any reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     * On success, returns a Path object.
     */
    async realpath() {
        if (this.#realpath)
            return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
            return undefined;
        try {
            const rp = await this.#fs.promises.realpath(this.fullpath());
            return (this.#realpath = this.resolve(rp));
        }
        catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Synchronous {@link realpath}
     */
    realpathSync() {
        if (this.#realpath)
            return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
            return undefined;
        try {
            const rp = this.#fs.realpathSync(this.fullpath());
            return (this.#realpath = this.resolve(rp));
        }
        catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Internal method to mark this Path object as the scurry cwd,
     * called by {@link PathScurry#chdir}
     *
     * @internal
     */
    [setAsCwd](oldCwd) {
        if (oldCwd === this)
            return;
        const changed = new Set([]);
        let rp = [];
        let p = this;
        while (p && p.parent) {
            changed.add(p);
            p.#relative = rp.join(this.sep);
            p.#relativePosix = rp.join('/');
            p = p.parent;
            rp.push('..');
        }
        // now un-memoize parents of old cwd
        p = oldCwd;
        while (p && p.parent && !changed.has(p)) {
            p.#relative = undefined;
            p.#relativePosix = undefined;
            p = p.parent;
        }
    }
}
exports.PathBase = PathBase;
/**
 * Path class used on win32 systems
 *
 * Uses `'\\'` as the path separator for returned paths, either `'\\'` or `'/'`
 * as the path separator for parsing paths.
 */
class PathWin32 extends PathBase {
    /**
     * Separator for generating path strings.
     */
    sep = '\\';
    /**
     * Separator for parsing path strings.
     */
    splitSep = eitherSep;
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */
    newChild(name, type = UNKNOWN, opts = {}) {
        return new PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
    /**
     * @internal
     */
    getRootString(path) {
        return path_1.win32.parse(path).root;
    }
    /**
     * @internal
     */
    getRoot(rootPath) {
        rootPath = uncToDrive(rootPath.toUpperCase());
        if (rootPath === this.root.name) {
            return this.root;
        }
        // ok, not that one, check if it matches another we know about
        for (const [compare, root] of Object.entries(this.roots)) {
            if (this.sameRoot(rootPath, compare)) {
                return (this.roots[rootPath] = root);
            }
        }
        // otherwise, have to create a new one.
        return (this.roots[rootPath] = new PathScurryWin32(rootPath, this).root);
    }
    /**
     * @internal
     */
    sameRoot(rootPath, compare = this.root.name) {
        // windows can (rarely) have case-sensitive filesystem, but
        // UNC and drive letters are always case-insensitive, and canonically
        // represented uppercase.
        rootPath = rootPath
            .toUpperCase()
            .replace(/\//g, '\\')
            .replace(uncDriveRegexp, '$1\\');
        return rootPath === compare;
    }
}
exports.PathWin32 = PathWin32;
/**
 * Path class used on all posix systems.
 *
 * Uses `'/'` as the path separator.
 */
class PathPosix extends PathBase {
    /**
     * separator for parsing path strings
     */
    splitSep = '/';
    /**
     * separator for generating path strings
     */
    sep = '/';
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */
    getRootString(path) {
        return path.startsWith('/') ? '/' : '';
    }
    /**
     * @internal
     */
    getRoot(_rootPath) {
        return this.root;
    }
    /**
     * @internal
     */
    newChild(name, type = UNKNOWN, opts = {}) {
        return new PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
}
exports.PathPosix = PathPosix;
/**
 * The base class for all PathScurry classes, providing the interface for path
 * resolution and filesystem operations.
 *
 * Typically, you should *not* instantiate this class directly, but rather one
 * of the platform-specific classes, or the exported {@link PathScurry} which
 * defaults to the current platform.
 */
class PathScurryBase {
    /**
     * The root Path entry for the current working directory of this Scurry
     */
    root;
    /**
     * The string path for the root of this Scurry's current working directory
     */
    rootPath;
    /**
     * A collection of all roots encountered, referenced by rootPath
     */
    roots;
    /**
     * The Path entry corresponding to this PathScurry's current working directory.
     */
    cwd;
    #resolveCache;
    #resolvePosixCache;
    #children;
    /**
     * Perform path comparisons case-insensitively.
     *
     * Defaults true on Darwin and Windows systems, false elsewhere.
     */
    nocase;
    #fs;
    /**
     * This class should not be instantiated directly.
     *
     * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
     *
     * @internal
     */
    constructor(cwd = process.cwd(), pathImpl, sep, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS, } = {}) {
        this.#fs = fsFromOption(fs);
        if (cwd instanceof URL || cwd.startsWith('file://')) {
            cwd = (0, url_1.fileURLToPath)(cwd);
        }
        // resolve and split root, and then add to the store.
        // this is the only time we call path.resolve()
        const cwdPath = pathImpl.resolve(cwd);
        this.roots = Object.create(null);
        this.rootPath = this.parseRootPath(cwdPath);
        this.#resolveCache = new ResolveCache();
        this.#resolvePosixCache = new ResolveCache();
        this.#children = new ChildrenCache(childrenCacheSize);
        const split = cwdPath.substring(this.rootPath.length).split(sep);
        // resolve('/') leaves '', splits to [''], we don't want that.
        if (split.length === 1 && !split[0]) {
            split.pop();
        }
        /* c8 ignore start */
        if (nocase === undefined) {
            throw new TypeError('must provide nocase setting to PathScurryBase ctor');
        }
        /* c8 ignore stop */
        this.nocase = nocase;
        this.root = this.newRoot(this.#fs);
        this.roots[this.rootPath] = this.root;
        let prev = this.root;
        let len = split.length - 1;
        const joinSep = pathImpl.sep;
        let abs = this.rootPath;
        let sawFirst = false;
        for (const part of split) {
            const l = len--;
            prev = prev.child(part, {
                relative: new Array(l).fill('..').join(joinSep),
                relativePosix: new Array(l).fill('..').join('/'),
                fullpath: (abs += (sawFirst ? '' : joinSep) + part),
            });
            sawFirst = true;
        }
        this.cwd = prev;
    }
    /**
     * Get the depth of a provided path, string, or the cwd
     */
    depth(path = this.cwd) {
        if (typeof path === 'string') {
            path = this.cwd.resolve(path);
        }
        return path.depth();
    }
    /**
     * Return the cache of child entries.  Exposed so subclasses can create
     * child Path objects in a platform-specific way.
     *
     * @internal
     */
    childrenCache() {
        return this.#children;
    }
    /**
     * Resolve one or more path strings to a resolved string
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolve(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for (let i = paths.length - 1; i >= 0; i--) {
            const p = paths[i];
            if (!p || p === '.')
                continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolveCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpath();
        this.#resolveCache.set(r, result);
        return result;
    }
    /**
     * Resolve one or more path strings to a resolved string, returning
     * the posix path.  Identical to .resolve() on posix systems, but on
     * windows will return a forward-slash separated UNC path.
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolvePosix(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for (let i = paths.length - 1; i >= 0; i--) {
            const p = paths[i];
            if (!p || p === '.')
                continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolvePosixCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpathPosix();
        this.#resolvePosixCache.set(r, result);
        return result;
    }
    /**
     * find the relative path from the cwd to the supplied path string or entry
     */
    relative(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relative();
    }
    /**
     * find the relative path from the cwd to the supplied path string or
     * entry, using / as the path delimiter, even on Windows.
     */
    relativePosix(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relativePosix();
    }
    /**
     * Return the basename for the provided string or Path object
     */
    basename(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.name;
    }
    /**
     * Return the dirname for the provided string or Path object
     */
    dirname(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return (entry.parent || entry).fullpath();
    }
    async readdir(entry = this.cwd, opts = {
        withFileTypes: true,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes } = opts;
        if (!entry.canReaddir()) {
            return [];
        }
        else {
            const p = await entry.readdir();
            return withFileTypes ? p : p.map(e => e.name);
        }
    }
    readdirSync(entry = this.cwd, opts = {
        withFileTypes: true,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true } = opts;
        if (!entry.canReaddir()) {
            return [];
        }
        else if (withFileTypes) {
            return entry.readdirSync();
        }
        else {
            return entry.readdirSync().map(e => e.name);
        }
    }
    /**
     * Call lstat() on the string or Path object, and update all known
     * information that can be determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async lstat(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstat();
    }
    /**
     * synchronous {@link PathScurryBase.lstat}
     */
    lstatSync(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstatSync();
    }
    async readlink(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.readlink();
        return withFileTypes ? e : e?.fullpath();
    }
    readlinkSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.readlinkSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async realpath(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.realpath();
        return withFileTypes ? e : e?.fullpath();
    }
    realpathSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.realpathSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async walk(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const walk = (dir, cb) => {
            dirs.add(dir);
            dir.readdirCB((er, entries) => {
                /* c8 ignore start */
                if (er) {
                    return cb(er);
                }
                /* c8 ignore stop */
                let len = entries.length;
                if (!len)
                    return cb();
                const next = () => {
                    if (--len === 0) {
                        cb();
                    }
                };
                for (const e of entries) {
                    if (!filter || filter(e)) {
                        results.push(withFileTypes ? e : e.fullpath());
                    }
                    if (follow && e.isSymbolicLink()) {
                        e.realpath()
                            .then(r => (r?.isUnknown() ? r.lstat() : r))
                            .then(r => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
                    }
                    else {
                        if (e.shouldWalk(dirs, walkFilter)) {
                            walk(e, next);
                        }
                        else {
                            next();
                        }
                    }
                }
            }, true); // zalgooooooo
        };
        const start = entry;
        return new Promise((res, rej) => {
            walk(start, er => {
                /* c8 ignore start */
                if (er)
                    return rej(er);
                /* c8 ignore stop */
                res(results);
            });
        });
    }
    walkSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set([entry]);
        for (const dir of dirs) {
            const entries = dir.readdirSync();
            for (const e of entries) {
                if (!filter || filter(e)) {
                    results.push(withFileTypes ? e : e.fullpath());
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync())))
                        continue;
                    if (r.isUnknown())
                        r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
        return results;
    }
    /**
     * Support for `for await`
     *
     * Alias for {@link PathScurryBase.iterate}
     *
     * Note: As of Node 19, this is very slow, compared to other methods of
     * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
     * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
     */
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
    iterate(entry = this.cwd, options = {}) {
        // iterating async over the stream is significantly more performant,
        // especially in the warm-cache scenario, because it buffers up directory
        // entries in the background instead of waiting for a yield for each one.
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            options = entry;
            entry = this.cwd;
        }
        return this.stream(entry, options)[Symbol.asyncIterator]();
    }
    /**
     * Iterating over a PathScurry performs a synchronous walk.
     *
     * Alias for {@link PathScurryBase.iterateSync}
     */
    [Symbol.iterator]() {
        return this.iterateSync();
    }
    *iterateSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        if (!filter || filter(entry)) {
            yield withFileTypes ? entry : entry.fullpath();
        }
        const dirs = new Set([entry]);
        for (const dir of dirs) {
            const entries = dir.readdirSync();
            for (const e of entries) {
                if (!filter || filter(e)) {
                    yield withFileTypes ? e : e.fullpath();
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync())))
                        continue;
                    if (r.isUnknown())
                        r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
    }
    stream(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const queue = [entry];
        let processing = 0;
        const process = () => {
            let paused = false;
            while (!paused) {
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0)
                        results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const onReaddir = (er, entries, didRealpaths = false) => {
                    /* c8 ignore start */
                    if (er)
                        return results.emit('error', er);
                    /* c8 ignore stop */
                    if (follow && !didRealpaths) {
                        const promises = [];
                        for (const e of entries) {
                            if (e.isSymbolicLink()) {
                                promises.push(e
                                    .realpath()
                                    .then((r) => r?.isUnknown() ? r.lstat() : r));
                            }
                        }
                        if (promises.length) {
                            Promise.all(promises).then(() => onReaddir(null, entries, true));
                            return;
                        }
                    }
                    for (const e of entries) {
                        if (e && (!filter || filter(e))) {
                            if (!results.write(withFileTypes ? e : e.fullpath())) {
                                paused = true;
                            }
                        }
                    }
                    processing--;
                    for (const e of entries) {
                        const r = e.realpathCached() || e;
                        if (r.shouldWalk(dirs, walkFilter)) {
                            queue.push(r);
                        }
                    }
                    if (paused && !results.flowing) {
                        results.once('drain', process);
                    }
                    else if (!sync) {
                        process();
                    }
                };
                // zalgo containment
                let sync = true;
                dir.readdirCB(onReaddir, true);
                sync = false;
            }
        };
        process();
        return results;
    }
    streamSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        const dirs = new Set();
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const queue = [entry];
        let processing = 0;
        const process = () => {
            let paused = false;
            while (!paused) {
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0)
                        results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const entries = dir.readdirSync();
                for (const e of entries) {
                    if (!filter || filter(e)) {
                        if (!results.write(withFileTypes ? e : e.fullpath())) {
                            paused = true;
                        }
                    }
                }
                processing--;
                for (const e of entries) {
                    let r = e;
                    if (e.isSymbolicLink()) {
                        if (!(follow && (r = e.realpathSync())))
                            continue;
                        if (r.isUnknown())
                            r.lstatSync();
                    }
                    if (r.shouldWalk(dirs, walkFilter)) {
                        queue.push(r);
                    }
                }
            }
            if (paused && !results.flowing)
                results.once('drain', process);
        };
        process();
        return results;
    }
    chdir(path = this.cwd) {
        const oldCwd = this.cwd;
        this.cwd = typeof path === 'string' ? this.cwd.resolve(path) : path;
        this.cwd[setAsCwd](oldCwd);
    }
}
exports.PathScurryBase = PathScurryBase;
/**
 * Windows implementation of {@link PathScurryBase}
 *
 * Defaults to case insensitve, uses `'\\'` to generate path strings.  Uses
 * {@link PathWin32} for Path objects.
 */
class PathScurryWin32 extends PathScurryBase {
    /**
     * separator for generating path strings
     */
    sep = '\\';
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, path_1.win32, '\\', { ...opts, nocase });
        this.nocase = nocase;
        for (let p = this.cwd; p; p = p.parent) {
            p.nocase = this.nocase;
        }
    }
    /**
     * @internal
     */
    parseRootPath(dir) {
        // if the path starts with a single separator, it's not a UNC, and we'll
        // just get separator as the root, and driveFromUNC will return \
        // In that case, mount \ on the root from the cwd.
        return path_1.win32.parse(dir).root.toUpperCase();
    }
    /**
     * @internal
     */
    newRoot(fs) {
        return new PathWin32(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), { fs });
    }
    /**
     * Return true if the provided path string is an absolute path
     */
    isAbsolute(p) {
        return (p.startsWith('/') || p.startsWith('\\') || /^[a-z]:(\/|\\)/i.test(p));
    }
}
exports.PathScurryWin32 = PathScurryWin32;
/**
 * {@link PathScurryBase} implementation for all posix systems other than Darwin.
 *
 * Defaults to case-sensitive matching, uses `'/'` to generate path strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */
class PathScurryPosix extends PathScurryBase {
    /**
     * separator for generating path strings
     */
    sep = '/';
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = false } = opts;
        super(cwd, path_1.posix, '/', { ...opts, nocase });
        this.nocase = nocase;
    }
    /**
     * @internal
     */
    parseRootPath(_dir) {
        return '/';
    }
    /**
     * @internal
     */
    newRoot(fs) {
        return new PathPosix(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), { fs });
    }
    /**
     * Return true if the provided path string is an absolute path
     */
    isAbsolute(p) {
        return p.startsWith('/');
    }
}
exports.PathScurryPosix = PathScurryPosix;
/**
 * {@link PathScurryBase} implementation for Darwin (macOS) systems.
 *
 * Defaults to case-insensitive matching, uses `'/'` for generating path
 * strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */
class PathScurryDarwin extends PathScurryPosix {
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, { ...opts, nocase });
    }
}
exports.PathScurryDarwin = PathScurryDarwin;
/**
 * Default {@link PathBase} implementation for the current platform.
 *
 * {@link PathWin32} on Windows systems, {@link PathPosix} on all others.
 */
exports.Path = process.platform === 'win32' ? PathWin32 : PathPosix;
/**
 * Default {@link PathScurryBase} implementation for the current platform.
 *
 * {@link PathScurryWin32} on Windows systems, {@link PathScurryDarwin} on
 * Darwin (macOS) systems, {@link PathScurryPosix} on all others.
 */
exports.PathScurry = process.platform === 'win32'
    ? PathScurryWin32
    : process.platform === 'darwin'
        ? PathScurryDarwin
        : PathScurryPosix;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7433:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * @module LRUCache
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LRUCache = void 0;
const perf = typeof performance === 'object' &&
    performance &&
    typeof performance.now === 'function'
    ? performance
    : Date;
const warned = new Set();
/* c8 ignore start */
const PROCESS = (typeof process === 'object' && !!process ? process : {});
/* c8 ignore start */
const emitWarning = (msg, type, code, fn) => {
    typeof PROCESS.emitWarning === 'function'
        ? PROCESS.emitWarning(msg, type, code, fn)
        : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */
if (typeof AC === 'undefined') {
    //@ts-ignore
    AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
            this._onabort.push(fn);
        }
    };
    //@ts-ignore
    AC = class AbortController {
        constructor() {
            warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
            if (this.signal.aborted)
                return;
            //@ts-ignore
            this.signal.reason = reason;
            //@ts-ignore
            this.signal.aborted = true;
            //@ts-ignore
            for (const fn of this.signal._onabort) {
                fn(reason);
            }
            this.signal.onabort?.(reason);
        }
    };
    let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1';
    const warnACPolyfill = () => {
        if (!printACPolyfillWarning)
            return;
        printACPolyfillWarning = false;
        emitWarning('AbortController is not defined. If using lru-cache in ' +
            'node 14, load an AbortController polyfill from the ' +
            '`node-abort-controller` package. A minimal polyfill is ' +
            'provided for use by LRUCache.fetch(), but it should not be ' +
            'relied upon in other contexts (eg, passing it to other APIs that ' +
            'use AbortController/AbortSignal might have undesirable effects). ' +
            'You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.', 'NO_ABORT_CONTROLLER', 'ENOTSUP', warnACPolyfill);
    };
}
/* c8 ignore stop */
const shouldWarn = (code) => !warned.has(code);
const TYPE = Symbol('type');
const isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */
// This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = (max) => !isPosInt(max)
    ? null
    : max <= Math.pow(2, 8)
        ? Uint8Array
        : max <= Math.pow(2, 16)
            ? Uint16Array
            : max <= Math.pow(2, 32)
                ? Uint32Array
                : max <= Number.MAX_SAFE_INTEGER
                    ? ZeroArray
                    : null;
/* c8 ignore stop */
class ZeroArray extends Array {
    constructor(size) {
        super(size);
        this.fill(0);
    }
}
class Stack {
    heap;
    length;
    // private constructor
    static #constructing = false;
    static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls)
            return [];
        Stack.#constructing = true;
        const s = new Stack(max, HeapCls);
        Stack.#constructing = false;
        return s;
    }
    constructor(max, HeapCls) {
        /* c8 ignore start */
        if (!Stack.#constructing) {
            throw new TypeError('instantiate Stack using Stack.create(n)');
        }
        /* c8 ignore stop */
        this.heap = new HeapCls(max);
        this.length = 0;
    }
    push(n) {
        this.heap[this.length++] = n;
    }
    pop() {
        return this.heap[--this.length];
    }
}
/**
 * Default export, the thing you're using this module to get.
 *
 * All properties from the options object (with the exception of
 * {@link OptionsBase.max} and {@link OptionsBase.maxSize}) are added as
 * normal public members. (`max` and `maxBase` are read-only getters.)
 * Changing any of these will alter the defaults for subsequent method calls,
 * but is otherwise safe.
 */
class LRUCache {
    // properties coming in from the options of these, only max and maxSize
    // really *need* to be protected. The rest can be modified, as they just
    // set defaults for various methods.
    #max;
    #maxSize;
    #dispose;
    #disposeAfter;
    #fetchMethod;
    /**
     * {@link LRUCache.OptionsBase.ttl}
     */
    ttl;
    /**
     * {@link LRUCache.OptionsBase.ttlResolution}
     */
    ttlResolution;
    /**
     * {@link LRUCache.OptionsBase.ttlAutopurge}
     */
    ttlAutopurge;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnGet}
     */
    updateAgeOnGet;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnHas}
     */
    updateAgeOnHas;
    /**
     * {@link LRUCache.OptionsBase.allowStale}
     */
    allowStale;
    /**
     * {@link LRUCache.OptionsBase.noDisposeOnSet}
     */
    noDisposeOnSet;
    /**
     * {@link LRUCache.OptionsBase.noUpdateTTL}
     */
    noUpdateTTL;
    /**
     * {@link LRUCache.OptionsBase.maxEntrySize}
     */
    maxEntrySize;
    /**
     * {@link LRUCache.OptionsBase.sizeCalculation}
     */
    sizeCalculation;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
     */
    noDeleteOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
     */
    noDeleteOnStaleGet;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
     */
    allowStaleOnFetchAbort;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
     */
    allowStaleOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.ignoreFetchAbort}
     */
    ignoreFetchAbort;
    // computed properties
    #size;
    #calculatedSize;
    #keyMap;
    #keyList;
    #valList;
    #next;
    #prev;
    #head;
    #tail;
    #free;
    #disposed;
    #sizes;
    #starts;
    #ttls;
    #hasDispose;
    #hasFetchMethod;
    #hasDisposeAfter;
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */
    static unsafeExposeInternals(c) {
        return {
            // properties
            starts: c.#starts,
            ttls: c.#ttls,
            sizes: c.#sizes,
            keyMap: c.#keyMap,
            keyList: c.#keyList,
            valList: c.#valList,
            next: c.#next,
            prev: c.#prev,
            get head() {
                return c.#head;
            },
            get tail() {
                return c.#tail;
            },
            free: c.#free,
            // methods
            isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
            backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
            moveToTail: (index) => c.#moveToTail(index),
            indexes: (options) => c.#indexes(options),
            rindexes: (options) => c.#rindexes(options),
            isStale: (index) => c.#isStale(index),
        };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */
    get max() {
        return this.#max;
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */
    get maxSize() {
        return this.#maxSize;
    }
    /**
     * The total computed size of items in the cache (read-only)
     */
    get calculatedSize() {
        return this.#calculatedSize;
    }
    /**
     * The number of items stored in the cache (read-only)
     */
    get size() {
        return this.#size;
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */
    get fetchMethod() {
        return this.#fetchMethod;
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */
    get dispose() {
        return this.#dispose;
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */
    get disposeAfter() {
        return this.#disposeAfter;
    }
    constructor(options) {
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort, } = options;
        if (max !== 0 && !isPosInt(max)) {
            throw new TypeError('max option must be a nonnegative integer');
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
            throw new Error('invalid max value: ' + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
                throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize');
            }
            if (typeof this.sizeCalculation !== 'function') {
                throw new TypeError('sizeCalculation set to non-function');
            }
        }
        if (fetchMethod !== undefined &&
            typeof fetchMethod !== 'function') {
            throw new TypeError('fetchMethod must be a function if specified');
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = new Map();
        this.#keyList = new Array(max).fill(undefined);
        this.#valList = new Array(max).fill(undefined);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === 'function') {
            this.#dispose = dispose;
        }
        if (typeof disposeAfter === 'function') {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
        }
        else {
            this.#disposeAfter = undefined;
            this.#disposed = undefined;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        // NB: maxEntrySize is set to maxSize if it's set
        if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
                if (!isPosInt(this.#maxSize)) {
                    throw new TypeError('maxSize must be a positive integer if specified');
                }
            }
            if (!isPosInt(this.maxEntrySize)) {
                throw new TypeError('maxEntrySize must be a positive integer if specified');
            }
            this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution =
            isPosInt(ttlResolution) || ttlResolution === 0
                ? ttlResolution
                : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
            if (!isPosInt(this.ttl)) {
                throw new TypeError('ttl must be a positive integer if specified');
            }
            this.#initializeTTLTracking();
        }
        // do not allow completely unbounded caches
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError('At least one of max, maxSize, or ttl is required');
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = 'LRU_CACHE_UNBOUNDED';
            if (shouldWarn(code)) {
                warned.add(code);
                const msg = 'TTL caching without ttlAutopurge, max, or maxSize can ' +
                    'result in unbounded memory consumption.';
                emitWarning(msg, 'UnboundedCacheWarning', code, LRUCache);
            }
        }
    }
    /**
     * Return the remaining TTL time for a given entry key
     */
    getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
    }
    #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now()) => {
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
                const t = setTimeout(() => {
                    if (this.#isStale(index)) {
                        this.delete(this.#keyList[index]);
                    }
                }, ttl + 1);
                // unref() not supported on all platforms
                /* c8 ignore start */
                if (t.unref) {
                    t.unref();
                }
                /* c8 ignore stop */
            }
        };
        this.#updateItemAge = index => {
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index) => {
            if (ttls[index]) {
                const ttl = ttls[index];
                const start = starts[index];
                status.ttl = ttl;
                status.start = start;
                status.now = cachedNow || getNow();
                const age = status.now - start;
                status.remainingTTL = ttl - age;
            }
        };
        // debounce calls to perf.now() to 1s so we're not hitting
        // that costly call repeatedly.
        let cachedNow = 0;
        const getNow = () => {
            const n = perf.now();
            if (this.ttlResolution > 0) {
                cachedNow = n;
                const t = setTimeout(() => (cachedNow = 0), this.ttlResolution);
                // not available on all platforms
                /* c8 ignore start */
                if (t.unref) {
                    t.unref();
                }
                /* c8 ignore stop */
            }
            return n;
        };
        this.getRemainingTTL = key => {
            const index = this.#keyMap.get(key);
            if (index === undefined) {
                return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (ttl === 0 || start === 0) {
                return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
        };
        this.#isStale = index => {
            return (ttls[index] !== 0 &&
                starts[index] !== 0 &&
                (cachedNow || getNow()) - starts[index] > ttls[index]);
        };
    }
    // conditionally set private methods related to TTL
    #updateItemAge = () => { };
    #statusTTL = () => { };
    #setItemTTL = () => { };
    /* c8 ignore stop */
    #isStale = () => false;
    #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = index => {
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation) => {
            // provisionally accept background fetches.
            // actual value size will be checked when they return.
            if (this.#isBackgroundFetch(v)) {
                return 0;
            }
            if (!isPosInt(size)) {
                if (sizeCalculation) {
                    if (typeof sizeCalculation !== 'function') {
                        throw new TypeError('sizeCalculation must be a function');
                    }
                    size = sizeCalculation(v, k);
                    if (!isPosInt(size)) {
                        throw new TypeError('sizeCalculation return invalid (expect positive integer)');
                    }
                }
                else {
                    throw new TypeError('invalid size value (must be positive integer). ' +
                        'When maxSize or maxEntrySize is used, sizeCalculation ' +
                        'or size must be set.');
                }
            }
            return size;
        };
        this.#addItemSize = (index, size, status) => {
            sizes[index] = size;
            if (this.#maxSize) {
                const maxSize = this.#maxSize - sizes[index];
                while (this.#calculatedSize > maxSize) {
                    this.#evict(true);
                }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
                status.entrySize = size;
                status.totalCalculatedSize = this.#calculatedSize;
            }
        };
    }
    #removeItemSize = _i => { };
    #addItemSize = (_i, _s, _st) => { };
    #requireSize = (_k, _v, size, sizeCalculation) => {
        if (size || sizeCalculation) {
            throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache');
        }
        return 0;
    };
    *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for (let i = this.#tail; true;) {
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#head) {
                    break;
                }
                else {
                    i = this.#prev[i];
                }
            }
        }
    }
    *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for (let i = this.#head; true;) {
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#tail) {
                    break;
                }
                else {
                    i = this.#next[i];
                }
            }
        }
    }
    #isValidIndex(index) {
        return (index !== undefined &&
            this.#keyMap.get(this.#keyList[index]) === index);
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */
    *entries() {
        for (const i of this.#indexes()) {
            if (this.#valList[i] !== undefined &&
                this.#keyList[i] !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield [this.#keyList[i], this.#valList[i]];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */
    *rentries() {
        for (const i of this.#rindexes()) {
            if (this.#valList[i] !== undefined &&
                this.#keyList[i] !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield [this.#keyList[i], this.#valList[i]];
            }
        }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */
    *keys() {
        for (const i of this.#indexes()) {
            const k = this.#keyList[i];
            if (k !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */
    *rkeys() {
        for (const i of this.#rindexes()) {
            const k = this.#keyList[i];
            if (k !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */
    *values() {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            if (v !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */
    *rvalues() {
        for (const i of this.#rindexes()) {
            const v = this.#valList[i];
            if (v !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to Array.find().  fn is called as fn(value, key, cache).
     */
    find(fn, getOptions = {}) {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            if (fn(value, this.#keyList[i], this)) {
                return this.get(this.#keyList[i], getOptions);
            }
        }
    }
    /**
     * Call the supplied function on each item in the cache, in order from
     * most recently used to least recently used.  fn is called as
     * fn(value, key, cache).  Does not update age or recenty of use.
     * Does not iterate over stale values.
     */
    forEach(fn, thisp = this) {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */
    rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */
    purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({ allowStale: true })) {
            if (this.#isStale(i)) {
                this.delete(this.#keyList[i]);
                deleted = true;
            }
        }
        return deleted;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to cache.load()
     */
    dump() {
        const arr = [];
        for (const i of this.#indexes({ allowStale: true })) {
            const key = this.#keyList[i];
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined || key === undefined)
                continue;
            const entry = { value };
            if (this.#ttls && this.#starts) {
                entry.ttl = this.#ttls[i];
                // always dump the start relative to a portable timestamp
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = perf.now() - this.#starts[i];
                entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
                entry.size = this.#sizes[i];
            }
            arr.unshift([key, entry]);
        }
        return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     * Note that the shape of the resulting cache may be different if the
     * same options are not used in both caches.
     */
    load(arr) {
        this.clear();
        for (const [key, entry] of arr) {
            if (entry.start) {
                // entry.start is a portable timestamp, but we may be using
                // node's performance.now(), so calculate the offset, so that
                // we get the intended remaining TTL, no matter how long it's
                // been on ice.
                //
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = Date.now() - entry.start;
                entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
        }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     */
    set(k, v, setOptions = {}) {
        if (v === undefined) {
            this.delete(k);
            return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status, } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        // if the item doesn't fit, don't do anything
        // NB: maxEntrySize set to maxSize by default
        if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
                status.set = 'miss';
                status.maxEntrySizeExceeded = true;
            }
            // have to delete, in case something is there already.
            this.delete(k);
            return this;
        }
        let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
        if (index === undefined) {
            // addition
            index = (this.#size === 0
                ? this.#tail
                : this.#free.length !== 0
                    ? this.#free.pop()
                    : this.#size === this.#max
                        ? this.#evict(false)
                        : this.#size);
            this.#keyList[index] = k;
            this.#valList[index] = v;
            this.#keyMap.set(k, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status)
                status.set = 'add';
            noUpdateTTL = false;
        }
        else {
            // update
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v !== oldVal) {
                if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                    oldVal.__abortController.abort(new Error('replaced'));
                    const { __staleWhileFetching: s } = oldVal;
                    if (s !== undefined && !noDisposeOnSet) {
                        if (this.#hasDispose) {
                            this.#dispose?.(s, k, 'set');
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([s, k, 'set']);
                        }
                    }
                }
                else if (!noDisposeOnSet) {
                    if (this.#hasDispose) {
                        this.#dispose?.(oldVal, k, 'set');
                    }
                    if (this.#hasDisposeAfter) {
                        this.#disposed?.push([oldVal, k, 'set']);
                    }
                }
                this.#removeItemSize(index);
                this.#addItemSize(index, size, status);
                this.#valList[index] = v;
                if (status) {
                    status.set = 'replace';
                    const oldValue = oldVal && this.#isBackgroundFetch(oldVal)
                        ? oldVal.__staleWhileFetching
                        : oldVal;
                    if (oldValue !== undefined)
                        status.oldValue = oldValue;
                }
            }
            else if (status) {
                status.set = 'update';
            }
        }
        if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
        }
        if (this.#ttls) {
            if (!noUpdateTTL) {
                this.#setItemTTL(index, ttl, start);
            }
            if (status)
                this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
        return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */
    pop() {
        try {
            while (this.#size) {
                const val = this.#valList[this.#head];
                this.#evict(true);
                if (this.#isBackgroundFetch(val)) {
                    if (val.__staleWhileFetching) {
                        return val.__staleWhileFetching;
                    }
                }
                else if (val !== undefined) {
                    return val;
                }
            }
        }
        finally {
            if (this.#hasDisposeAfter && this.#disposed) {
                const dt = this.#disposed;
                let task;
                while ((task = dt?.shift())) {
                    this.#disposeAfter?.(...task);
                }
            }
        }
    }
    #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error('evicted'));
        }
        else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
                this.#dispose?.(v, k, 'evict');
            }
            if (this.#hasDisposeAfter) {
                this.#disposed?.push([v, k, 'evict']);
            }
        }
        this.#removeItemSize(head);
        // if we aren't about to use the index, then null these out
        if (free) {
            this.#keyList[head] = undefined;
            this.#valList[head] = undefined;
            this.#free.push(head);
        }
        if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
        }
        else {
            this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */
    has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v) &&
                v.__staleWhileFetching === undefined) {
                return false;
            }
            if (!this.#isStale(index)) {
                if (updateAgeOnHas) {
                    this.#updateItemAge(index);
                }
                if (status) {
                    status.has = 'hit';
                    this.#statusTTL(status, index);
                }
                return true;
            }
            else if (status) {
                status.has = 'stale';
                this.#statusTTL(status, index);
            }
        }
        else if (status) {
            status.has = 'miss';
        }
        return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */
    peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined &&
            (allowStale || !this.#isStale(index))) {
            const v = this.#valList[index];
            // either stale and allowed, or forcing a refresh of non-stale value
            return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        }
    }
    #backgroundFetch(k, index, options, context) {
        const v = index === undefined ? undefined : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
            return v;
        }
        const ac = new AC();
        const { signal } = options;
        // when/if our AC signals, then stop listening to theirs.
        signal?.addEventListener('abort', () => ac.abort(signal.reason), {
            signal: ac.signal,
        });
        const fetchOpts = {
            signal: ac.signal,
            options,
            context,
        };
        const cb = (v, updateCache = false) => {
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
            if (options.status) {
                if (aborted && !updateCache) {
                    options.status.fetchAborted = true;
                    options.status.fetchError = ac.signal.reason;
                    if (ignoreAbort)
                        options.status.fetchAbortIgnored = true;
                }
                else {
                    options.status.fetchResolved = true;
                }
            }
            if (aborted && !ignoreAbort && !updateCache) {
                return fetchFail(ac.signal.reason);
            }
            // either we didn't abort, and are still here, or we did, and ignored
            const bf = p;
            if (this.#valList[index] === p) {
                if (v === undefined) {
                    if (bf.__staleWhileFetching) {
                        this.#valList[index] = bf.__staleWhileFetching;
                    }
                    else {
                        this.delete(k);
                    }
                }
                else {
                    if (options.status)
                        options.status.fetchUpdated = true;
                    this.set(k, v, fetchOpts.options);
                }
            }
            return v;
        };
        const eb = (er) => {
            if (options.status) {
                options.status.fetchRejected = true;
                options.status.fetchError = er;
            }
            return fetchFail(er);
        };
        const fetchFail = (er) => {
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf = p;
            if (this.#valList[index] === p) {
                // if we allow stale on fetch rejections, then we need to ensure that
                // the stale value is not removed from the cache when the fetch fails.
                const del = !noDelete || bf.__staleWhileFetching === undefined;
                if (del) {
                    this.delete(k);
                }
                else if (!allowStaleAborted) {
                    // still replace the *promise* with the stale value,
                    // since we are done with the promise at this point.
                    // leave it untouched if we're still waiting for an
                    // aborted background fetch that hasn't yet returned.
                    this.#valList[index] = bf.__staleWhileFetching;
                }
            }
            if (allowStale) {
                if (options.status && bf.__staleWhileFetching !== undefined) {
                    options.status.returnedStale = true;
                }
                return bf.__staleWhileFetching;
            }
            else if (bf.__returned === bf) {
                throw er;
            }
        };
        const pcall = (res, rej) => {
            const fmp = this.#fetchMethod?.(k, v, fetchOpts);
            if (fmp && fmp instanceof Promise) {
                fmp.then(v => res(v === undefined ? undefined : v), rej);
            }
            // ignored, we go until we finish, regardless.
            // defer check until we are actually aborting,
            // so fetchMethod can override.
            ac.signal.addEventListener('abort', () => {
                if (!options.ignoreFetchAbort ||
                    options.allowStaleOnFetchAbort) {
                    res(undefined);
                    // when it eventually resolves, update the cache.
                    if (options.allowStaleOnFetchAbort) {
                        res = v => cb(v, true);
                    }
                }
            });
        };
        if (options.status)
            options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
            __abortController: ac,
            __staleWhileFetching: v,
            __returned: undefined,
        });
        if (index === undefined) {
            // internal, don't expose status.
            this.set(k, bf, { ...fetchOpts.options, status: undefined });
            index = this.#keyMap.get(k);
        }
        else {
            this.#valList[index] = bf;
        }
        return bf;
    }
    #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod)
            return false;
        const b = p;
        return (!!b &&
            b instanceof Promise &&
            b.hasOwnProperty('__staleWhileFetching') &&
            b.__abortController instanceof AC);
    }
    async fetch(k, fetchOptions = {}) {
        const { 
        // get options
        allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, 
        // set options
        ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, 
        // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal, } = fetchOptions;
        if (!this.#hasFetchMethod) {
            if (status)
                status.fetch = 'get';
            return this.get(k, {
                allowStale,
                updateAgeOnGet,
                noDeleteOnStaleGet,
                status,
            });
        }
        const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal,
        };
        let index = this.#keyMap.get(k);
        if (index === undefined) {
            if (status)
                status.fetch = 'miss';
            const p = this.#backgroundFetch(k, index, options, context);
            return (p.__returned = p);
        }
        else {
            // in cache, maybe already fetching
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                const stale = allowStale && v.__staleWhileFetching !== undefined;
                if (status) {
                    status.fetch = 'inflight';
                    if (stale)
                        status.returnedStale = true;
                }
                return stale ? v.__staleWhileFetching : (v.__returned = v);
            }
            // if we force a refresh, that means do NOT serve the cached value,
            // unless we are already in the process of refreshing the cache.
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
                if (status)
                    status.fetch = 'hit';
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                if (status)
                    this.#statusTTL(status, index);
                return v;
            }
            // ok, it is stale or a forced refresh, and not already fetching.
            // refresh the cache.
            const p = this.#backgroundFetch(k, index, options, context);
            const hasStale = p.__staleWhileFetching !== undefined;
            const staleVal = hasStale && allowStale;
            if (status) {
                status.fetch = isStale ? 'stale' : 'refresh';
                if (staleVal && isStale)
                    status.returnedStale = true;
            }
            return staleVal ? p.__staleWhileFetching : (p.__returned = p);
        }
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */
    get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status, } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status)
                this.#statusTTL(status, index);
            if (this.#isStale(index)) {
                if (status)
                    status.get = 'stale';
                // delete only if not an in-flight background fetch
                if (!fetching) {
                    if (!noDeleteOnStaleGet) {
                        this.delete(k);
                    }
                    if (status && allowStale)
                        status.returnedStale = true;
                    return allowStale ? value : undefined;
                }
                else {
                    if (status &&
                        allowStale &&
                        value.__staleWhileFetching !== undefined) {
                        status.returnedStale = true;
                    }
                    return allowStale ? value.__staleWhileFetching : undefined;
                }
            }
            else {
                if (status)
                    status.get = 'hit';
                // if we're currently fetching it, we don't actually have it yet
                // it's not stale, which means this isn't a staleWhileRefetching.
                // If it's not stale, and fetching, AND has a __staleWhileFetching
                // value, then that means the user fetched with {forceRefresh:true},
                // so it's safe to return that value.
                if (fetching) {
                    return value.__staleWhileFetching;
                }
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                return value;
            }
        }
        else if (status) {
            status.get = 'miss';
        }
    }
    #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
    }
    #moveToTail(index) {
        // if tail already, nothing to do
        // if head, move head to next[index]
        // else
        //   move next[prev[index]] to next[index] (head has no prev)
        //   move prev[next[index]] to prev[index]
        // prev[index] = tail
        // next[tail] = index
        // tail = index
        if (index !== this.#tail) {
            if (index === this.#head) {
                this.#head = this.#next[index];
            }
            else {
                this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
        }
    }
    /**
     * Deletes a key out of the cache.
     * Returns true if the key was deleted, false otherwise.
     */
    delete(k) {
        let deleted = false;
        if (this.#size !== 0) {
            const index = this.#keyMap.get(k);
            if (index !== undefined) {
                deleted = true;
                if (this.#size === 1) {
                    this.clear();
                }
                else {
                    this.#removeItemSize(index);
                    const v = this.#valList[index];
                    if (this.#isBackgroundFetch(v)) {
                        v.__abortController.abort(new Error('deleted'));
                    }
                    else if (this.#hasDispose || this.#hasDisposeAfter) {
                        if (this.#hasDispose) {
                            this.#dispose?.(v, k, 'delete');
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([v, k, 'delete']);
                        }
                    }
                    this.#keyMap.delete(k);
                    this.#keyList[index] = undefined;
                    this.#valList[index] = undefined;
                    if (index === this.#tail) {
                        this.#tail = this.#prev[index];
                    }
                    else if (index === this.#head) {
                        this.#head = this.#next[index];
                    }
                    else {
                        this.#next[this.#prev[index]] = this.#next[index];
                        this.#prev[this.#next[index]] = this.#prev[index];
                    }
                    this.#size--;
                    this.#free.push(index);
                }
            }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
        return deleted;
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */
    clear() {
        for (const index of this.#rindexes({ allowStale: true })) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error('deleted'));
            }
            else {
                const k = this.#keyList[index];
                if (this.#hasDispose) {
                    this.#dispose?.(v, k, 'delete');
                }
                if (this.#hasDisposeAfter) {
                    this.#disposed?.push([v, k, 'delete']);
                }
            }
        }
        this.#keyMap.clear();
        this.#valList.fill(undefined);
        this.#keyList.fill(undefined);
        if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
        }
        if (this.#sizes) {
            this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
    }
}
exports.LRUCache = LRUCache;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2020:
/***/ ((module) => {

"use strict";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(399);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;