document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);


  const priceEl = $('numb1');
  const savingsEl = $('numb2');
  const yearsEl = $('numb3');
  const rateEl = $('interestRate');
  const taxesEl = $('taxes');
  const tipoInmuebleEl = $('tipoInmueble');
  const provinceEl = $('region');
  const solicitarBtn = $('solicitarBtn');

  const resMonthly = $('resMonthly');
  const resFinanced = $('resFinanced');
  const resPercent = $('resPercent');
  const resInterest = $('resInterest');
  const resPropertyCost = $('resPropertyCost');
  const resTotalOperation = $('resTotalOperation');
  const resPurchaseTaxes = $('resPurchaseTaxes');
  const canvas = $('miGrafico');

  let lastEquity = 0, lastPrincipal = 0, lastInterest = 0;

  function fmtEUR(v) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(v));
  }

  function safeNumber(input) {
    if (!input) return 0;
    const n = parseFloat(input.value);
    return isNaN(n) ? 0 : n;
  }


  const expensByRange = [
    { desde: 30000, hasta: 60000, notaria: 1200, registro: 523, gestoria: 500, otros: 120 },
    { desde: 60001, hasta: 80000, notaria: 1280, registro: 550, gestoria: 500, otros: 120 },
    { desde: 80001, hasta: 100000, notaria: 1350, registro: 610, gestoria: 500, otros: 120 },
    { desde: 100001, hasta: 120000, notaria: 1410, registro: 635, gestoria: 500, otros: 120 },
    { desde: 120001, hasta: 140000, notaria: 1445, registro: 660, gestoria: 500, otros: 120 },
    { desde: 140001, hasta: 160000, notaria: 1520, registro: 660, gestoria: 500, otros: 120 },
    { desde: 160001, hasta: 185000, notaria: 1520, registro: 715, gestoria: 500, otros: 120 },
    { desde: 185001, hasta: 255000, notaria: 1575, registro: 715, gestoria: 500, otros: 120 },
    { desde: 255001, hasta: 2000000, notaria: 1683, registro: 770, gestoria: 500, otros: 120 }
  ];

  function calcularGastosFijos(price) {
    for (let rango of expensByRange) {
      if (price >= rango.desde && price <= rango.hasta) {
        return rango.notaria + rango.registro + rango.gestoria + rango.otros;
      }
    }
    if (price < expensByRange[0].desde) {
      const r = expensByRange[0];
      return r.notaria + r.registro + r.gestoria + r.otros;
    }
    const last = expensByRange[expensByRange.length - 1];
    return last.notaria + last.registro + last.gestoria + last.otros;
  }

  const provinces = {
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
      case 'andalucia': return 0.07;
      case 'aragon': return price <= 400000 ? 0.08 : 0.10;
      case 'asturias': return price <= 300000 ? 0.08 : 0.10;
      case 'baleares': return price <= 400000 ? 0.08 : 0.13;
      case 'canarias': return 0.065;
      case 'cantabria': return 0.09;
      case 'castilla-la-mancha': return 0.09;
      case 'castilla-y-leon': return price > 250000 ? 0.10 : 0.08;
      case 'cataluna': return price > 1000000 ? 0.11 : 0.10;
      case 'ceuta': return 0.06;
      case 'madrid': return 0.06;
      case 'comunidad-valenciana': return price > 1000000 ? 0.11 : 0.10;
      case 'extremadura': return price <= 360000 ? 0.08 : 0.11;
      case 'galicia': return 0.08;
      case 'la-rioja': return 0.07;
      case 'melilla': return 0.06;
      case 'murcia': return 0.0775;
      case 'navarra': return 0.06;
      case 'pais-vasco': return 0.04;
      default: return 0.08;
    }
  }

  function drawChart(equity, principal, interest) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    const total = equity + principal + interest || 1;
    const eW = (equity / total) * w;
    const pW = (principal / total) * w;
    const iW = Math.max(0, w - eW - pW);
    const barHeight = Math.min(50, h * 0.6);
    const barY = (h - barHeight) / 2;
    const radius = 12; // radio de las esquinas redondeadas


    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, barY, w, barHeight, radius);
    ctx.clip();


    ctx.fillStyle = 'rgba(56, 161, 105, 0.89)';
    ctx.fillRect(0, barY, eW, barHeight);


    ctx.fillStyle = 'rgba(141, 37, 37, 1)';
    ctx.fillRect(eW, barY, pW, barHeight);


    ctx.fillStyle = 'rgba(229, 62, 62, 1)';
    ctx.fillRect(eW + pW, barY, iW, barHeight);

    ctx.restore();
  }


  function calculateAll() {
    const price = safeNumber(priceEl);
    const savings = safeNumber(savingsEl);
    const years = Math.max(1, Math.round(safeNumber(yearsEl)));
    const annualRate = safeNumber(rateEl);
    const extraUserTaxes = safeNumber(taxesEl);
    
    const province = provinceEl ? provinceEl.value : '';
    const tipoInmueble = tipoInmuebleEl ? tipoInmuebleEl.value : 'segunda-mano';
    const region = provinces[province] || 'general';

    let impuestoAplicado = 0;
    if (tipoInmueble === 'nuevo') {
      impuestoAplicado = price * 0.10;
    } else {
      impuestoAplicado = price * getITP(region, price);
    }

    const gastosFijos = calcularGastosFijos(price);
    const taxesAdjusted = impuestoAplicado + gastosFijos + extraUserTaxes;
    const totalPurchaseTaxes = taxesAdjusted;

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

    // Actualizar textos
    if (resMonthly) resMonthly.textContent = fmtEUR(monthlyPayment.toFixed(2));
    if (resFinanced) resFinanced.textContent = fmtEUR(financed.toFixed(2));
    if (resPercent) resPercent.textContent = financedPct.toFixed(2) + ' %';
    if (resInterest) resInterest.textContent = fmtEUR(totalInterest.toFixed(2));
    if (resPropertyCost) resPropertyCost.textContent = fmtEUR(costProperty.toFixed(2));
    if (resTotalOperation) resTotalOperation.textContent = fmtEUR(costOperation.toFixed(2));
    if (resPurchaseTaxes) resPurchaseTaxes.textContent = fmtEUR(totalPurchaseTaxes.toFixed(2));

    lastEquity = savings;
    lastPrincipal = financed;
    lastInterest = totalInterest;
    drawChart(lastEquity, lastPrincipal, lastInterest);

    return { monthlyPayment, financed, financedPct, totalInterest, costProperty, costOperation, tipoInmueble, region, totalPurchaseTaxes };
  }


  [priceEl, savingsEl, yearsEl, rateEl, taxesEl].forEach(inp => {
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


  [priceEl, savingsEl, yearsEl, rateEl, provinceEl, tipoInmuebleEl, taxesEl].forEach(i => {
    if (!i) return;
    i.addEventListener('input', calculateAll);
    i.addEventListener('change', calculateAll);
  });




  calculateAll();
});