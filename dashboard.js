document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const currentBalance = document.getElementById('currentBalance');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const investBtn = document.getElementById('investBtn');
    const modal = document.querySelectorAll('.modal');
    const closeModal = document.querySelectorAll('.close-modal');
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const investBtns = document.querySelectorAll('.invest-btn');
    const transactionsList = document.getElementById('transactionsList');
    const confirmWithdraw = document.getElementById('confirmWithdraw');
    const paymentMethod = document.getElementById('paymentMethod');
    
    // User data - starts with zero balance
    const user = {
        name: 'Investor',
        balance: 0,
        currency: 'usd',
        investments: [],
        transactions: []
    };

    // Initialize dashboard
    function initDashboard() {
        usernameDisplay.textContent = user.name;
        updateBalanceDisplay();
        loadTransactions();
        document.querySelector(`.currency-btn[data-currency="${user.currency}"]`).classList.add('active');
    }

    // Update balance display
    function updateBalanceDisplay() {
        if (user.currency === 'usd') {
            currentBalance.textContent = `$${user.balance.toFixed(2)}`;
        } else {
            currentBalance.textContent = `₦${(user.balance * 1000).toFixed(2)}`;
        }
    }

    // Load empty transactions
    function loadTransactions() {
        transactionsList.innerHTML = '<div class="no-transactions">No investment history yet</div>';
    }

    // Currency toggle
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currencyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            user.currency = this.dataset.currency;
            updateBalanceDisplay();
        });
    });

    // Modal controls
    withdrawBtn.addEventListener('click', () => document.getElementById('withdrawalModal').style.display = 'block');
    investBtn.addEventListener('click', () => document.getElementById('investmentModal').style.display = 'block');
    
    closeModal.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Invest now buttons - redirect to Selar payment links
    investBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentLink = this.getAttribute('data-link');
            if (paymentLink) {
                window.location.href = paymentLink;
            }
        });
    });

    // Withdrawal handling - always shows no funds
    confirmWithdraw.addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const method = paymentMethod.value;
        
        // Always show no funds message
        alert(`Cannot withdraw via ${method}. No funds available. Please invest first.`);
        
        // Reset form and close modal
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawalModal').style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        modal.forEach(m => {
            if (event.target === m) {
                m.style.display = 'none';
            }
        });
    });

    // Initialize dashboard
    initDashboard();
});
