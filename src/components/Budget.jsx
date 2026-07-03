import { useEffect, useState } from 'react'

function Budget({ budget, spent, remaining, usage, onSaveBudget, formatCurrency }) {
  const [draftBudget, setDraftBudget] = useState(String(budget || 0))

  useEffect(() => {
    setDraftBudget(String(budget || 0))
  }, [budget])

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsedBudget = Number(draftBudget)

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      return
    }

    onSaveBudget(parsedBudget)
  }

  const progressTone = usage <= 70 ? 'safe' : usage <= 100 ? 'warning' : 'danger'

  return (
    <section className="glass-card budget-card">
      <div className="card-header">
        <div>
          <p className="section-kicker">Budget management</p>
          <h2>Set your monthly budget</h2>
        </div>
        <span className={`chip chip--${progressTone}`}>{progressTone}</span>
      </div>

      <form className="budget-form" onSubmit={handleSubmit}>
        <label className="field field--compact">
          <span>Monthly budget amount</span>
          <input
            type="number"
            min="0"
            step="1"
            value={draftBudget}
            onChange={(event) => setDraftBudget(event.target.value)}
            placeholder="20000"
          />
        </label>

        <button type="submit" className="button button--primary button--compact">
          Save budget
        </button>
      </form>

      <div className="budget-summary-grid">
        <div>
          <span>Budget</span>
          <strong>{formatCurrency(budget)}</strong>
        </div>
        <div>
          <span>Spent</span>
          <strong>{formatCurrency(spent)}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong className={remaining < 0 ? 'negative' : 'positive'}>{formatCurrency(remaining)}</strong>
        </div>
      </div>

      <div className="progress-bar progress-bar--budget" aria-hidden="true">
        <div
          className={`progress-bar__fill progress-bar__fill--${progressTone}`}
          style={{ width: `${Math.min(usage, 150)}%` }}
        />
      </div>

      <p className="muted-copy">
        {remaining >= 0
          ? `You have ${formatCurrency(remaining)} left for the month.`
          : `You are over budget by ${formatCurrency(Math.abs(remaining))}.`}
      </p>
    </section>
  )
}

export default Budget
