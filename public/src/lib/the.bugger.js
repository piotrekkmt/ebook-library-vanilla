/**
 * TheBuggerTool
 * To easier debug your browser errors if there's a console error and you can't get to your console.
 * Add to the top of your <body> tag on the page you'd like to debug
 * i.e.
 * <body>
 *   <script type="text/javascript" src="the.bugger.js"></script>
 *    ...
 * </body>
 */

(function() {

    /* By default on the top, but can be put at the bottom like in a browser debugger */
    var CONSOLE_LOCATION = 'bottom';
    var consoleErrors = [];

    var theBuggerDiv = document.createElement('DIV');

    function initialise() {
        theBuggerDiv.id = 'theBuggerConsole';
        theBuggerDiv.style.width = '100%';
        theBuggerDiv.style.minHeight = '70px';
        theBuggerDiv.style.color = 'red';
        theBuggerDiv.style.position = 'absolute';
        theBuggerDiv.style.position = 'absolute';
        theBuggerDiv.style.borderColor = 'red';
        theBuggerDiv.style.borderWidth = '5px';
        theBuggerDiv.style.borderStyle = 'solid';
        theBuggerDiv.style.backgroundColor = 'yellow';
        theBuggerDiv.style.zIndex = '1000';
        if (CONSOLE_LOCATION === 'bottom') {
            theBuggerDiv.style.bottom = '0px';
        } else {
            theBuggerDiv.style.top = '0px';
        }

        // Title
        var theBuggerTitleSpan = document.createElement('SPAN');
        theBuggerTitleSpan.style.fontWeight = 'bold';
        theBuggerTitleSpan.style.width = '100px';
        theBuggerTitleSpan.style.marginLeft = '45%';
        theBuggerTitleSpan.style.marginRight = '45%';

        var theBuggerTitle = document.createTextNode('TheBuggerTool');
        theBuggerTitleSpan.appendChild(theBuggerTitle);
        theBuggerDiv.appendChild(theBuggerTitleSpan);

        var theBuggerConsole = document.createElement('UL');
        theBuggerConsole.id = 'theBuggerConsole';
        theBuggerDiv.appendChild(theBuggerConsole);
        document.getElementsByTagName('body')[0].appendChild(theBuggerDiv);
    }

    function writeToConsole(msg, url, lineNumber, colno, error) {
        var bugLine = document.createElement('LI');
        bugLine.style.listStyleType = 'none';
        bugLine.style.paddingLeft = '10px';
        var errorMsgTxt = '(Line:' + lineNumber + ':' + colno + ') ' + msg + '<br>' + error;
        var errorMsg = document.createTextNode(errorMsgTxt);
        bugLine.appendChild(errorMsg);
        document.getElementById('theBuggerConsole').appendChild(bugLine);
        return true;
    }

    function refreshConsole() {
        if (consoleErrors.length) {
            showTheBugger();
            for (var i = 0; i < consoleErrors.length; i++) {
                var err = consoleErrors[i];
                writeToConsole(err.msg, err.url, err.lineNumber, err.colno, err.error);
            }
        } else {
            hideTheBugger();
        }
    }

    function catchError(msg, url, lineNumber, colno, error) {
        consoleErrors.push({
            msg: msg,
            url: url,
            lineNumber: lineNumber,
            colno: colno,
            error: error
        });
        refreshConsole();
    }

    function hideTheBugger() {
        document.getElementById('theBuggerConsole').style.display = 'none';
    }

    function showTheBugger() {
        document.getElementById('theBuggerConsole').style.display = 'block';
    }

    initialise();
    refreshConsole();
    window.onerror = function(msg, url, lineNumber, colno, error) {
        catchError(msg, url, lineNumber, colno, error);
    };
})();
