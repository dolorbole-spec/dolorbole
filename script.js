class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
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
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Инициализация калькулятора
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Поддержка клавиатуры
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Цифры и точка
    if ((key >= '0' && key <= '9') || key === '.') {
        calculator.appendNumber(key);
    }
    
    // Операции
    if (key === '+' || key === '-') {
        calculator.chooseOperation(key);
    }
    
    if (key === '*') {
        calculator.chooseOperation('×');
    }
    
    if (key === '/') {
        event.preventDefault(); // Предотвращаем открытие контекстного меню
        calculator.chooseOperation('÷');
    }
    
    // Равно и Enter
    if (key === '=' || key === 'Enter') {
        calculator.compute();
    }
    
    // Очистка
    if (key === 'Escape') {
        calculator.clear();
    }
    
    // Удаление
    if (key === 'Backspace') {
        calculator.delete();
    }
});

// Анимация нажатия кнопок
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Дополнительные функции
function addKeyboardSupport() {
    // Предотвращаем ввод с клавиатуры в дисплей
    document.addEventListener('keydown', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Блокируем некоторые системные сочетания клавиш
        if (event.ctrlKey || event.metaKey) {
            if (event.key === 'c' || event.key === 'v' || event.key === 'a') {
                event.preventDefault();
            }
        }
    });
}

// Инициализация дополнительных функций
addKeyboardSupport();

// Обработка ошибок
window.addEventListener('error', function(event) {
    console.error('Ошибка калькулятора:', event.error);
    calculator.clear();
    calculator.currentOperandTextElement.innerText = 'Ошибка';
});

// Экспорт для глобального доступа
window.calculator = calculator;