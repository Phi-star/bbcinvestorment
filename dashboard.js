document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const currentBalance = document.getElementById('currentBalance');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const investBtn = document.getElementById('investBtn');
    const modal = document.querySelectorAll('.modal');
    const closeModal = document.querySelectorAll('.close-modal');
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const planSelectBtns = document.querySelectorAll('.plan-select-btn');
    const investBtns = document.querySelectorAll('.invest-btn');
    const transactionsList = document.getElementById('transactionsList');
    const confirmWithdraw = document.getElementById('confirmWithdraw');
    
    // Sample user data
    const user = {
        name: 'John Doe',
        balance: 0, // Start with 0 balance
        currency: 'usd',
        investments: [],
        transactions: []
    };
    
    // Investment plan links (placeholder - replace with actual links)
    const investmentLinks = {
        starter: "https://example.com/invest/starter",
        silver: "https://example.com/invest/silver",
        gold: "https://example.com/invest/gold",
        platinum: "https://example.com/invest/platinum"
    };
    
    // Initialize dashboard
    function initDashboard() {
        // Set username
        usernameDisplay.textContent = user.name;
        
        // Set balance
        updateBalanceDisplay();
        
        // Load transactions
        loadTransactions();
        
        // Set current currency
        document.querySelector(`.currency-btn[data-currency="${user.currency}"]`).classList.add('active');
    }
    
    // Update balance display based on selected currency
    function updateBalanceDisplay() {
        if (user.currency === 'usd') {
            currentBalance.textContent = `$${user.balance.toFixed(2)}`;
        } else {
            // Convert to Naira (assuming 1 USD = 1000 NGN for demo)
            currentBalance.textContent = `₦${(user.balance * 1000).toFixed(2)}`;
        }
    }
    
    // Load transactions into the table
    function loadTransactions() {
        transactionsList.innerHTML = '';
        
        user.transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            // Determine status class
            let statusClass = '';
            if (transaction.status === 'completed') {
                statusClass = 'status-completed';
            } else if (transaction.status === 'pending') {
                statusClass = 'status-pending';
            } else if (transaction.status === 'failed') {
                statusClass = 'status-failed';
            }
            
            transactionItem.innerHTML = `
                <div>${transaction.date}</div>
                <div>${transaction.type}</div>
                <div>${transaction.amount > 0 ? '+' : ''}${user.currency === 'usd' ? '$' : '₦'}${user.currency === 'usd' ? transaction.amount.toFixed(2) : (transaction.amount * 1000).toFixed(2)}</div>
                <div class="transaction-status ${statusClass}">${transaction.status}</div>
            `;
            
            transactionsList.appendChild(transactionItem);
        });
    }
    
    // Currency toggle functionality
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currencyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            user.currency = this.dataset.currency;
            updateBalanceDisplay();
            loadTransactions();
        });
    });
    
    // Modal open/close functionality
    withdrawBtn.addEventListener('click', function() {
        document.getElementById('withdrawalModal').style.display = 'block';
    });
    
    investBtn.addEventListener('click', function() {
        document.getElementById('investmentModal').style.display = 'block';
    });
    
    closeModal.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Investment plan selection - redirect to external site
    planSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.dataset.plan;
            document.getElementById('investmentModal').style.display = 'none';
            
            // Redirect to the appropriate investment page
            window.location.href = investmentLinks[plan];
        });
    });
    
    // Individual invest buttons in the modal - redirect to external site
    investBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.closest('.investment-tier').dataset.amount;
            document.getElementById('investmentModal').style.display = 'none';
            
            // Redirect to payment page with amount parameter
            window.location.href = `https://example.com/invest?amount=${amount}`;
        });
    });
    
    // Withdrawal functionality
    confirmWithdraw.addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        if (user.balance <= 0) {
            alert("No funds to withdraw in this account. Please fund your account and invest first.");
            return;
        }
        
        if (isNaN(amount) {
            alert("Please enter a valid amount");
            return;
        }
        
        if (amount < 100) {
            alert("Minimum withdrawal amount is $100");
            return;
        }
        
        if (amount > user.balance) {
            alert("Insufficient funds for this withdrawal");
            return;
        }
        
        // In a real app, this would process the withdrawal
        alert(`Withdrawal request for $${amount.toFixed(2)} via ${paymentMethod} cannot be processed. No funds available. Please invest first.`);
        
        // Close the modal
        document.getElementById('withdrawalModal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        modal.forEach(m => {
            if (event.target === m) {
                m.style.display = 'none';
            }
        });
    });
    
    // Initialize the dashboard
    initDashboard();
    
    // Removed the live trading simulation as requested
});
