document.addEventListener('DOMContentLoaded', () => {

  
  const fieldDefinitions = [
    {
      id: 'numb1',
      label: 'Precio de la propiedad',
      type: 'number',
      value: 200000,
      step: 1000,
      min: 0,
      unit: '€',
      inputClass: 'numb'
    },
    {
      id: 'numb2',
      label: 'Ahorros aportados (entrada)',
      type: 'number',
      value: 70000,
      step: 1000,
      min: 0,
      unit: '€',
      inputClass: 'numb'
    },
    {
      id: 'numb3',
      label: 'Plazo en años',
      type: 'number',
      value: 30,
      step: 1,
      min: 0,
      unit: 'años',
      inputClass: 'numb'
    },
    {
      id: 'interestRate',
      label: 'Tipo de interés',
      type: 'number',
      value: 2.15,
      step: 0.05,
      min: 0,
      unit: '%',
      inputClass: 'numb'
    }
  ];

  
  const inmuebleOptions = [
    { value: 'segunda-mano', text: 'Segunda mano' },
    { value: 'nuevo', text: 'Nuevo (obra nueva)' }
  ];

  
  const provinceList = [
    "Albacete", "Alicante / Alacant", "Almería", "Araba/Álava", "Asturias",
    "Ávila", "Badajoz", "Balears, Illes", "Barcelona", "Bizkaia / Vizcaya",
    "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón/Castelló",
    "Ceuta", "Ciudad Real", "Córdoba", "Coruña, A", "Cuenca",
    "Gipuzkoa / Guipúzcoa", "Girona", "Granada", "Guadalajara", "Huelva",
    "Huesca", "Jaén", "León", "Lleida / Lérida", "Lugo", "Madrid",
    "Málaga", "Melilla", "Murcia", "Navarra", "Ourense / orense",
    "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca",
    "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona",
    "Teruel", "Toledo", "Valencia/València", "Valladolid", "Zamora", "Zaragoza"
  ];

  
  const resultDefinitions = [
    { id: 'resMonthly', label: 'CUOTA MENSUAL ESTIMADA', fullWidth: true, highlighted: true, labelId: 'result-label-1' },
    { id: 'resFinanced', label: 'CAPITAL FINANCIADO' },
    { id: 'resPercent', label: 'PORCENTAJE FINANCIADO' },
    { id: 'resInterest', label: 'INTERESES TOTALES' },
    { id: 'resPropertyCost', label: 'COSTE TOTAL PROPIEDAD' },
    { id: 'resTotalOperation', label: 'COSTE TOTAL OPERACIÓN' },
    { id: 'resPurchaseTaxes', label: 'IMPUESTOS Y GASTOS DE COMPRA' }
  ];

  
  const formContainer = document.getElementById('formContainer');
  if (formContainer) {
    
    fieldDefinitions.forEach(field => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <label class="ColorLabel" for="${field.id}">${field.label}</label>
        <div class="input">
          <input class="${field.inputClass}" id="${field.id}" type="${field.type}" value="${field.value}" step="${field.step}" min="${field.min}" required>
          <span class="valor">${field.unit}</span>
        </div>
      `;
      formContainer.appendChild(wrapper);
    });

  
    const inmuebleLabel = document.createElement('label');
    inmuebleLabel.className = 'ColorLabel';
    inmuebleLabel.setAttribute('for', 'tipoInmueble');
    inmuebleLabel.textContent = 'Tipo de inmueble';
    formContainer.appendChild(inmuebleLabel);

    const inmuebleWrapper = document.createElement('div');
    inmuebleWrapper.className = 'input';
    const inmuebleSelect = document.createElement('select');
    inmuebleSelect.id = 'tipoInmueble';
    inmuebleOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      if (opt.value === 'segunda-mano') option.selected = true;
      inmuebleSelect.appendChild(option);
    });
    inmuebleWrapper.appendChild(inmuebleSelect);
    formContainer.appendChild(inmuebleWrapper);

  
    const provinceLabel = document.createElement('label');
    provinceLabel.className = 'ColorLabel';
    provinceLabel.setAttribute('for', 'region');
    provinceLabel.textContent = 'Localización del inmueble';
    formContainer.appendChild(provinceLabel);

    const provinceWrapper = document.createElement('div');
    provinceWrapper.className = 'input';
    const provinceSelect = document.createElement('select');
    provinceSelect.id = 'region';
    provinceList.forEach(province => {
      const option = document.createElement('option');
      option.value = province;
      option.textContent = province;
      if (province === 'Valencia/València') option.selected = true;
      provinceSelect.appendChild(option);
    });
    provinceWrapper.appendChild(provinceSelect);
    formContainer.appendChild(provinceWrapper);
  }

  
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
  
    const grid = document.createElement('div');
    grid.className = 'results-grid';

    resultDefinitions.forEach(def => {
      const block = document.createElement('div');
      block.className = 'result-block';
      if (def.fullWidth) block.classList.add('full-width');
      if (def.highlighted) block.classList.add('highlighted');

      const labelSpan = document.createElement('span');
      labelSpan.className = 'result-label';
      if (def.labelId) labelSpan.id = def.labelId;
      labelSpan.textContent = def.label;

      const valueSpan = document.createElement('span');
      valueSpan.className = 'result-value';
      valueSpan.id = def.id;
      valueSpan.textContent = '-';

      block.appendChild(labelSpan);
      block.appendChild(valueSpan);
      grid.appendChild(block);
    });

    resultsContainer.appendChild(grid);
  }

  
  const $ = id => document.getElementById(id);

  
  const priceEl = $('numb1');
  const savingsEl = $('numb2');
  const yearsEl = $('numb3');
  const rateEl = $('interestRate');
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
    let num = Number(v);
    if (isNaN(num)) num = 0;
    let [entero, decimal] = num.toFixed(2).split('.');
    entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    decimal = decimal || '00';
    return `${entero}, ${decimal} €`;
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
    const radius = 12;

    ctx.save();
    ctx.beginPath();
    
    if (ctx.roundRect) {
      ctx.roundRect(0, barY, w, barHeight, radius);
    } else {
    
      ctx.rect(0, barY, w, barHeight);
    }
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
    const taxesAdjusted = impuestoAplicado + gastosFijos; 
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

    if (resMonthly) resMonthly.textContent = fmtEUR(monthlyPayment.toFixed(2));
    if (resFinanced) resFinanced.textContent = fmtEUR(financed.toFixed(2));
    if (resPercent) resPercent.textContent = financedPct.toFixed(2).replace('.', ',') + ' %';
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

  
  const inputsToWatch = [priceEl, savingsEl, yearsEl, rateEl, provinceEl, tipoInmuebleEl].filter(el => el);
  inputsToWatch.forEach(el => {
    el.addEventListener('input', calculateAll);
    el.addEventListener('change', calculateAll);
  });

  window.addEventListener('resize', () => {
    if (lastEquity !== undefined) drawChart(lastEquity, lastPrincipal, lastInterest);
  });

  
  if (solicitarBtn) {
    solicitarBtn.addEventListener('click', async () => {
      const nombre = window.prompt('Nombre completo:');
      if (!nombre) { alert('Nombre requerido.'); return; }
      const email = window.prompt('Correo electrónico:');
      if (!email) { alert('Correo requerido.'); return; }
      const telefono = window.prompt('Teléfono:');
      if (!telefono) { alert('Teléfono requerido.'); return; }

      const results = calculateAll();
      const payload = {
        nombre, email, telefono,
        precio_propiedad: safeNumber(priceEl),
        ahorros_aportados: safeNumber(savingsEl),
        plazo_anos: Math.max(1, Math.round(safeNumber(yearsEl))),
        tasa_interes: safeNumber(rateEl),
        provincia: provinceEl ? provinceEl.value : '',
        id_cliente: String(Date.now()),
        resumen_calculo: {
          coste_propiedad: results.costProperty,
          financiado: results.financed,
          cuota_mensual: results.monthlyPayment,
          intereses_totales: results.totalInterest,
          tipo_inmueble: results.tipoInmueble,
          region: results.region,
          impuestos_gastos_compra: results.totalPurchaseTaxes
        }
      };

      try {
   
        const resp = await fetch('src-api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('Error en el servidor');
        await resp.json();
        alert('Solicitud enviada correctamente.');
      } catch (err) {
        console.error(err);
        alert('No se pudo enviar la solicitud');
      }
    });
  }

  
  calculateAll();
});