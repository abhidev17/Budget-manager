import { useEffect, useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

function TransactionForm({ onAddTransaction, onNotify, categories }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Expense')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(today)

  useEffect(() => {
    setDate(today)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const parsedAmount = Number(amount)

    if (!trimmedTitle || !parsedAmount || parsedAmount <= 0 || !date || !type || !category) {
      onNotify('Please complete every transaction field.', 'error')
      return
    }

    onAddTransaction({
      title: trimmedTitle,
      amount: parsedAmount,
      type,
      category,
      date,
    })

    setTitle('')
    setAmount('')
    setType('Expense')
    setCategory('Food')
    setDate(today)
  }

  return (
    <section className="glass-card form-card">
      <div className="card-header">
        <div>
          <p className="section-kicker">Add transaction</p>
          <h2>Log your cash flow</h2>
        </div>
        <span className="chip chip--accent">LocalStorage saved</span>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Transaction title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Groceries, salary, travel..."
          />
        </label>

        <div className="field-grid field-grid--two">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1500"
            />
          </label>

          <label className="field">
            <span>Type</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </label>
        </div>

        <div className="field-grid field-grid--two">
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        </div>

        <button type="submit" className="button button--primary button--wide">
          Add transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
