// Calculadora de Juros Compostos - Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tabs = document.querySelectorAll('.tab');
    
    // Gráfico
    let resultsChart = null;
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateCompoundInterest);
    clearBtn.addEventListener('click', clearForm);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Adicionar classe active à tab clicada
            tab.classList.add('active');
            
            // Esconder todos os conteúdos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar o conteúdo correspondente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Calcular automaticamente ao carregar a página
    calculateCompoundInterest();
    
    // Função principal de cálculo
    function calculateCompoundInterest() {
        // Obter valores dos inputs
        const initialValue = parseFloat(document.getElementById('initialValue').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        let interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
        const isYearlyRate = document.getElementById('yearly').checked;
        let time = parseInt(document.getElementById('time').value) || 0;
        const isYears = document.getElementById('timeUnit').value === 'years';
        
        // Validar entradas
        if (interestRate < 0 || time <= 0) {
            alert('Por favor, insira valores válidos para taxa de juros e tempo.');
            return;
        }
        
        // Converter taxa anual para mensal se necessário
        if (isYearlyRate) {
            interestRate = Math.pow(1 + interestRate/100, 1/12) - 1;
        } else {
            interestRate = interestRate / 100;
        }
        
        // Converter anos em meses se necessário
        if (isYears) {
            time = time * 12;
        }
        
        // Calcular juros compostos
        let currentAmount = initialValue;
        let totalInvested = initialValue;
        let totalInterest = 0;
        
        // Arrays para o gráfico
        const months = [];
        const investedAmounts = [];
        const interestAmounts = [];
        const totalAmounts = [];
        
        // Array para a tabela
        const tableData = [];
        
        // Calcular mês a mês
        for (let month = 1; month <= time; month++) {
            const monthInterest = currentAmount * interestRate;
            totalInterest += monthInterest;
            currentAmount += monthInterest + monthlyContribution;
            totalInvested += monthlyContribution;
            
            // Adicionar dados para o gráfico
            months.push(month);
            investedAmounts.push(totalInvested);
            interestAmounts.push(totalInterest);
            totalAmounts.push(currentAmount);
            
            // Adicionar dados para a tabela (apenas alguns meses para não sobrecarregar)
            if (month === 1 || month % 12 === 0 || month === time) {
                tableData.push({
                    period: month,
                    initial: currentAmount - monthlyContribution - monthInterest,
                    contribution: monthlyContribution,
                    interest: monthInterest,
                    final: currentAmount
                });
            }
        }
        
        // Atualizar a UI com os resultados
        document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        document.getElementById('finalAmount').textContent = formatCurrency(currentAmount);
        
        // Calcular rentabilidade percentual
        const profitability = ((currentAmount - totalInvested) / totalInvested) * 100;
        document.getElementById('profitability').textContent = `${profitability.toFixed(2)}%`;
        
        // Calcular ganhos mensais médios
        const monthlyEarnings = totalInterest / time;
        document.getElementById('monthlyEarnings').textContent = formatCurrency(monthlyEarnings);
        
        // Atualizar gráfico
        updateChart(months, investedAmounts, interestAmounts, totalAmounts);
        
        // Atualizar tabela
        updateTable(tableData);
    }
    
    // Formatador de moeda
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Atualizar gráfico
    function updateChart(months, investedAmounts, interestAmounts, totalAmounts) {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (resultsChart) {
            resultsChart.destroy();
        }
        
        // Criar novo gráfico
        resultsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Total Investido',
                        data: investedAmounts,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Juros Acumulados',
                        data: interestAmounts,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Valor Total',
                        data: totalAmounts,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: true,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução do Investimento',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Atualizar tabela
    function updateTable(data) {
        const tableBody = document.getElementById('progressionTableBody');
        tableBody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.period}</td>
                <td>${formatCurrency(row.initial)}</td>
                <td>${formatCurrency(row.contribution)}</td>
                <td>${formatCurrency(row.interest)}</td>
                <td>${formatCurrency(row.final)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
    
    // Limpar formulário
    function clearForm() {
        document.getElementById('initialValue').value = '1000';
        document.getElementById('monthlyContribution').value = '100';
        document.getElementById('interestRate').value = '0.5';
        document.getElementById('monthly').checked = true;
        document.getElementById('time').value = '12';
        document.getElementById('timeUnit').value = 'months';
        
        // Recalcular
        calculateCompoundInterest();
    }
    
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