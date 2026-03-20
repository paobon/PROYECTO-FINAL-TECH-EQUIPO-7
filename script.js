const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const tableBody = document.getElementById("dataTableBody");
const canvas = document.getElementById("energyChart");
const ctx = canvas.getContext("2d");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const tableData = [
  { year: 1965, country: "USA", hydro: 120, solar: 0 },
  { year: 1980, country: "Brasil", hydro: 300, solar: 0 },
  { year: 2000, country: "China", hydro: 500, solar: 2 },
  { year: 2022, country: "Global", hydro: 1200, solar: 900 }
];

const chartData = {
  years: [1965, 1975, 1985, 1995, 2005, 2015, 2022],
  hydro: [80, 120, 180, 290, 450, 820, 1200],
  solar: [0, 0, 2, 8, 60, 320, 900],
  wind: [0, 1, 5, 18, 90, 260, 700]
};

function renderTable() {
  tableBody.innerHTML = "";

  tableData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.year}</td>
      <td>${item.country}</td>
      <td>${item.hydro}</td>
      <td>${item.solar}</td>
    `;
    tableBody.appendChild(row);
  });
}

function drawChart() {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = 45;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const allValues = [
    ...chartData.hydro,
    ...chartData.solar,
    ...chartData.wind
  ];
  const maxValue = Math.max(...allValues);

  // Fondo
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, "#ffffff");
  bgGradient.addColorStop(1, "#eef7ff");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Rejilla horizontal
  ctx.strokeStyle = "#d9e9f7";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Ejes
  ctx.strokeStyle = "#7ea4c6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Etiquetas Y
  ctx.fillStyle = "#4b657f";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";

  for (let i = 0; i <= 5; i++) {
    const value = Math.round(maxValue - (maxValue / 5) * i);
    const y = padding + (chartHeight / 5) * i + 4;
    ctx.fillText(value, padding - 8, y);
  }

  // Etiquetas X
  ctx.textAlign = "center";
  chartData.years.forEach((year, index) => {
    const x = padding + (chartWidth / (chartData.years.length - 1)) * index;
    ctx.fillText(year, x, height - padding + 20);
  });

  drawLine(chartData.hydro, "#3a8dde");
  drawLine(chartData.solar, "#f4c542");
  drawLine(chartData.wind, "#60c7b7");
}

function drawLine(data, color) {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 45;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(
    ...chartData.hydro,
    ...chartData.solar,
    ...chartData.wind
  );

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;

  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const y = height - padding - (value / maxValue) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const y = height - padding - (value / maxValue) * chartHeight;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

renderTable();
drawChart();

window.addEventListener("resize", drawChart);