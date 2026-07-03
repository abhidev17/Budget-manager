import { useMemo, useState } from 'react'

function formatDate(dateValue) {
  const date = new Date(dateValue)

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function TransactionList({ transactions, onDeleteTransaction, categories, formatCurrency }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesQuery = transaction.title.toLowerCase().includes(query.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || transaction.category === selectedCategory

      return matchesQuery && matchesCategory
    })
  }, [query, selectedCategory, transactions])

  return (
    <section className="glass-card list-card">
      <div className="card-header">
        <div>
          <p className="section-kicker">Transaction history</p>
          <h2>Search, filter, and manage every entry</h2>
        </div>
        <span className="chip chip--neutral">{filteredTransactions.length} items</span>
      </div>

      <div className="list-controls">
        <label className="field field--compact">
          <span>Search transactions</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title..."
          />
        </label>

        <label className="field field--compact">
          <span>Filter by category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <article className="transaction-item" key={transaction.id}>
              <div className="transaction-item__main">
                <div>
                  <h3>{transaction.title}</h3>
                  <p>
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <span
                  className={`chip chip--${transaction.type === 'Income' ? 'success' : 'danger'}`}
                >
                  {transaction.type}
                </span>
              </div>

              <div className="transaction-item__footer">
                <strong className={transaction.type === 'Expense' ? 'negative' : 'positive'}>
                  {transaction.type === 'Expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </strong>

                <button
                  type="button"
                  className="button button--ghost button--danger"
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__art" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <h3>No matching transactions</h3>
          <p>
            Try a different search term or category, or add your first transaction to get started.
          </p>
        </div>
      )}
    </section>
  )
}

export default TransactionList
