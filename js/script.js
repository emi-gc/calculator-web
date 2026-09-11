const theme = document.getElementById("theme");

let num1 = null;
let operation = null;
let applyReset = false;
let resultShown = false; // for DEL error handling
const resultStatus = document.getElementById('display');
const functionsPanel = document.getElementById('trigonometric-panel');

const add = (a, b) => a+b ;
const subtract = (a, b) => a-b ;
const multiply = (a, b) => a*b ;
const divide = (a, b) => {
    if (b === 0) {
        return new Error('Error. Do not divide by zero.');
    }

    return a / b;
};

// trigonometric functions
const sin = (a) => Math.sin(a);
const cos = (a) => Math.cos(a);
const tan = (a) => Math.tan(a);
const asin = (a) => Math.asin(a);
const acos = (a) => Math.acos(a);
const atan = (a) => Math.atan(a);

const unaryFunctions = { sin, cos, tan, asin, acos, atan };

const hierarchy = { // changed name to english for consistency
   'add': {priority: 1, callback: add},
   'subtract': {priority: 1, callback: subtract},
   'multiply': {priority: 2, callback: multiply},
   'divide': {priority: 2, callback: divide},

   // optional trigonometric functions
   'sin': {priority: 3, callback: sin},
   'cos': {priority: 3, callback: cos},
   'tan': {priority: 3, callback: tan},
   'asin': {priority: 3, callback: asin},
   'acos': {priority: 3, callback: acos},
   'atan': {priority: 3, callback: atan}

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
        const functionName = key.dataset.function;

        if (action === "toggle-functions") {
            const isOpen = functionsPanel.classList.toggle("is-open");
            key.setAttribute("aria-expanded", isOpen);
            functionsPanel.setAttribute("aria-hidden", !isOpen);
            return;
        }

        if (functionName) {
            const value = Number(resultStatus.textContent);
            const result = unaryFunctions[functionName](value);

            if (!Number.isFinite(result)) {
                showDisplay("Error");
                applyReset = true;
            } else {
                showDisplay(result);
                applyReset = true;
                resultShown = true;
            }
            return;
        }

        if (num === "delete") {
            // DEL ERROR HANDLING, previously when you had a result showing on screen you could
            //press del and it would delete digits off of it i dont think thats right
            if (resultShown) { 
                showDisplay("0");
                applyReset = false;
                resultShown = false; 
                return;
            }

            const nextValue = resultStatus.textContent.slice(0, -1);
            showDisplay(nextValue || "0");
            return;
        }

        if (action === "reset") {
            num1 = null;
            operation = null;
            applyReset = false;
            resultShown = false; // del
            showDisplay("0");
            return;

        }

        if (action === "decimal") {
            if (applyReset) { // for decimals not to append to the old value
                showDisplay("0.");
                applyReset = false; 
                resultShown = false; // del
            } else if (!resultStatus.textContent.includes(".")) {
                showDisplay(resultStatus.textContent + ".");
            }
            return;
        }

        // commented because i want to remember what i did for later exercises !!!!
        if (op) {
            // convert whatever is currently on the display into a number.
            const currentNumber = Number(resultStatus.textContent);

            // if there is already an operation saved, that means this is a chained calculation.
            if (operation) {
                // calculate the previous saved number with the current number.
                const result = calculator(num1, currentNumber, hierarchy[operation].callback);

                // error handling
                if (result instanceof Error) {
                    showDisplay(result.message);
                    num1 = null;
                    operation = null;
                    applyReset = true;
                    return;
                }

                // show result of calculation
                showDisplay(result);

                // save the first number for the next operation
                num1 = result;
            } else {
                // if there is no previous operation, save the current number as the first number.
                num1 = currentNumber;
            }
            operation = op;
            resultShown = false; // del

            // tell calculator to clear the display when the next number is typed.
            applyReset = true;
            return;
        }

        if (action === "equals" && operation) {
            const result1 = calculator(num1, Number(resultStatus.textContent), hierarchy[operation].callback);

            // removed ternary because weird
            if (result1 instanceof Error) {
                showDisplay(result1.message);
            } else {
                showDisplay(result1);
            }

            num1 = null;
            operation = null;
            applyReset = true; // for no appending numbers to result
            resultShown = true; // del
            return;
        }

        if (num !== undefined) {
            const displayIsError = resultStatus.textContent.startsWith("Error"); // for consistent error reset

            if (applyReset || displayIsError) {
                showDisplay(num);
                applyReset = false; 
                resultShown = false; // del
            } else {
                // removed ternary because weird
                if (resultStatus.textContent === "0") {
                    showDisplay(num);
                } else {
                    showDisplay(resultStatus.textContent + num);
                }
            }
            return;
        }
    });
});
const currentTheme = ["theme-1", "theme-2", "theme-3"].findIndex((className) =>
    document.body.classList.contains(className)
);

// previously used ternary, ternary = weird
if (currentTheme === -1) { 
    theme.value = 0;
} else {
    theme.value = currentTheme;
}
// handles theme changing
theme.addEventListener("input", function() {
    document.body.classList.remove("theme-1","theme-2", "theme-3");
    document.body.classList.add("theme-" + (Number(theme.value) + 1));
});

