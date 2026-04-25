
document.addEventListener('DOMContentLoaded', () => {
  
  const $ = id => document.getElementById(id);

  const priceEl = $('numb1');           
  const savingsEl = $('numb2');         
  const yearsEl = $('numb3');           
  const rateEl = $('interestRate');              
  const TipInmuebleEl = $('TipInmueble'); 
  const provinciaEl = $('region');
  const solicitarBtn = $('solicitarBtn');         
  
  const resMonthly = $('resMonthly');
  const resFinanced = $('resFinanced');
  const resPercent = $('resPercent');
  const resInterest = $('resInterest');
  const resPropertyCost = $('resPropertyCost');
  const resTotalOperation = $('resTotalOperation');
  const canvas = $('miGrafico');

  
  function fmtEUR(v) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(v));
  }

  
  function safeNumber(input) {
    if (!input) return 0;
    const n = parseFloat(input.value);
    return isNaN(n) ? 0 : n;
  }

   const provincias = {
    "Albacete": "castilla-la-mancha",
    "Alicante / Alacant": "comunidad-valenciana",
    "Almería": "andalucia",
    "Araba/Álava": "pais-vasco",
    "Asturias": "asturias",
    "Ávila": "castilla-y-leon",
    "Badajoz": "extremadura",
    "Balears, Illes": "baleares",
    "Barcelona": "cataluna",
    "Bizkaia / Vizcaya": "pais-vasco",
    "Burgos": "castilla-y-leon",
    "Cáceres": "extremadura",
    "Cádiz": "andalucia",
    "Cantabria": "cantabria",
    "Castellón/Castelló": "comunidad-valenciana",
    "Ceuta": "ceuta",
    "Ciudad Real": "castilla-la-mancha",
    "Córdoba": "andalucia",
    "Coruña, A": "galicia",
    "Cuenca": "castilla-la-mancha",
    "Gipuzkoa / Guipúzcoa": "pais-vasco",
     "Girona": "cataluna",
    "Granada": "andalucia",
    "Guadalajara": "castilla-la-mancha",
    "Huelva": "andalucia",
    "Huesca": "aragon",
    "Jaén": "andalucia",
    "León": "castilla-y-leon",
    "Lleida / Lérida": "cataluna",
    "Lugo": "galicia",
    "Madrid": "madrid",
    "Málaga": "andalucia",
    "Melilla": "melilla",
    "Murcia": "murcia",
    "Navarra": "navarra",
    "Ourense / orense": "galicia",
    "Palencia": "castilla-y-leon",
    "Las Palmas": "canarias",
    "Pontevedra": "galicia",
    "La Rioja": "la-rioja",
    "Salamanca": "castilla-y-leon",
     "Santa Cruz de Tenerife": "canarias",
    "Segovia": "castilla-y-leon",
    "Sevilla": "andalucia",
    "Soria": "castilla-y-leon",
    "Tarragona": "cataluna",
    "Teruel": "aragon",
    "Toledo": "castilla-la-mancha",
    "Valencia/València": "comunidad-valenciana",
    "Valladolid": "castilla-y-leon",
    "Zamora": "castilla-y-leon",
    "Zaragoza": "aragon"
  };

  
function getITP(region, price) {
  switch(region) {
    case 'andalucia':
      return 0.07; 
    case 'aragon':
      if (price <= 400000) return 0.08;
      if (price <= 450000) return 0.085;
      if (price <= 500000) return 0.09;
      if (price <= 750000) return 0.095;
      return 0.10;
    case 'asturias':
      if (price <= 300000) return 0.08;
      if (price <= 500000) return 0.09;
      return 0.10;
    case 'baleares':
      if (price <= 400000) return 0.08;
      if (price <= 600000) return 0.09;
      if (price <= 1000000) return 0.10;
      if (price <= 2000000) return 0.12;
      return 0.13;
    case 'canarias':
      return 0.065;
    case 'cantabria':
      return 0.09;
    case 'castilla-la-mancha':
      return 0.09;
    case 'castilla-y-leon':
      return price > 250000 ? 0.10 : 0.08;
    case 'cataluna':
      return price > 1000000 ? 0.11 : 0.10;
    case 'ceuta':
      return 0.06;
    case 'madrid':
      return 0.06;
    case 'comunidad-valenciana':
      return price > 1000000 ? 0.11 : 0.10;
    case 'extremadura':
      if (price <= 360000) return 0.08;
      if (price <= 600000) return 0.10;
      return 0.11;
    case 'galicia':
      return 0.08;
    case 'la-rioja':
      return 0.07;
    case 'melilla':
      return 0.06;
    case 'murcia':
      return 0.0775;
    case 'navarra':
      return 0.06;
    case 'pais-vasco':
      return 0.04;
    default:
      return 0.08; 
  }
}


  
  function drawChart(principal, interest, equity) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth || 300;
    const h = canvas.height = 120;
    ctx.clearRect(0, 0, w, h);

    const total = principal + interest + equity || 1;
    const pW = Math.round((principal / total) * w);
    const iW = Math.round((interest / total) * w);
    const eW = Math.max(0, w - pW - iW);

    
    ctx.fillStyle = 'rgba(141, 37, 37, 1)';
    ctx.fillRect(0, 30, pW, 40);
    
    ctx.fillStyle = 'rgba(229, 62, 62, 1)';
    ctx.fillRect(pW, 30, iW, 40);
    
    ctx.fillStyle = 'rgba(56, 161, 105, 0.89)';
    ctx.fillRect(pW + iW, 30, eW, 40);

    
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText('Capital', 4, 22);
    ctx.fillText('Intereses', Math.max(4, pW + 4), 22);
    ctx.fillText('Entrada', Math.max(4, pW + iW + 4), 22);
  }

  
  function calculateAll() {
    const price = safeNumber(priceEl);
    const savings = safeNumber(savingsEl);
    const years = Math.max(1, Math.round(safeNumber(yearsEl)));
    const annualRate = safeNumber(rateEl);
    const taxesInput = safeNumber(taxesEl);

  
    const TipInmueble = TipInmuebleEl ? TipInmuebleEl.value : 'fija';
    const region = provinciaEl ? provinciaEl.value : 'general';

    const itpRate = getITP(region, price);
    const taxesAdjusted = taxesInput + (price * itpRate);

    const costProperty = price + taxesAdjusted;
    const financed = Math.max(0, costProperty - savings);

    const financedPct = price > 0 ? (financed / price) * 100 : 0;

  
    const monthlyRate = (annualRate / 100) / 12;
    const n = years * 12;
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = financed / n;
    } else {
      monthlyPayment = (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = Math.max(0, totalPayment - financed);
    const costOperation = costProperty + totalInterest;

  
    if (resMonthly) resMonthly.textContent = fmtEUR(monthlyPayment.toFixed(2));
    if (resFinanced) resFinanced.textContent = fmtEUR(financed.toFixed(2));
    if (resPercent) resPercent.textContent = financedPct.toFixed(2) + ' %';
    if (resInterest) resInterest.textContent = fmtEUR(totalInterest.toFixed(2));
    if (resPropertyCost) resPropertyCost.textContent = fmtEUR(costProperty.toFixed(2));
    if (resTotalOperation) resTotalOperation.textContent = fmtEUR(costOperation.toFixed(2));

    drawChart(financed, totalInterest, savings);

  
    return {
      monthlyPayment,
      financed,
      financedPct,
      totalInterest,
      costProperty,
      costOperation,
      TipInmueble,
      region
    };
  }

  
  [priceEl, savingsEl, yearsEl, rateEl].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('keydown', (e) => {
      const allowed = ['Backspace','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete','Home','End'];
      if (allowed.includes(e.key)) return;
  
      if (e.key === '.' || e.key === ',') {
  
        if (inp.value.includes('.') || inp.value.includes(',')) e.preventDefault();
        return;
      }
      if (!/[\d]/.test(e.key)) e.preventDefault();
    });
  });

  
  [priceEl, savingsEl, yearsEl, rateEl, provinciaEl].forEach(i => {
    if (!i) return;
    i.addEventListener('input', calculateAll);
    i.addEventListener('change', calculateAll);
  });




  calculateAll();
});
