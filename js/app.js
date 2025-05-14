// Sélection des éléments
const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");
const dayAmount = document.getElementById("dayAmount");

const divLatitude = document.getElementById("div-latitude");
const divLongitude = document.getElementById("div-longitude");
const divCumul = document.getElementById("div-cumul");
const divVent = document.getElementById("div-vent");
const divDirection = document.getElementById("div-direction");

// Fonction pour effectuer la requête API des communes en utilisant le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    const data = await response.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Fonction pour afficher les communes dans la liste déroulante
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  // S'il y a au moins une commune retournée dans data
  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });
    communeSelect.style.display = "block";
    validationButton.style.display = "block";
  }
  else {
    // Supprimer un message précédent s’il existe déjà
    const existingMessage = document.getElementById("error-message");
    if (!existingMessage) {
      const message = document.createElement("p");
      message.id = "error-message";
      message.textContent = "Le code postal saisi n'est pas valide";
      message.classList.add('errorMessage');
      document.body.appendChild(message);
    }

    // Masquer les éléments inutiles
    communeSelect.style.display = "none";
    validationButton.style.display = "none";

    // Recharger la page après 3 secondes
    setTimeout(() => location.reload(), 3000);
  }
}
// Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
async function fetchMeteoByCommune(selectedCommune, day) {
  try {
    let data = [];
    for (let i = 0; i < day; i++) {
      const response = await fetch(
        `https://api.meteo-concept.com/api/forecast/daily/${i}?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}`
      );
      data.push(await response.json());
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Ajout de l'écouteur d'événement "input" sur le champ code postal
codePostalInput.addEventListener("input", async () => {
  const codePostal = codePostalInput.value;
  communeSelect.style.display = "none";
  validationButton.style.display = "none";

  if (/^\d{5}$/.test(codePostal)) {
    try {
      const data = await fetchCommunesByCodePostal(codePostal);
      displayCommunes(data);
      displayOptions();
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la recherche de la commune :",
        error
      );
      throw error;
    }
  }
});

// Ajout de l'écouteur d'événement "click" sur le bouton de validation
validationButton.addEventListener("click", async () => {
  const selectedCommune = communeSelect.value;
  if (selectedCommune) { // si selectedCommune n'est pas vide
    try {
      const data = await fetchMeteoByCommune(selectedCommune, dayAmount.value);
      createCard(data);
    } catch (error) {
      console.error("Erreur lors de la requête API meteoConcept:", error);
      throw error;
    }
  }
});

function displayOptions() {
  dayAmount.hidden = false;
  divLatitude.hidden = false;
  divLongitude.hidden = false;
  divCumul.hidden = false;
  divVent.hidden = false;
  divDirection.hidden = false;
}
