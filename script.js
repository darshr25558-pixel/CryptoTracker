const container = document.getElementById("crypto-container");
const statusEl = document.getElementById("status");

async function getCoins() {
  statusEl.textContent = "Loading...";
  container.innerHTML = "";

  try {
    const api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";
    const resp = await fetch(api);
    const data = await resp.json();
    display(data);
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = "Error loading data.";
  }
}

function display(arr) {
  container.innerHTML = "";

  arr.forEach((cont) => {
    const up = (cont.price_change_percentage_24h || 0) >= 0;

    const div = document.createElement("div");
    div.className = "box";
    div.innerHTML = `
      <img src="${cont.image}" alt="${cont.name}">
      <div class="n1">${cont.name}</div>
      <div class="n2">${cont.symbol.toUpperCase()}</div>
      <div class="n3">$${cont.current_price.toLocaleString()}</div>
      <div class="${up ? "upx" : "dnx"}">${(cont.price_change_percentage_24h || 0).toFixed(2)}%</div>
    `;

    container.appendChild(div);
  });
}

getCoins();