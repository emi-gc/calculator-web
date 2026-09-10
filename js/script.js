const theme = document.getElementById("theme");

let num1 = null;
let operation = null;
let applyReset = false;

const calculateBtn = document.getElementById('calculate');
const resultStatus = document.getElementById('display');

const add = (a, b) => a+b ;
const subtract = (a, b) => a-b ;
const multiply = (a, b) => a*b ;
const divide = (a, b) => {
    if (b === 0) {
        return new Error('Error. Do not divide by zero.');
    }

    return a / b;
};

const Jerarquia = {
   'add': {prioridad: 1, callback: add},
   'subtract': {prioridad: 1, callback: subtract},
   'multiply': {prioridad: 2, callback: multiply},
   'divide': {prioridad: 2, callback: divide}
};

function calculator(numA, numB, callback) {
    if (!Number.isFinite(numA) || !Number.isFinite(numB)) {
        return new Error('The numbers are not valid.');
    }

    if (typeof callback !== 'function') {
        return new Error('Please select a valid operation.');
    }

    return callback(numA, numB);
}

const keys = document.querySelectorAll('.key');

function showDisplay(value) {
    resultStatus.textContent = value;
}

keys.forEach((key) => {
    key.addEventListener('click', () => {
        const num = key.dataset.number;
        const op = key.dataset.operator;
        const action = key.dataset.action;

        if (num === "delete") {
            showDisplay(resultStatus.textContent.slice(0, -1));
            return;
        }

        if (action === "reset") {
            num1 = null;
            operation = null;
            applyReset = false;
            showDisplay("0");
            return;

        }

        if (action === "decimal") {
            if (!resultStatus.textContent.includes(".")) {
                showDisplay(resultStatus.textContent + ".");
            }
            return;
        }

        if(op) {
            num1 = Number(resultStatus.textContent);
            operation = op;
            applyReset = true;
            return;
        }

        if (action === "equals" && operation) {
            const result1 = calculator(num1, Number(resultStatus.textContent), Jerarquia[operation].callback);
            showDisplay(result1 instanceof Error ? result1.message : result1);
            num1 = null;
            operation = null;
            applyReset = false;
        }

        if (num !== undefined) {
            if (applyReset || resultStatus.textContent === "Error") {
                showDisplay(num);
                applyReset = false;
            } else {
                showDisplay(resultStatus.textContent === "0" ? num : resultStatus.textContent + num);
            }
            return;
        }
    });
});
const currentTheme = ["theme-1", "theme-2", "theme-3"].findIndex((className) =>
    document.body.classList.contains(className)
);
theme.value = currentTheme === -1 ? 0 : currentTheme;

theme.addEventListener("input", function() {
    document.body.classList.remove("theme-1","theme-2", "theme-3");
    document.body.classList.add("theme-" + (Number(theme.value) + 1));
});

