import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);

  useEffect(
    function () {
      async function convertCurrency() {
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching currency derivative"
            );

          const data = await res.json();

          //check if the API response indicates a failure
          if (data.Response === "False") throw new Error("Currency not found");

          //setCurrencyData(mockRates);
          setCurrencyData(data); //update state with fetched data
          setLoading(false); //set loading to false
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
            setLoading(false);
          }
        }
      }
      convertCurrency();
    },
    [amount, fromCurrency, toCurrency]
  );

  function handleInput(event) {
    setAmount(Number(event.target.value));
  }

  function handleFromCurrencyChange(event) {
    setFromCurrency(event.target.value);
  }

  function handleToCurrencyChange(event) {
    setToCurrency(event.target.value);
  }

  function HandleConvert() {
    if (currencyData && amount && fromCurrency && toCurrency) {
      const fromRate = currencyData.rates[fromCurrency];
      const toRate = currencyData.rates[toCurrency];

      if (typeof fromRate === "number" && typeof toRate === "number") {
        const converted = (amount / fromRate) * toRate;
        setConvertedAmount(converted.toFixed(0));
      } else {
        console.error(
          `Invalid rates => From rate: ${fromRate}, To rate: ${toRate}`
        );
        setError("An error occured during conversion. Please check currencies");
      }
    }
  }

  return (
    <div className="btn-style">
      <input
        value={amount}
        placeholder="Enter amount..."
        onChange={handleInput}
        disabled={loading}
        className="btn-style"
        type="number"
      />

      <select
        className="btn-style"
        value={fromCurrency}
        onChange={handleFromCurrencyChange}
        disabled={loading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        className="btn-style"
        value={toCurrency}
        onChange={handleToCurrencyChange}
        disabled={loading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <button className="btn-style" onClick={HandleConvert}>
        Convert
      </button>
      {convertedAmount !== null && (
        <p className="btn-style">converted amount: {convertedAmount}</p>
      )}
    </div>
  );
}

//currecncy conversion app. so we enter any number in the
//input section. afterwards, there will be the a conversion
//from the first currency to the second one you choose
//first we want react to recognise our input}
