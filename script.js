let debts = [];

document.getElementById('debt-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const pix = document.getElementById('pix').value;
    const value = parseFloat(document.getElementById('value').value);
    const installments = parseInt(document.getElementById('installments').value);

    const debt = {
        name,
        pix,
        value,
        installments,
        perInstallment: (value / installments).toFixed(2),
    };

    debts.push(debt);
    updateDebtList();
    this.reset();
});

function updateDebtList() {
    const debtTable = document.getElementById('debts');
    const totalElement = document.getElementById('total');

    debtTable.innerHTML = '';
    let total = 0;

    debts.forEach((debt, index) => {
        total += debt.value;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${debt.name}</td>
            <td>${debt.pix}</td>
            <td>R$ ${debt.value.toFixed(2)}</td>
            <td>${debt.installments}x de R$ ${debt.perInstallment}</td>
            <td>
                <button onclick="editDebt(${index})">Editar</button>
                <button onclick="deleteDebt(${index})">Excluir</button>
            </td>
        `;
        debtTable.appendChild(row);
    });

    totalElement.textContent = total.toFixed(2);
}

function editDebt(index) {
    const debt = debts[index];

    document.getElementById('name').value = debt.name;
    document.getElementById('pix').value = debt.pix;
    document.getElementById('value').value = debt.value;
    document.getElementById('installments').value = debt.installments;

    deleteDebt(index);
}

function deleteDebt(index) {
    debts.splice(index, 1);
    updateDebtList();
}

document.getElementById('export-csv').addEventListener('click', function () {
    const csvContent = debts.map(debt =>
        `${debt.name},${debt.pix},${debt.value},${debt.installments},${debt.perInstallment}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'debts.csv';
    link.click();
});

document.getElementById('import-csv').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const lines = reader.result.split('\n');
        lines.forEach(line => {
            const [name, pix, value, installments, perInstallment] = line.split(',');
            debts.push({
                name,
                pix,
                value: parseFloat(value),
                installments: parseInt(installments),
                perInstallment: parseFloat(perInstallment).toFixed(2),
            });
        });
        updateDebtList();
    };

    reader.readAsText(file);
});

document.getElementById('export-pdf').addEventListener('click', function () {
    const doc = new jsPDF();
    doc.text('Relatório de Dívidas', 10, 10);

    debts.forEach((debt, index) => {
        doc.text(
            `${index + 1}. ${debt.name} | PIX: ${debt.pix} | R$ ${debt.value.toFixed(2)} | Parcelas: ${debt.installments}x de R$ ${debt.perInstallment}`,
            10,
            20 + index * 10
        );
    });

    doc.save('debts.pdf');
});
