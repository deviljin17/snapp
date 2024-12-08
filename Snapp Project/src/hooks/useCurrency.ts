import { useState, useEffect } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

export const useCurrency = (amount: number, targetCurrency = 'USD') => {
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [userCurrency, setUserCurrency] = useState(targetCurrency);

  useEffect(() => {
    // Detect user's currency based on browser locale
    const locale = navigator.language;
    const currency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).resolvedOptions().currency || 'USD';
    
    setUserCurrency(currency);

    // Fetch exchange rates
    fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (rates[userCurrency]) {
      setConvertedAmount(amount * rates[userCurrency]);
    }
  }, [amount, rates, userCurrency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: userCurrency
    }).format(value);
  };

  return {
    amount: convertedAmount,
    currency: userCurrency,
    formatted: formatCurrency(convertedAmount),
    rates
  };
};