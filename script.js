class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Ошибка: Деление на ноль!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    // Добавляем анимацию нажатия кнопки
    addButtonAnimation(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
    }
}

// Инициализация калькулятора
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Добавляем анимацию нажатия для всех кнопок
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        calculator.addButtonAnimation(button);
    });
});

// Поддержка клавиатуры
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation = e.key;
        if (operation === '*') operation = '×';
        if (operation === '/') operation = '÷';
        calculator.chooseOperation(operation);
    }
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
    }
    if (e.key === 'Escape') {
        calculator.clear();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
    }
});

// Предотвращаем повторное нажатие операторов
let lastButton = null;
document.querySelectorAll('.btn-operator').forEach(button => {
    button.addEventListener('click', () => {
        if (lastButton && lastButton.classList.contains('btn-operator')) {
            lastButton.style.opacity = '0.7';
        }
        button.style.opacity = '1';
        lastButton = button;
    });
});

// Сброс выделения операторов при нажатии числа
document.querySelectorAll('.btn-number').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.btn-operator').forEach(op => {
            op.style.opacity = '1';
        });
        lastButton = null;
    });
});