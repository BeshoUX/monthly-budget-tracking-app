// Budget App - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

function initApp() {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Load transactions from localStorage
    loadTransactions();

    // Set up event listeners
    document.getElementById('transactionForm').addEventListener('submit', addTransaction);
    document.getElementById('clearAll').addEventListener('click', clearAllTransactions);
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
}

// Category icons and names mapping
const categoryMap = {
    food: { icon: '🍔', name: 'Food & Dining' },
    rent: { icon: '🏠', name: 'Rent / Housing' },
    utilities: { icon: '💡', name: 'Utilities' },
    transport: { icon: '🚗', name: 'Transport' },
    entertainment: { icon: '🎬', name: 'Entertainment' },
    shopping: { icon: '🛍️', name: 'Shopping' },
    health: { icon: '🏥', name: 'Health' },
    salary: { icon: '💰', name: 'Salary' },
    freelance: { icon: '💼', name: 'Freelance' },
    other: { icon: '📦', name: 'Other' }
};

// Load transactions from localStorage
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('budgetTransactions')) || [];
    displayTransactions(transactions);
    updateSummary(transactions);
    updateProgress(transactions);
}

// Save transactions to localStorage
function saveTransactions(transactions) {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
}

// Add a new transaction
function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!description || !amount || amount <= 0 || !category || !date) {
        alert('Please fill in all fields correctly');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    };

    const transactions = JSON.parse(localStorage.getItem('budgetTransactions')) || [];
    transactions.unshift(transaction); // Add to beginning of list
    saveTransactions(transactions);

    // Reset form
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = 'expense';
    document.getElementById('date').valueAsDate = new Date();

    // Update display
    loadTransactions();
}

// Delete a transaction
function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    let transactions = JSON.parse(localStorage.getItem('budgetTransactions')) || [];
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);
    loadTransactions();
}

// Clear all transactions
function clearAllTransactions() {
    if (!confirm('Are you sure you want to delete ALL transactions? This cannot be undone!')) {
        return;
    }
    localStorage.removeItem('budgetTransactions');
    loadTransactions();
}

// Export transactions to Excel (.xlsx)
function exportToExcel() {
    const transactionData = JSON.parse(localStorage.getItem('budgetTransactions')) || [];

    if (transactionData.length === 0) {
        alert('No transactions to export!');
        return;
    }

    // Transform transactions for Excel export
    const excelData = transactionData.map(transaction => {
        const categoryInfo = categoryMap[transaction.category] || { name: 'Other' };
        return {
            'Date': formatDate(transaction.date),
            'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
            'Description': transaction.description,
            'Category': categoryInfo.name,
            'Amount': transaction.amount
        };
    });

    // Calculate totals
    const income = transactionData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactionData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    const totals = {
        'Date': 'Totals',
        'Type': '',
        'Description': '',
        'Category': 'Grand Total',
        'Amount': balance
    };

    // Create worksheet with totals row
    const wsWithTotals = XLSX.utils.json_to_sheet([...excelData, totals]);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsWithTotals, 'Transactions');

    // Generate filename with current date
    const now = new Date();
    const filename = `Budget_${now.toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);

    alert(`Exported ${transactionData.length} transactions to ${filename}!`);
}

// Display transactions in the list
function displayTransactions(transactions) {
    const transactionsList = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-transactions">No transactions yet. Add your first transaction above!</p>';
        return;
    }

    transactionsList.innerHTML = transactions.map(transaction => {
        const categoryInfo = categoryMap[transaction.category] || { icon: '📦', name: 'Other' };
        const amountFormatted = formatCurrency(transaction.amount);

        return `
            <li class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon">${categoryInfo.icon}</div>
                    <div class="transaction-details">
                        <h4>${escapeHtml(transaction.description)}</h4>
                        <small>${categoryInfo.name} • ${formatDate(transaction.date)}</small>
                    </div>
                </div>
                <div>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${amountFormatted}
                    </span>
                    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
                </div>
            </li>
        `;
    }).join('');
}

// Update summary cards
function updateSummary(transactions) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

// Update progress bar (expenses as percentage of income)
function updateProgress(transactions) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const progressSection = document.querySelector('.progress-section');
    if (income > 0) {
        const percentage = Math.min((expenses / income) * 100, 100);
        progressSection.innerHTML = `
            <h3>Budget Progress</h3>
            <p>Spent ${percentage.toFixed(1)}% of your monthly income</p>
            <div class="progress-bar">
                <div class="progress">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="progress-text">${percentage.toFixed(1)}%</span>
            </div>
        `;
    } else {
        progressSection.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Add income to see budget progress</p>';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}