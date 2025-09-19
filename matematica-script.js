// Funcionalidades para o guia de matemática financeira
document.addEventListener('DOMContentLoaded', function () {
    // Navegação suave para as seções
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Tabs da calculadora
    const calcTabs = document.querySelectorAll('.calc-tab');
    const calcContents = document.querySelectorAll('.calc-content');

    calcTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Remover classe active de todas as tabs
            calcTabs.forEach(t => t.classList.remove('active'));
            calcContents.forEach(c => c.classList.remove('active'));

            // Adicionar classe active à tab clicada
            this.classList.add('active');
            document.getElementById(`${tabId}-calc`).classList.add('active');
        });
    });

    // Calculadora VP/VF
    const calcularBtn = document.getElementById('calcularVP-VF');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', calcularVP_VF);
    }
});

function calcularVP_VF() {
    const tipoCalculo = document.getElementById('calcType').value;
    const vp = parseFloat(document.getElementById('vpValue').value) || 0;
    const taxa = parseFloat(document.getElementById('taxaCalc').value) || 0;
    const periodos = parseInt(document.getElementById('periodos').value) || 0;

    if (taxa <= 0 || periodos <= 0) {
        alert('Por favor, insira valores válidos para taxa e períodos.');
        return;
    }

    const taxaDecimal = taxa / 100;
    let resultado;

    if (tipoCalculo === 'vf') {
        // Calcular Valor Futuro
        resultado = vp * Math.pow(1 + taxaDecimal, periodos);
        document.getElementById('resultadoVP-VF').textContent =
            `Valor Futuro: ${formatCurrency(resultado)}`;
    } else {
        // Calcular Valor Presente
        resultado = vp / Math.pow(1 + taxaDecimal, periodos);
        document.getElementById('resultadoVP-VF').textContent =
            `Valor Presente: ${formatCurrency(resultado)}`;
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Funções para outras calculadoras (seriam implementadas)
function calcularAnuidades() {
    // Implementação para cálculo de anuidades
}

function calcularAmortizacao() {
    // Implementação para cálculo de amortização
}