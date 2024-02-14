
from flask import render_template

def convertHTML(data):
    incomes = data['incomes']
    expenses = data['expenses']
    totalAmountIncomes = 0
    totalAmountExpenses = 0
    for income in incomes:
        totalAmountIncomes += income['amount']
    for expense in expenses:
        totalAmountExpenses += expense['amount']
    totalBalance = totalAmountIncomes - totalAmountExpenses

    return render_template('balance.html', incomes = incomes , expenses = expenses, 
                            totalAmountIncomes = totalAmountIncomes, 
                            totalAmountExpenses = totalAmountExpenses, 
                            totalBalance = totalBalance)