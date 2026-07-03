import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const pieColors = ['#7c3aed', '#0ea5e9', '#f59e0b', '#ef4444', '#22c55e', '#14b8a6']

function ChartEmptyState({ title, description }) {
  return (
    <div className="chart-empty">
      <div className="chart-empty__art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Charts({ expenseBreakdown, cashFlowData, formatCurrency }) {
  return (
    <section className="charts-grid">
      <article className="glass-card chart-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Data visualization</p>
            <h2>Expense pie chart</h2>
          </div>
        </div>

        {expenseBreakdown.length > 0 ? (
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`expense-slice-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState
            title="No expense data yet"
            description="Add expense transactions to see how spending is split across categories."
          />
        )}
      </article>

      <article className="glass-card chart-card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Cash flow</p>
            <h2>Income vs expense bars</h2>
          </div>
        </div>

        {cashFlowData.length > 0 ? (
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.18} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
                  }}
                />
                <Legend />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="url(#barGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmptyState
            title="No cash flow data yet"
            description="Your income and expense totals will appear here after you add transactions."
          />
        )}
      </article>
    </section>
  )
}

export default Charts
