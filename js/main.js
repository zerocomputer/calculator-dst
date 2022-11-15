var expression = "";
var expressionResult = "";
var historyEl = [];

document.addEventListener("readystatechange", function() {
    let buttons = document.querySelectorAll('button');
    for (let button of buttons) {
        button.onclick = function(e) {
            e.preventDefault();
            if (this.dataset.func == undefined) {
                expression += this.textContent;
            } else {
                switch (this.dataset.func) {
                    case "clear":
                        expression = "";
                        expressionResult = "";
                        break;
                    case "backspace":
                        expression = expression.substr(0, expression.length - 1);
                        break;
                    case "showRes":
                        resultEx();
                        break;
                    case "sqrt":
                        expression = "sqrt(" + expression + ")";
                        break;
                    case "pow2":
                        expression = "(" + expression + ")^2";
                        break;
                    case "1/x":
                        expression = "1/(" + expression + ")";
                        break;
                    case "+-":
                        expression = "-(" + expression + ")";
                        break;
                }
            }
            updateExpression();
        };
    }
    //Load history
    if (getCookie("history") != undefined) {
        historyEl = JSON.parse(getCookie("history"));
        historyUpdate();
    }
    // Clear history
    document.querySelector("#clearHistory").onclick = function() {
        historyEl = [];
        historyUpdate();
    };
});

function updateExpression() {
    if (expression != "") {
        document.querySelector('#curExp').textContent = expression;
    } else {
        document.querySelector('#curExp').textContent = 0;
    }

    if (expressionResult != "") {
        document.querySelector('#curExpResult').textContent = expressionResult;
    } else {
        document.querySelector('#curExpResult').textContent = 0;
    }
}

function prepareEx() {
    let ex = expression;
    ex = ex.replace("sqrt", "Math.sqrt");
    ex = ex.replace("^", "**");
    return ex;
}

function resultEx() {
    let result = eval(prepareEx());
    let newHistory = expression + " = " + result;
    historyEl.push(newHistory);
    historyUpdate();
    expressionResult = result;
    updateExpression();
}

function historyUpdate() {
    let historyContent = document.querySelector('#history-content');
    historyContent.innerHTML = "";
    if (historyEl.length > 0) {
        document.querySelector("#history-content").style.display = "block";
        document.querySelector('.nocontent').style.display = "none";
    } else {
        document.querySelector('.nocontent').style.display = "flex";
        document.querySelector("#history-content").style.display = "none";
    }
    for (let el of historyEl.reverse()) {
        var element = document.createElement('div');
        element.className = "element";
        element.textContent = el;
        element.onclick = function(e) {
            e.preventDefault();
            let ex = this.textContent;
            expression = ex.substr(0, ex.indexOf("="));
            expressionResult = ex.substr(ex.indexOf("=") + 1, ex.length - ex.indexOf("=") + 1);
            updateExpression();
        }
        historyContent.appendChild(element);
    }
    document.cookie = "history=" + JSON.stringify(historyEl) + "; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT";
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}