document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const currentBalance = document.getElementById('currentBalance');
    const profitStatus = document.getElementById('profitStatus');
    const activeTrades = document.getElementById('activeTrades');
    const dailyProfit = document.getElementById('dailyProfit');
    const totalROI = document.getElementById('totalROI');
    const investBtn = document.getElementById('investBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const managePinBtn = document.getElementById('managePinBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const withdrawAmount = document.getElementById('withdrawAmount');
    const passcode = document.getElementById('passcode');
    const confirmWithdraw = document.getElementById('confirmWithdraw');
    const resetPinLink = document.getElementById('resetPinLink');
    const newPin = document.getElementById('newPin');
    const confirmPin = document.getElementById('confirmPin');
    const savePinBtn = document.getElementById('savePinBtn');
    const pinError = document.getElementById('pinError');
    const planInvestBtns = document.querySelectorAll('.plan-invest-btn');
    const investOptions = document.querySelectorAll('.invest-btn');
    const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];

    // User data
    let user = {
        name: 'Investor',
        balance: 0,
        pin: null,
        investments: [],
        transactions: []
    };

    // Initialize dashboard
    function initDashboard() {
        // Load user data from localStorage if available
        const savedUser = localStorage.getItem('bbcInvestmentUser');
        if (savedUser) {
            user = JSON.parse(savedUser);
            // Check if user needs to set a PIN
            if (!user.pin) {
                setTimeout(() => {
                    openModal('pinModal');
                }, 1000);
            }
        } else {
            // Default user data
            user = {
                name: 'Investor',
                balance: 0,
                pin: null,
                investments: [],
                transactions: []
            };
            saveUserData();
            setTimeout(() => {
                openModal('pinModal');
            }, 1000);
        }

        updateUI();
        simulateTrading();
    }

    // Update UI with user data
    function updateUI() {
        usernameDisplay.textContent = user.name;
        currentBalance.textContent = `$${user.balance.toFixed(2)} / ₦${(user.balance * 1000).toFixed(0)}`;
        
        // Calculate profit (simulated)
        const profit = user.balance > 0 ? (Math.random() * 0.05 * user.balance) : 0;
        const profitPercent = user.balance > 0 ? (profit / user.balance * 100) : 0;
        
        profitStatus.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(2)} (${profitPercent.toFixed(2)}%) Today`;
        profitStatus.style.color = profit >= 0 ? '#28a745' : '#dc3545';
        
        activeTrades.textContent = user.investments.length;
        dailyProfit.textContent = `$${profit.toFixed(2)}`;
        totalROI.textContent = `${profitPercent.toFixed(2)}%`;
        
        updateTransactionsTable();
    }

    // Simulate trading activity
    function simulateTrading() {
        if (user.investments.length > 0) {
            // Randomly update balance to simulate market fluctuations
            setInterval(() => {
                const fluctuation = (Math.random() * 0.02 - 0.01) * user.balance;
                user.balance += fluctuation;
                
                // Ensure balance doesn't go negative
                if (user.balance < 0) user.balance = 0;
                
                saveUserData();
                updateUI();
            }, 5000);
        }
    }

    // Update transactions table
    function updateTransactionsTable() {
        transactionsTable.innerHTML = '';
        
        if (user.transactions.length === 0) {
            const row = transactionsTable.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.textContent = 'No investment history yet';
            cell.style.textAlign = 'center';
            cell.style.padding = '2rem';
            cell.style.color = '#6c757d';
            return;
        }
        
        // Sort transactions by date (newest first)
        const sortedTransactions = [...user.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedTransactions.forEach(transaction => {
            const row = transactionsTable.insertRow();
            
            const dateCell = row.insertCell(0);
            dateCell.textContent = new Date(transaction.date).toLocaleDateString();
            
            const planCell = row.insertCell(1);
            planCell.textContent = transaction.plan;
            
            const amountCell = row.insertCell(2);
            amountCell.textContent = `$${transaction.amount}`;
            
            const statusCell = row.insertCell(3);
            statusCell.textContent = transaction.status;
            statusCell.className = `status-${transaction.status.toLowerCase()}`;
            
            const returnsCell = row.insertCell(4);
            if (transaction.status === 'Completed') {
                const returns = transaction.returns || transaction.amount * (1 + Math.random());
                returnsCell.textContent = `$${returns.toFixed(2)}`;
                returnsCell.style.color = '#28a745';
            } else if (transaction.type === 'withdrawal') {
                returnsCell.textContent = '--';
                returnsCell.style.color = '#6c757d';
            } else {
                returnsCell.textContent = 'Pending';
                returnsCell.style.color = '#6c757d';
            }
        });
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('bbcInvestmentUser', JSON.stringify(user));
    }

    // Modal functions
    function openModal(modalId) {
        closeAllModals();
        document.getElementById(modalId).style.display = 'block';
    }

    function closeAllModals() {
        modals.forEach(m => m.style.display = 'none');
        // Clear form fields and errors
        withdrawAmount.value = '';
        passcode.value = '';
        newPin.value = '';
        confirmPin.value = '';
        pinError.textContent = '';
    }

    // Validate PIN (4 digits)
    function validatePIN(pin) {
        return /^\d{4}$/.test(pin);
    }

    // Event Listeners
    investBtn.addEventListener('click', () => openModal('investmentModal'));
    withdrawBtn.addEventListener('click', () => {
        if (!user.pin) {
            alert('Please set your 4-digit security PIN first');
            openModal('pinModal');
            return;
        }
        openModal('withdrawalModal');
    });
    
    managePinBtn.addEventListener('click', () => {
        if (!user.pin) {
            alert('You need to set a PIN first');
            return;
        }
        // In a real app, would verify current PIN before allowing change
        openModal('pinModal');
    });
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('bbcInvestmentUser');
        window.location.href = 'login.html'; // Redirect to login page
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Reset PIN link
    resetPinLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('pinModal');
    });

    // Withdrawal functionality
    confirmWithdraw.addEventListener('click', () => {
        const amount = parseFloat(withdrawAmount.value);
        const pin = passcode.value;
        
        if (isNaN(amount) || amount < 100) {
            alert('Minimum withdrawal amount is $100');
            return;
        }
        
        if (amount > user.balance) {
            alert('Insufficient balance for this withdrawal');
            return;
        }
        
        if (!pin || pin !== user.pin) {
            alert('Incorrect PIN. Please try again.');
            return;
        }
        
        // Process withdrawal
        user.balance -= amount;
        user.transactions.push({
            date: new Date(),
            plan: 'Withdrawal',
            amount: amount,
            status: 'Processing',
            type: 'withdrawal'
        });
        
        saveUserData();
        updateUI();
        alert(`Withdrawal request for $${amount.toFixed(2)} has been submitted. Processing may take 1-3 business days.`);
        closeAllModals();
    });

    // PIN creation/update
    savePinBtn.addEventListener('click', () => {
        const pin1 = newPin.value;
        const pin2 = confirmPin.value;
        
        if (!validatePIN(pin1)) {
            pinError.textContent = 'PIN must be exactly 4 digits';
            return;
        }
        
        if (pin1 !== pin2) {
            pinError.textContent = 'PINs do not match';
            return;
        }
        
        user.pin = pin1;
        saveUserData();
        alert('Your 4-digit security PIN has been saved successfully');
        closeAllModals();
    });

    // Investment functionality
    planInvestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseFloat(e.target.getAttribute('data-amount'));
            openInvestmentModal(amount);
        });
    });

    investOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const amount = parseFloat(e.target.closest('.option-card').getAttribute('data-amount'));
            processInvestment(amount);
        });
    });

    function openInvestmentModal(amount) {
        openModal('investmentModal');
        // You could scroll to or highlight the specific option here
    }

    function processInvestment(amount) {
        // In a real app, this would redirect to payment processing
        // For demo, we'll just add to balance
        user.balance += amount;
        
        // Record transaction
        user.transactions.push({
            date: new Date(),
            plan: getPlanName(amount),
            amount: amount,
            status: 'Active',
            type: 'investment'
        });
        
        // Add to investments
        user.investments.push({
            amount: amount,
            date: new Date(),
            plan: getPlanName(amount)
        });
        
        saveUserData();
        updateUI();
        alert(`Successfully invested $${amount}. Your funds are now being actively traded.`);
        closeAllModals();
    }

    function getPlanName(amount) {
        if (amount === 10) return 'Basic Plan';
        if (amount === 50) return 'Standard Plan';
        if (amount === 100) return 'Premium Plan';
        if (amount === 200) return 'VIP Plan';
        return 'Custom Plan';
    }

    // Initialize the dashboard
    initDashboard();
});
