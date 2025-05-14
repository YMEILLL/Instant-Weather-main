function createCard(data) {
  // Désactiver le bouton de validation pour éviter les duplications
  document.getElementById("validationButton").hidden = true;
  
  // Sélectionner les sections
  let weatherSection = document.getElementById("weatherInformation");
  let requestSection = document.getElementById("cityForm");

  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  const cumul = document.getElementById("cumul");
  const vent = document.getElementById("vent");
  const direction = document.getElementById("direction");

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

    // console.log(element);
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

    if (element.forecast.probarain >= 50) {
      bloc.innerHTML = `<i class="position-absolute fs-3 ms-3 mt-3 start-0 top-0 fa-solid fa-cloud-rain"></i>`;
    } else if (element.forecast.probarain >= 20) {
      bloc.innerHTML = `<i class="position-absolute fs-3 ms-3 mt-3 start-0 top-0 fa-solid fa-cloud"></i>`;
    } else {
      bloc.innerHTML = `<i class="position-absolute fs-3 ms-3 mt-3 start-0 top-0 fa-solid fa-sun"></i>`;
    }

    let title = document.createElement("h1");
    title.className = "text-center";
    const d = new Date(element.forecast.datetime);
    title.innerHTML = `<p class="m-0">${d.getDate()}/${d.getMonth()}/${d.getFullYear()}</p>`;

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

  // Ajouter un bouton de retour vers le formulaire
  let reloadButton = document.createElement("div");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.className = "btn btn-primary px-3 my-3 reloadButton position-relative start-50 translate-middle-x";
  document.body.appendChild(reloadButton);
  // Ajouter un listener sur le bouton
  reloadButton.addEventListener("click", function () {
    location.reload();
  });

  // Gérer la visibilité des sections
  requestSection.style.display = "none";
  weatherSection.style.display = "flex";
}

function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}
