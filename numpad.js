const maxNumbers = 11;
let displayValue = "0";
let firstNumber = null;
let operator = null;
let result = null;
let secret = "🏃‍♂️ 🕳️";

const historyLog = document.getElementById("postit");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    button.addEventListener('click', function() {
        if (button.classList.contains("number")) {
            inputNumber(button.value);
            updateDisplay();
        }
        else if (button.classList.contains("operator")) {
            inputOperator(button.value)
            updateDisplay();
        }
        else if (button.classList.contains("equals")) {
            inputEquals();
            updateDisplay();
        }
        else if (button.classList.contains("clear")) {
            clearDisplay();
            updateDisplay();
        }
    });
});

function updateDisplay() {
    const display = document.querySelector("#display");
    if (typeof displayValue === "number") displayValue = displayValue.toString();
    if (displayValue.length < maxNumbers) {
        display.textContent = displayValue;
    }
    else if (displayValue.includes("e")) {
        display.textContent = displayValue.substring(0, maxNumbers - 4) + displayValue.slice(-4);
    }
    else {
        display.textContent = displayValue.substring(0, maxNumbers);
    }
}

updateDisplay();

function updateHistory() {
    // `${firstNumber} ${operator} ${displayValue} = ${result}`
    let newLog = document.createElement('p');
    newLog.innerHTML = `${firstNumber} ${operator} ${displayValue} = <br><strong>${result}</strong>`;
    if (historyLog.childElementCount >= 5) {
        historyLog.removeChild(historyLog.firstChild);
    }
    historyLog.appendChild(newLog);
}

function toggleSelected(buttonValue, action) {
    selected = document.querySelector(`button[value="${buttonValue}"]`);
    if (action === "add") {
        selected.classList.add('selected');
    }
    else if (action === "remove") {
        selected.classList.remove('selected');
    }
}

function inputNumber(num) {
    if (operator !== null && firstNumber === null) {
        // first number after an operator has been selected
        firstNumber = displayValue;
        displayValue = "0";
        toggleSelected(operator, "remove");
        //operator = null;
    }
    if (result !== null || result === secret) {
        // resets after a calc was just made and number was pressed first
        result = null;
        displayValue = "0";
    }
    if (displayValue.length < maxNumbers) {
        // adding numbers to the display
        if (displayValue === "0" && num !== ".") {
            // the first number replaces zero in the display
            displayValue = num;
        }
        else {
            if (displayValue.includes(".")) {
                // only add non-decimal values if a decimal exists already
                if (num !== ".") displayValue += num;
            }
            else {
                displayValue += num;
            }
        }
    }
}

function inputOperator(op) {
    if (displayValue === secret) {
        clearDisplay();
        return;
    }
    if (firstNumber !== null) {
        calculate();
        toggleSelected(operator, "remove");
        operator = null;
    }
    if (operator === null) {
        operator = op;
        toggleSelected(op, "add");
    }
    else {
        toggleSelected(operator, "remove");
        operator = op;
        toggleSelected(op, "add");
    }
}

function inputEquals() {
    if (firstNumber === null) {
        // only one number selected
        console.log("result = " + displayValue);
        result = displayValue;
        if (operator !== null) {
            toggleSelected(operator, "remove");
            operator = null;
        }
    }
    else if (firstNumber !== null && operator !== null) {
        calculate();
        toggleSelected(operator, "remove");
        operator = null;
    }
}

function doBackspace() {
    if (displayValue.length === 1 || displayValue === secret) {
        displayValue = "0";
    }
    else {
        displayValue = displayValue.slice(0, displayValue.length - 1);
    }
    updateDisplay();
}

function clearDisplay() {
    if (operator !== null) toggleSelected(operator, "remove");
    displayValue = "0";
    firstNumber = null;
    operator = null;
    result = null;
}

function calculate() {
    switch (operator) {
        case "+":
            result = Number(firstNumber) + Number(displayValue);
            break;
        case "-":
            result = Number(firstNumber) - Number(displayValue);
            break;
        case "*":
            result = Number(firstNumber) * Number(displayValue);
            break;
        case "/":
            result = Number(firstNumber) / Number(displayValue);
            break;
        default:
            break;
    }
    // fixing impricise calculations that fit the calculator:
    result = parseFloat(result.toPrecision(maxNumbers));
    if (result.toString().length > maxNumbers && maxNumbers > 6) {
        // long numbers converted to exponential
        result = result.toPrecision(maxNumbers - 4);
    }
    updateHistory()
    displayValue = (operator === "/" && displayValue === "0") ? secret : result;
    firstNumber = null;
}

window.addEventListener('keydown', function(e) {
    if (e.code === "Backspace" && result === null) {
        doBackspace();
        return;
    }
    const key = document.querySelector(`button[data-key="${e.code}"]`);
    if (!key) return; // key not supported
    key.click();
    key.focus();
});

window.addEventListener('keyup', () => {
    document.activeElement.blur();    
});
window.addEventListener('mouseup', () => {
    document.activeElement.blur();    
});
