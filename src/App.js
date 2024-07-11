import { useState, useEffect } from "react";
import "./App.css";

//*const mockRates = {
//USD: 1,
//EUR: 0.85,
//CAD: 1.25,
//INR: 74.5,
//};

export default function App() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);

  function handleInput(event) {
    setAmount(Number(event.target.value));
  }

  function handleFromCurrencyChange(event) {
    setFromCurrency(event.target.value);
  }

  function handleToCurrencyChange(event) {
    setToCurrency(event.target.value);
  }

  function handleConvert() {
    if (currencyData && amount && fromCurrency && toCurrency) {
      const fromRate = currencyData[fromCurrency];
      const toRate = currencyData[toCurrency];

      if (typeof fromRate === "number" && typeof toRate === "number") {
        const converted = (amount / fromRate) * toRate;
        setConvertedAmount(converted.toFixed(0));
      } else {
        console.log(
          `Invalid rates => From rate: ${fromRate}, To rate: ${toRate}`
        );
      }
    }
  }

  useEffect(function () {
    async function convertCurrency() {
      try {
        const res = await fetch(
          `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_o5DbnBszGqxplDIrE6h2Setm1KEoSR0nuTobjKaq`
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
  }, []);

  return (
    <div className="btn-style">
      <input
        value={amount}
        placeholder="Enter amount..."
        onChange={handleInput}
        className="btn-style"
        type="number"
      />

      <select
        className="btn-style"
        value={fromCurrency}
        onChange={handleFromCurrencyChange}
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
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <button className="btn-style" onClick={handleConvert}>
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
//first we want react to recognise our input
