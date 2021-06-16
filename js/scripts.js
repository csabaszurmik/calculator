const digitBtns = document.querySelectorAll('.btn-digit');
const functionBtns = document.querySelectorAll('.btn-function');
const display = document.querySelector('.display');
const displayStack = document.querySelector('.display .stack');
const displayTotal = document.querySelector('.display .total');

let stack = [];

digitBtns.forEach(item => {
    item.addEventListener('click', event => {
        if (event.target.classList.contains('disabled')) {
            return false;
        }
        let lastItem = stack.slice(-1)[0];
        if (lastItem && lastItem.type === "operand") {
            lastItem.value = (lastItem.value.toString() + event.target.dataset.value) * 1;
        } else {
            stack.push({type: 'operand', value: event.target.dataset.value * 1});
        }
        checkOperators();
        updateDisplay();
    })
})

functionBtns.forEach(item => {
    item.addEventListener('click', event => {
        if (item.classList.contains('disabled')) {
            return false;
        }
        let value = item.dataset.value;
        let lastItem = stack.slice(-1)[0];
        switch (value) {
            case '+':
            case '-':
            case '=':
                if (lastItem && lastItem.type === "operand" && lastItem.value != "-") {
                    stack.push({type: 'operator', value: value});
                }
                break;
            case 'plusminus':
                togglePlusMinus();
                break;
            case 'delete':
                deleteLast();
                break;
            case 'reset':
                reset();
                break;
        }
        checkOperators();
        updateDisplay();
        if (value === '=') {
            calculate();
        }
    })
});

function checkOperators() {
    let lastItem = stack.slice(-1)[0];
    if (!lastItem || lastItem.type === "operator" || (lastItem.type === "operand" && lastItem.value === "-")) {
        document.querySelectorAll('.btn-operator').forEach(item => {
            item.classList.add('disabled');
        })
    } else {
        document.querySelectorAll('.btn-operator').forEach(item => {
            item.classList.remove('disabled');
        })
    }
    if (!lastItem) {
        document.querySelector('.btn[data-value="reset"]').classList.add('disabled')
        document.querySelector('.btn[data-value="delete"]').classList.add('disabled')
    } else {
        document.querySelector('.btn[data-value="reset"]').classList.remove('disabled')
        document.querySelector('.btn[data-value="delete"]').classList.remove('disabled')
    }
}

function updateDisplay() {
    displayStack.innerHTML = stack.reduce((html, item) => {
        let displayValue = item.value < 0 ? '('+item.value+')' : item.value;
        return html + `<div class="row ${item.type}">${displayValue}</div>\n`;
    }, '')
}

function togglePlusMinus() {
    let lastItem = stack.slice(-1)[0];
    if (!lastItem) return;
    if (lastItem.type === "operand") {
        lastItem.value = lastItem.value * (-1);
    } else {
        stack.push({type: 'operand', value: '-'});
    }
}

function deleteLast() {
    stack.pop();
}

function reset() {
    stack = [];
    displayTotal.textContent = '';
    document.querySelectorAll('.btn').forEach(item => {
        item.classList.remove('disabled');
    })
}

function calculate() {
    let operands = stack.filter(item => item.type === 'operand').map(item => item.value);
    let operators = stack.filter(item => item.type === 'operator').map(item => item.value);
    let total = operands.reduce((total, value, index) => {
        if (index === 0) {
            return total + value;
        }
        if (operators[index-1] === '+') {
            return total + value;
        }
        if (operators[index-1] === '-') {
            return total - value;
        }
    }, 0);
    displayTotal.textContent = total;
    document.querySelectorAll('.btn:not([data-value="reset"])').forEach(item => {
        item.classList.add('disabled');
    })
}