# Monthly Budget Tracker

A simple and beautiful web-based budget tracking application that helps you monitor your income, expenses, and budget progress.

## Features

- 📊 **Dashboard Overview**: See your total income, expenses, and current balance at a glance
- 💰 **Transaction Management**: Add and track income and expenses
- 📁 **Category Support**: Categorize your transactions (Food, Rent, Utilities, etc.)
- 📅 **Date Tracking**: Keep track of when each transaction occurred
- 📈 **Budget Progress**: Visual progress bar showing expenses as percentage of income
- 📤 **Excel Export**: Download your transactions as an .xlsx file
- 🗂️ **Local Storage**: All data is saved in your browser's localStorage
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 💾 **Data Persistence**: Your data persists across browser sessions

## Usage

### Open the App

1. Navigate to the `budget-app` directory:
   ```bash
   cd budget-app
   ```

2. Open `index.html` in your web browser:
   - Double-click `index.html`
   - Or drag and drop it into your browser
   - Or use `start index.html` on Windows

### Add Transactions

1. Fill in the transaction details:
   - Description (e.g., "Grocery shopping")
   - Amount (e.g., "75.50")
   - Type (Income or Expense)
   - Category (Select from predefined categories)
   - Date (Defaults to today)

2. Click "Add Transaction"

### View Your Data

- Summary cards show your income, expenses, and balance
- Scroll down to see all your transactions
- Each transaction shows clear details with icons
- Delete individual transactions with the "Delete" button

### Clear All Data

Click "Clear All Transactions" to delete all data (this action cannot be undone).

### Export to Excel

Click the "📥 Export to Excel (.xlsx)" button to download all your transactions to a spreadsheet file. The exported file will include:
- Date
- Type (Income/Expense)
- Description
- Category
- Amount
- Grand total at the bottom

The filename will be formatted as `Budget_YYYY-MM-DD.xlsx`.

## Categories

Income:
- 💰 Salary
- 💼 Freelance

Expenses:
- 🍔 Food & Dining
- 🏠 Rent / Housing
- 💡 Utilities
- 🚗 Transport
- 🎬 Entertainment
- 🛍️ Shopping
- 🏥 Health
- 📦 Other

## Browser Compatibility

Works in all modern browsers that support:
- HTML5
- CSS3
- ES6 JavaScript
- LocalStorage API

## Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server except what you choose to share.

## Template Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - Application logic and interactivity
- `README.md` - This file

## Tips

1. Add all your income first to set your budget baseline
2. Track expenses regularly to stay on top of your spending
3. Use the progress bar to monitor your spending percentage
4. Reset your budget data at the start of each month

## Customization

You can easily customize:
- Colors - Edit the gradient in `styles.css`
- Categories - Add new categories in `app.js`
- Currency - Change the format in `formatCurrency()` function

Enjoy tracking your budget! 🎉