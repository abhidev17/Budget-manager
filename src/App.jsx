import { useEffect, useState } from 'react'
import Budget from './components/Budget'
import Charts from './components/Charts'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import './App.css'

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Education', 'Other']

const storageKeys = {
  transactions: 'fintrack-transactions',
  budget: 'fintrack-budget',
  theme: 'fintrack-theme',
  savingsGoal: 'fintrack-savings-goal',
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(amount) {
  return currencyFormatter.format(Number(amount) || 0)
}

function safeRead(key, fallback) {
  try {
    if (typeof window === 'undefined') {
      return fallback
    }

    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return fallback
    }

    return JSON.parse(storedValue)
  } catch {
    return fallback
  }
}

function safeReadNumber(key, fallback) {
  const storedValue = safeRead(key, fallback)
  const parsedValue = Number(storedValue)

  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function calculateFinancialHealthScore({ totalIncome, totalExpenses, budgetUsage, balance }) {
  if (totalIncome === 0 && totalExpenses === 0) {
    return 50
  }

  const savingsRate = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0
  let score = 42

  score += Math.min(30, savingsRate * 0.85)

  if (budgetUsage <= 70) {
    score += 18
  } else if (budgetUsage <= 100) {
    score += 7
  } else {
    score -= 18
  }

  if (balance > 0) {
    score += 8
  } else if (balance < 0) {
    score -= 8
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function App() {
  const [transactions, setTransactions] = useState(() => safeRead(storageKeys.transactions, []))
  const [budget, setBudget] = useState(() => safeReadNumber(storageKeys.budget, 0))
  const [theme, setTheme] = useState(() => {
    const storedTheme = safeRead(storageKeys.theme, '')

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'light'
  })
  const [savingsGoal, setSavingsGoal] = useState(() => safeReadNumber(storageKeys.savingsGoal, 50000))
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(storageKeys.budget, JSON.stringify(budget))
  }, [budget])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(storageKeys.theme, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(storageKeys.savingsGoal, JSON.stringify(savingsGoal))
  }, [savingsGoal])

  const addToast = (message, tone = 'info') => {
    const id = createId()
    setToasts((currentToasts) => [...currentToasts, { id, message, tone }])

    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, 2800)
  }

  const handleAddTransaction = (transaction) => {
    const nextTransaction = {
      ...transaction,
      id: createId(),
      amount: Number(transaction.amount),
    }

    setTransactions((currentTransactions) => [nextTransaction, ...currentTransactions])
    addToast('Transaction added successfully.', 'success')
  }

  const handleDeleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
    addToast('Transaction deleted.', 'warning')
  }

  const handleSaveBudget = (nextBudget) => {
    setBudget(nextBudget)
    addToast('Monthly budget saved.', 'success')
  }

  const handleSaveSavingsGoal = (nextGoal) => {
    setSavingsGoal(nextGoal)
    addToast('Savings goal updated.', 'success')
  }

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const handleClearAll = () => {
    const shouldClear = window.confirm('Clear all financial data from this browser?')

    if (!shouldClear) {
      return
    }

    setTransactions([])
    setBudget(0)
    setSavingsGoal(50000)
    addToast('All financial data cleared.', 'warning')
  }

  const sortedTransactions = [...transactions].sort(
    (firstTransaction, secondTransaction) =>
      new Date(secondTransaction.date).getTime() - new Date(firstTransaction.date).getTime(),
  )
  const expenseTransactions = sortedTransactions.filter(
    (transaction) => transaction.type === 'Expense',
  )
  const incomeTransactions = sortedTransactions.filter((transaction) => transaction.type === 'Income')
  const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalBalance = totalIncome - totalExpenses
  const savingsPercentage = totalIncome > 0 ? Math.max(0, Math.round((totalBalance / totalIncome) * 100)) : 0
  const budgetSpent = totalExpenses
  const budgetRemaining = budget - budgetSpent
  const budgetUsage = budget > 0 ? (budgetSpent / budget) * 100 : 0
  const currentSavings = Math.max(totalBalance, 0)
  const recentTransactions = sortedTransactions.slice(0, 4)
  const biggestExpense = expenseTransactions.reduce((largestTransaction, transaction) => {
    if (!largestTransaction || transaction.amount > largestTransaction.amount) {
      return transaction
    }

    return largestTransaction
  }, null)
  const expenseBreakdownMap = expenseTransactions.reduce((result, transaction) => {
    result[transaction.category] = (result[transaction.category] || 0) + transaction.amount
    return result
  }, {})
  const expenseBreakdown = Object.entries(expenseBreakdownMap)
    .map(([name, value]) => ({ name, value }))
    .sort((firstEntry, secondEntry) => secondEntry.value - firstEntry.value)
  const cashFlowData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpenses },
  ].filter((entry) => entry.value > 0)
  const financialHealthScore = calculateFinancialHealthScore({
    totalIncome,
    totalExpenses,
    budgetUsage,
    balance: totalBalance,
  })

  return (
    <main className="app-shell">
      <Dashboard
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savingsPercentage={savingsPercentage}
        budget={budget}
        budgetSpent={budgetSpent}
        budgetRemaining={budgetRemaining}
        budgetUsage={budgetUsage}
        recentTransactions={recentTransactions}
        biggestExpense={biggestExpense}
        financialHealthScore={financialHealthScore}
        savingsGoal={savingsGoal}
        currentSavings={currentSavings}
        onSavingsGoalChange={handleSaveSavingsGoal}
        isDarkMode={theme === 'dark'}
        onToggleTheme={handleToggleTheme}
        onClearAll={handleClearAll}
        formatCurrency={formatCurrency}
      />

      <section className="workspace-grid">
        <div className="workspace-grid__column">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            onNotify={addToast}
            categories={categories}
          />
          <Budget
            budget={budget}
            spent={budgetSpent}
            remaining={budgetRemaining}
            usage={budgetUsage}
            onSaveBudget={handleSaveBudget}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="workspace-grid__column">
          <Charts
            expenseBreakdown={expenseBreakdown}
            cashFlowData={cashFlowData}
            formatCurrency={formatCurrency}
          />
          <TransactionList
            transactions={sortedTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            categories={categories}
            formatCurrency={formatCurrency}
          />
        </div>
      </section>

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              aria-label="Dismiss notification"
              onClick={() =>
                setToasts((currentToasts) => currentToasts.filter((item) => item.id !== toast.id))
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
