let options = document.querySelectorAll(".options");
let submit_button = document.querySelector(".submit_button");

// Base URL for the currency API
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/";

// Function to update the flag
function updateFlag(selectElement) {
    let currCode = selectElement.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = selectElement.parentElement.querySelector("img");
    img.src = newSrc;
}

// Populate the currency options
for (let select of options) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = `${countryList[currCode]}`;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);

    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Fetch currency from the API
// Fetch currency from the API
const updateExchangeRate = async () => {
    let inputAmount = parseFloat(document.querySelector("#input_amount").value);
    let fromCurrency = document.querySelector("#currency_from").value.toLowerCase();
    let toCurrency = document.querySelector("#currency_to").value.toLowerCase();

    if (isNaN(inputAmount) || inputAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const url = `${BASE_URL}currencies/${fromCurrency}.json`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch currency data");
        }
        let data = await response.json();

        // Access the rate using the correct structure
        let baseRates = data[fromCurrency];
        let rate = baseRates ? baseRates[toCurrency] : undefined;

        if (rate) {
            let convertedAmount = (inputAmount * rate).toFixed(2);
            document.querySelector("#output_amount").value = convertedAmount;
            console.log(`Converted ${inputAmount} ${fromCurrency.toUpperCase()} to ${convertedAmount} ${toCurrency.toUpperCase()}`);
        } else {
            alert(`Conversion rate for ${toCurrency.toUpperCase()} not available.`);
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        alert("Failed to fetch exchange rates. Please try again later.");
    }
};


// Button event listener to trigger exchange rate update
submit_button.addEventListener("click", updateExchangeRate);

// Update flags on page load
window.addEventListener("load", () => {
    updateFlag(document.querySelector("#currency_from"));
    updateFlag(document.querySelector("#currency_to"));
});
