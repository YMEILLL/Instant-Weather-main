function createCard(data) {
  document.getElementById("validationButton").hidden = true;
  
  let weatherSection = document.getElementById("weatherInformation");
  let requestSection = document.getElementById("cityForm");

  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  const cumul = document.getElementById("cumul");
  const vent = document.getElementById("vent");
  const direction = document.getElementById("direction");

  // Ajout du graphique des températures si plusieurs jours
  if(data.length > 1) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'w-100 my-3';
    const chartCanvas = createTemperatureChart(data);
    chartContainer.appendChild(chartCanvas);
    weatherSection.appendChild(chartContainer);
  }

  data.forEach(element => {
    let dict = [
      {
        "label": "Température minimale",
        "value": `${element.forecast.tmin}°C`
      },
      {
        "label": "Température maximale",
        "value": `${element.forecast.tmax}°C`
      },
      {
        "label": "Probabilité de pluie",
        "value": `${element.forecast.probarain}%`
      },
      {
        "label": "Ensoleillement journalier",
        "value": `${displayHours(element.forecast.sun_hours)}`
      }
    ];

    if(latitude.checked) {
      dict.push({
        "label": "Latitude",
        "value": `${element.city.latitude}%`
      });
    }
    if(longitude.checked) {
      dict.push({
        "label": "Longitude",
        "value": `${element.city.longitude}%`
      });
    }
    if(cumul.checked) {
      dict.push({
        "label": "Cumul de pluie sur la journée (mm)",
        "value": `${element.forecast.rr10}%`
      });
    }
    if(vent.checked) {
      dict.push({
        "label": "Vent moyen à 10m (km/h)",
        "value": `${element.forecast.wind10m}%`
      });
    }
    if(direction.checked) {
      dict.push({
        "label": "Direction du vent en degrés (0 à 360°)",
        "value": `${element.forecast.dirwind10m}%`
      });
    }

    let bloc = document.createElement("div");
    let content = document.createElement("div");
    content.className = "d-flex flex-wrap justify-content-evenly";
    bloc.className = "d-flex flex-column w-100 position-relative";

    // Icônes météo détaillées
    let weatherIcon;
    if (element.forecast.probarain >= 70) {
      weatherIcon = 'fa-cloud-showers-heavy';
    } else if (element.forecast.probarain >= 50) {
      weatherIcon = 'fa-cloud-rain';
    } else if (element.forecast.cloudcover >= 70) {
      weatherIcon = 'fa-cloud';
    } else if (element.forecast.sun_hours > 5) {
      weatherIcon = 'fa-sun';
    } else {
      weatherIcon = 'fa-cloud-sun';
    }
    bloc.innerHTML = `<i class="position-absolute fs-3 ms-3 mt-3 start-0 top-0 fa-solid ${weatherIcon}"></i>`;

    let title = document.createElement("h1");
    title.className = "text-center";
    const d = new Date(element.forecast.datetime);
    title.innerHTML = `<p class="m-0">${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}</p>`;

    bloc.appendChild(title);
    dict.forEach(elt => {
      let div = document.createElement("div");
      div.className = "text-center";
      div.innerHTML = `<p class="m-0">${elt.label}</br>${elt.value}</p>`;
      content.appendChild(div);
    });
    bloc.appendChild(content);
    weatherSection.appendChild(bloc);
  });

  let reloadButton = document.createElement("div");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.className = "btn btn-primary px-3 my-3 reloadButton position-relative start-50 translate-middle-x";
  document.body.appendChild(reloadButton);
  
  reloadButton.addEventListener("click", function () {
    location.reload();
  });

  requestSection.style.display = "none";
  weatherSection.style.display = "flex";
}

function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}

// Fonction pour créer le graphique des températures
function createTemperatureChart(data) {
  const ctx = document.createElement('canvas');
  ctx.id = 'temperatureChart';
  ctx.style.backgroundColor = 'white';
  ctx.style.borderRadius = '8px';
  ctx.style.padding = '10px';
  
  const dates = data.map(d => new Date(d.forecast.datetime).toLocaleDateString());
  const tmax = data.map(d => d.forecast.tmax);
  const tmin = data.map(d => d.forecast.tmin);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Température max (°C)',
        data: tmax,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      }, {
        label: 'Température min (°C)',
        data: tmin,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Prévisions de températures'
        }
      }
    }
  });
  
  return ctx;
}