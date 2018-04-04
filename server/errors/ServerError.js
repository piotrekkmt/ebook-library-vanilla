/**
 * Custom error that includes the optional http code
 */
class ServerError extends Error {
    constructor(message, code, httpCode, prependServerName) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.code = code ? code : 500;
        this.name = this.constructor.name;
        if (httpCode) {
            this.httpCode = httpCode;
        } else if (this.code && Number.isInteger(this.code) && this.code > 100 && this.code < 600) {
            this.httpCode = this.code;
        } else {
            this.httpCode = 500;
        }
        this.prependServerName = prependServerName || 'eBookLibrary';
        this.appendMessage(message || 'Internal Server Error');
    }

    toJSON() {
        return {
            'message': this.message,
            'code': this.code
        };
    }

    appendMessage(extraInfo, prependServerName) {
        const serverName = prependServerName || this.prependServerName;
        const msg = (extraInfo instanceof ServerError) ? extraInfo.message : '[' + serverName + ']:' +  extraInfo;
        this.message = (this.message.indexOf(']:') > 0) ? this.message + '\n' + msg : msg;
    }
}

module.exports = ServerError;
