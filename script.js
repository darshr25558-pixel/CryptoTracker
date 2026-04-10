const container = document.getElementById("crypto-container");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("search");
const clearSearchBtn = document.getElementById("clear-search");
const sortSelect = document.getElementById("sort");
const refreshBtn = document.getElementById("refresh-btn");

let allCoins = [];

async function getCoins() {
  statusEl.textContent = "Loading...";
  container.innerHTML = "";
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Refreshing...";
  }

  try {
    const api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";
    const resp = await fetch(api);
    const data = await resp.json();
    allCoins = data;
    applyFilters();
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = "Error loading data.";
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = "Refresh";
    }
  }
}

function applyFilters() {
  const query = (searchInput.value || "").trim().toLowerCase();
  clearSearchBtn.disabled = query.length === 0;
  const sort = sortSelect.value;

  let filtered = allCoins.filter((coin) => {
    const n = (coin.name || "").toLowerCase();
    const s = (coin.symbol || "").toLowerCase();
    return n.includes(query) || s.includes(query);
  });

  filtered.sort((a, b) => {
    if (sort === "price_desc") return (b.current_price || 0) - (a.current_price || 0);
    if (sort === "price_asc") return (a.current_price || 0) - (b.current_price || 0);
    if (sort === "change_desc") return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
    if (sort === "change_asc") return (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0);
    return (b.market_cap || 0) - (a.market_cap || 0);
  });

  display(filtered);
}

function display(arr) {
  container.innerHTML = "";

  if (!arr.length) {
    container.innerHTML = '<div class="msgx">No results found.</div>';
    return;
  }

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

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  applyFilters();
  searchInput.focus();
});
if (refreshBtn){refreshBtn.addEventListener("click", getCoins);}

getCoins();