// Calculadora - Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const calcButtons = document.querySelectorAll('.calc-btn');
    const clearButton = document.getElementById('clear');
    const calculateButton = document.getElementById('calculate');
    
    // Adicionar valores ao display
    calcButtons.forEach(button => {
        if (button.id !== 'clear' && button.id !== 'calculate') {
            button.addEventListener('click', () => {
                appendToDisplay(button.getAttribute('data-value'));
            });
        }
    });
    
    // Limpar display
    clearButton.addEventListener('click', clearDisplay);
    
    // Calcular resultado
    calculateButton.addEventListener('click', calculate);
    
    // Simulação de interação do fórum
    document.querySelectorAll('.question').forEach(question => {
        question.addEventListener('click', () => {
            alert('Você clicou em uma pergunta do fórum. Em uma versão completa, você seria redirecionado para a página de discussão.');
        });
    });
    
    // Navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Funções da calculadora
function appendToDisplay(value) {
    const display = document.getElementById('display');
    if (display.innerText === '0' && value !== '.') {
        display.innerText = value;
    } else {
        // Impedir múltiplos pontos decimais consecutivos
        if (value === '.' && display.innerText.slice(-1) === '.') {
            return;
        }
        display.innerText += value;
    }
}

function clearDisplay() {
    document.getElementById('display').innerText = '0';
}

function calculate() {
    const display = document.getElementById('display');
    try {
        // Substituir × por * e ÷ por / para avaliação
        let expression = display.innerText.replace('×', '*').replace('÷', '/');
        display.innerText = eval(expression);
    } catch (error) {
        display.innerText = 'Erro';
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}

// Adicionar funcionalidade de teclado para a calculadora
document.addEventListener('keydown', function(event) {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', 'Escape', 'Backspace', '='];
    
    if (validKeys.includes(key)) {
        event.preventDefault();
        
        if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape' || key === 'Backspace') {
            clearDisplay();
        } else {
            appendToDisplay(key);
        }
    }
});

// Efeito de digitação no título (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Iniciar efeito de digitação quando a página carregar
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.innerText;
        typeWriter(heroTitle, originalText);
    }
});