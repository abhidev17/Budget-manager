import { useEffect, useRef, useState } from 'react'

function AnimatedNumber({ value, formatter, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValueRef = useRef(value)

  useEffect(() => {
    const fromValue = previousValueRef.current
    const toValue = value
    previousValueRef.current = value

    let frameId = 0
    const duration = 900
    const startTime = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(fromValue + (toValue - fromValue) * easedProgress)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    frameId = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frameId)
  }, [value])

  return (
    <span>
      {formatter(Math.round(displayValue))}
      {suffix}
    </span>
  )
}

function StatCard({ label, value, helperText, formatter, suffix, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <h3 className="stat-card__value">
        <AnimatedNumber value={value} formatter={formatter} suffix={suffix} />
      </h3>
      <p className="stat-card__helper">{helperText}</p>
    </article>
  )
}

function formatDate(dateValue) {
  const date = new Date(dateValue)

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Dashboard({
  totalBalance,
  totalIncome,
  totalExpenses,
  savingsPercentage,
  budget,
  budgetSpent,
  budgetRemaining,
  budgetUsage,
  recentTransactions,
  biggestExpense,
  financialHealthScore,
  savingsGoal,
  currentSavings,
  onSavingsGoalChange,
  isDarkMode,
  onToggleTheme,
  onClearAll,
  formatCurrency,
}) {
  const [goalDraft, setGoalDraft] = useState(String(savingsGoal || 0))

  useEffect(() => {
    setGoalDraft(String(savingsGoal || 0))
  }, [savingsGoal])

  const goalProgress =
    savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0

  const healthTone =
    financialHealthScore >= 75
      ? 'healthy'
      : financialHealthScore >= 50
        ? 'warning'
        : 'risk'

  const healthMessage =
    financialHealthScore >= 75
      ? 'Strong momentum. Keep the savings rate stable.'
      : financialHealthScore >= 50
        ? 'Needs attention. Trim discretionary spending.'
        : 'Budget pressure is high. Adjust spending now.'

  const handleGoalSubmit = (event) => {
    event.preventDefault()
    const parsedGoal = Number(goalDraft)

    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      return
    }

    onSavingsGoalChange(parsedGoal)
  }

  return (
    <section className="dashboard">
      <header className="hero-card glass-card">
        <div>
          <p className="eyebrow">FinTrack - Smart Budget Manager</p>
          <h1>Track income, spending, and savings in one calm dashboard.</h1>
          <p className="hero-copy">
            A modern personal finance workspace for quick decisions, clear
            habits, and money that stays visible.
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" className="button button--ghost" onClick={onToggleTheme}>
            {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
          <button type="button" className="button button--secondary" onClick={onClearAll}>
            Clear all data
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          label="Total balance"
          value={totalBalance}
          helperText="Income minus expenses"
          formatter={formatCurrency}
          tone="balance"
        />
        <StatCard
          label="Total income"
          value={totalIncome}
          helperText="Money coming in"
          formatter={formatCurrency}
          tone="income"
        />
        <StatCard
          label="Total expenses"
          value={totalExpenses}
          helperText="Money going out"
          formatter={formatCurrency}
          tone="expense"
        />
        <StatCard
          label="Savings percentage"
          value={savingsPercentage}
          helperText="Share of income retained"
          formatter={(currentValue) => `${currentValue}`}
          suffix="%"
          tone="savings"
        />
      </div>

      <div className="dashboard-grid">
        <article className={`glass-card score-card score-card--${healthTone}`}>
          <div className="card-header">
            <div>
              <p className="section-kicker">Financial health</p>
              <h2>Money score</h2>
            </div>
            <div className="score-ring" style={{ '--score': financialHealthScore }}>
              <div className="score-ring__inner">
                <strong>{financialHealthScore}</strong>
                <span>/100</span>
              </div>
            </div>
          </div>
          <p className="muted-copy">{healthMessage}</p>
          <div className="inline-metrics">
            <span>Budget usage: {Math.round(budgetUsage)}%</span>
            <span>Budget remaining: {formatCurrency(budgetRemaining)}</span>
          </div>
        </article>

        <article className="glass-card budget-snapshot">
          <div className="card-header">
            <div>
              <p className="section-kicker">Budget overview</p>
              <h2>Monthly control</h2>
            </div>
            <span className="chip chip--success">{budgetUsage <= 100 ? 'On track' : 'Over budget'}</span>
          </div>
          <div className="budget-snapshot__rows">
            <div>
              <span>Monthly budget</span>
              <strong>{formatCurrency(budget)}</strong>
            </div>
            <div>
              <span>Spent</span>
              <strong>{formatCurrency(budgetSpent)}</strong>
            </div>
            <div>
              <span>Remaining</span>
              <strong>{formatCurrency(budgetRemaining)}</strong>
            </div>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <div
              className={`progress-bar__fill progress-bar__fill--${
                budgetUsage <= 70 ? 'safe' : budgetUsage <= 100 ? 'warning' : 'danger'
              }`}
              style={{ width: `${Math.min(budgetUsage, 150)}%` }}
            />
          </div>
        </article>

        <article className="glass-card recent-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Recent activity</p>
              <h2>Latest transactions</h2>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="recent-list">
              {recentTransactions.map((transaction) => (
                <div className="recent-item" key={transaction.id}>
                  <div>
                    <strong>{transaction.title}</strong>
                    <span>{transaction.category}</span>
                  </div>
                  <div className="recent-item__meta">
                    <span
                      className={`chip chip--${transaction.type === 'Income' ? 'success' : 'danger'}`}
                    >
                      {transaction.type}
                    </span>
                    <strong className={transaction.type === 'Expense' ? 'negative' : 'positive'}>
                      {transaction.type === 'Expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </strong>
                    <small>{formatDate(transaction.date)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-mini">
              <div className="empty-mini__art" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Recent transactions will appear here once you start tracking money.</p>
            </div>
          )}
        </article>

        <article className="glass-card expense-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Largest expense</p>
              <h2>Biggest spending line</h2>
            </div>
          </div>

          {biggestExpense ? (
            <div className="biggest-expense">
              <div>
                <strong>{biggestExpense.title}</strong>
                <p>{biggestExpense.category}</p>
              </div>
              <div>
                <strong className="negative">-{formatCurrency(biggestExpense.amount)}</strong>
                <p>{formatDate(biggestExpense.date)}</p>
              </div>
            </div>
          ) : (
            <div className="empty-mini empty-mini--wide">
              <div className="empty-mini__art empty-mini__art--target" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Add an expense to reveal your biggest spending habit.</p>
            </div>
          )}
        </article>

        <article className="glass-card goal-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Savings tracker</p>
              <h2>Goal progress</h2>
            </div>
          </div>
          <form className="goal-form" onSubmit={handleGoalSubmit}>
            <label className="field field--compact">
              <span>Target savings goal</span>
              <input
                type="number"
                min="1"
                step="1"
                value={goalDraft}
                onChange={(event) => setGoalDraft(event.target.value)}
                placeholder="50000"
              />
            </label>
            <button type="submit" className="button button--primary button--compact">
              Save goal
            </button>
          </form>
          <div className="goal-summary">
            <div>
              <span>Saved so far</span>
              <strong>{formatCurrency(currentSavings)}</strong>
            </div>
            <div>
              <span>Goal target</span>
              <strong>{formatCurrency(savingsGoal)}</strong>
            </div>
            <div>
              <span>Completion</span>
              <strong>{Math.round(goalProgress)}%</strong>
            </div>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <div
              className="progress-bar__fill progress-bar__fill--safe"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </article>
      </div>
    </section>
  )
}

export default Dashboard
