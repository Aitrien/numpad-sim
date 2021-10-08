const maxNumbers = 11;
let displayValue = "0";
let firstNumber = null;
let operator = null;
let result = null;

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    //console.log(button.classList.contains("number"));
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

function toggleSelected(buttonValue, action) {
    selected = document.querySelector(`button[value="${buttonValue}"]`);
    if (action === "add") {
        selected.classList.add('selected');
    }
    else if (action === "remove") {
        selected.classList.remove('selected');
    }
    
}

function printState() {
    console.table({"displayValue": displayValue,
                   "firstNumber": firstNumber,
                   "operator": operator,
                   "result": result
                    });
}

function inputNumber(num) {
    if (operator !== null && firstNumber === null) {
        // first number after an operator has been selected
        firstNumber = displayValue;
        displayValue = "0";
        toggleSelected(operator, "remove");
        //operator = null;
    }
    if (result !== null) {
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
    if (firstNumber !== null) {
        //console.log("1");
        // when an operator has been clicked instead of equals (not first op)
        //console.log("calc taken");
        calculate();
        toggleSelected(operator, "remove");
        operator = null;
    }
    if (operator === null) { // to change for after calc
        //console.log("2");
        operator = op;
        toggleSelected(op, "add");
    }
    else {
        // changing the operator before selecting a new number
        //console.log("3");
        toggleSelected(operator, "remove");
        operator = op;
        toggleSelected(op, "add");
    }
    //console.log(`first num: ${firstNumber}, display val: ${displayValue}`);
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

function clearDisplay() {
    if (operator !== null) toggleSelected(operator, "remove");
    displayValue = "0";
    firstNumber = null;
    operator = null;
    result = null;
}

function calculate() {
    //console.log(`calculating ${firstNumber} and ${displayValue} using ${operator}`);
    //console.log(`types are: ${typeof firstNumber}, ${typeof displayValue} and ${typeof operator}`);
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
    console.log(`${firstNumber} ${operator} ${displayValue} = ${result}`);
    displayValue = result;
    firstNumber = null;
}

window.addEventListener('keydown', function(e) {
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
