import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CurrencyExchange.css";

// Country-to-Currency mapping
const countryCurrencyMap = {
  "United States (USD)": "USD",
  "Eurozone (EUR)": "EUR",
  "India (INR)": "INR",
  "United Kingdom (GBP)": "GBP",
  "Japan (JPY)": "JPY",
  "Australia (AUD)": "AUD",
  "Canada (CAD)": "CAD",
  "Switzerland (CHF)": "CHF",
  "China (CNY)": "CNY",
  "Brazil (BRL)": "BRL",
  "Russia (RUB)": "RUB",
  "Mexico (MXN)": "MXN",
  "South Africa (ZAR)": "ZAR",
};

const CurrencyExchange = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCountry, setFromCountry] = useState("United States (USD)");
  const [toCountry, setToCountry] = useState("Eurozone (EUR)");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    axios
      .get("https://v6.exchangerate-api.com/v6/7060615bf130d0137a966219/latest/USD")
      .then((response) => {
        setCurrencies(Object.keys(response.data.rates));
      })
      .catch((error) => console.error("Error fetching currency data:", error));
  }, []);

  const convertCurrency = () => {
    const fromCurrency = countryCurrencyMap[fromCountry];
    const toCurrency = countryCurrencyMap[toCountry];

    axios
      .get(
        `https://v6.exchangerate-api.com/v6/7060615bf130d0137a966219/pair/${fromCurrency}/${toCurrency}/${amount}`
      )
      .then((response) => {
        setConvertedAmount(response.data.conversion_result);
      })
      .catch((error) => console.error("Conversion error:", error));
  };

  return (
    <div className="currency-exchange">
      <h2>Currency Converter</h2>

      <div className="converter-container">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          className="currency-input"
        />


        <select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} className="currency-select">
          {Object.keys(countryCurrencyMap).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <span className="arrow">➡</span>


        <select value={toCountry} onChange={(e) => setToCountry(e.target.value)} className="currency-select">
          {Object.keys(countryCurrencyMap).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <button onClick={convertCurrency} className="convert-btn">
        Convert
      </button>

      {convertedAmount !== null && (
        <h3 className="result">
          {amount} {countryCurrencyMap[fromCountry]} = {convertedAmount} {countryCurrencyMap[toCountry]}
        </h3>
      )}
    </div>
  );
};

export default CurrencyExchange;
