# FinTrack Budget Manager

FinTrack is a modern personal finance dashboard built with React and Vite. It helps users track income, expenses, budgets, savings goals, and spending trends with a clean fintech-style interface.

## About Project

This project is a browser-only budgeting application with persistent LocalStorage support. It is designed to feel like a polished banking dashboard while still staying beginner friendly and easy to extend.

## Features

- Dashboard cards for total balance, income, expenses, and savings percentage
- Animated number counters
- Add transaction form with validation and automatic reset
- Transaction history with delete, search, and category filters
- Monthly budget management with safe, warning, and over-budget progress states
- Expense pie chart and income vs expense bar chart using Recharts
- LocalStorage persistence for transactions, budget, savings goal, and theme
- Dark and light mode with saved preference
- Recent transactions widget
- Financial health score
- Biggest expense card
- Savings goal tracker
- Clear all data button
- Toast notifications
- Responsive empty states for an improved first-run experience

## Tech Stack

- React.js
- Vite
- CSS only
- LocalStorage
- Recharts

## Screenshots

Add screenshots after running the app locally and capturing the dashboard, transactions, and charts screens.

- Dashboard view: `./screenshots/dashboard.png`
- Transactions view: `./screenshots/transactions.png`
- Charts view: `./screenshots/charts.png`

## Installation Steps

1. Install dependencies:

	```bash
	npm install
	```

2. Start the development server:

	```bash
	npm run dev
	```

3. Build for production:

	```bash
	npm run build
	```

4. Preview the production build:

	```bash
	npm run preview
	```

## GitHub Pages Deployment Link

After publishing the repository, deploy the built `dist` folder to GitHub Pages and update this link:

[https://<your-github-username>.github.io/fintrack-budget-manager/](https://<your-github-username>.github.io/fintrack-budget-manager/)

## Push And Deploy Workflow

1. Push your code to the default branch used by your repository (`main` or `master`).
2. GitHub Actions runs the workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
3. The workflow builds the app with the GitHub Pages base path and deploys the `dist` folder automatically.
4. Enable GitHub Pages in repository settings if it is not already turned on.

## Notes

- The app stores all user data in the browser, so refreshes do not clear progress.
- If you change the repository name, update the GitHub Pages URL accordingly.
