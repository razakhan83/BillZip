export const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs.' },
  { code: 'USD', symbol: '$' },
  { code: 'AED', symbol: 'DH' },
  { code: 'GBP', symbol: '£' },
  { code: 'EUR', symbol: '€' },
  { code: 'INR', symbol: '₹' },
]

export function formatCurrency(amount: number, symbol: string = 'Rs.') {
  return `${symbol} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
