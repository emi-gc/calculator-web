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

const theme = document.getElementById("theme");

const currentTheme = ["theme-1", "theme-2", "theme-3"].findIndex((className) =>
    document.body.classList.contains(className)
);
theme.value = currentTheme === -1 ? 0 : currentTheme;

theme.addEventListener("input", function() {
    document.body.classList.remove("theme-1","theme-2", "theme-3");
    document.body.classList.add("theme-" + (Number(theme.value) + 1));
});
