/*********rappel de function pour afficher les projets dans la gallery */

function fetchAndDisplayProjects(filterCategory = null) {
  fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      gallery.innerHTML = ""; // Clear existing content

      data.forEach((work) => {
        if (!filterCategory || work.categoryId === filterCategory) {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          img.src = work.imageUrl;
          img.alt = work.title;

          const figcaption = document.createElement("figcaption");
          figcaption.textContent = work.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}

/****étapes N° 1 - Gestion de la première modale (apparition/disparition)***/
const modalContainer = document.querySelector(".modal_container");
modalContainer.style.display = "none";
//***bouton "Modifier" *****//
const modifierBtn = document.querySelector(".btnmodal");
/*récupération du container du modal***/
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
//  bouton de fermeture
const closeBtn = document.querySelector(".fa-xmark");
/*********overlay***********/
const overlay = document.querySelector(".overlay");

/****récupération du bouton d'appel a la seconde modal2****/
const modal1btn = document.querySelector(".modal1-btn");

// bouton "Modifier"
modifierBtn.addEventListener("click", () => {
  modalContainer.style.display = "flex";
  overlay.style.display = "flex";
  modal1.style.display = "flex";
  generateModalGallery();
});
/*******bouton ajout photo*******/
modal1btn.addEventListener("click", () => {
  modal1.style.display = "none";
  modal2.style.display = "flex";
});

//  bouton de fermeture
closeBtn.addEventListener("click", function () {
  modal1.style.display = "none";
  modalContainer.style.display = "none";
});
//  fermeture au click sur overlay***/
overlay.addEventListener("click", function () {
  modal1.style.display = "none";
  modal2.style.display = "none";
});

// *** Gestion de la fermeture de la deuxième modale avec la croix ***
const closeBtnModal2 = document.querySelector(".modal2 .fa-xmark");

closeBtnModal2.addEventListener("click", function () {
  modal2.style.display = "none";
  modalContainer.style.display = "none";
  overlay.style.display = "none";
});

// *** Gestion du retour à la première modale avec la flèche ***
const backBtnModal2 = document.querySelector(".modal2 .fa-arrow-left");

backBtnModal2.addEventListener("click", function () {
  modal2.style.display = "none";
  modal1.style.display = "flex";
});

//****étapes N°-2 **Génération de la galerie dans la première modale de suppression ****//

//****Fonction pour générer la galerie à l'intérieur de la première modale************//

async function generateModalGallery() {
  try {
    const response = await fetch("http://localhost:5678/api/works/");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }
    const works = await response.json();

    const modal1_photo = document.querySelector(".modal1_photo");
    modal1_photo.innerHTML = "";

    works.forEach((work) => {
      const figure = document.createElement("figure");
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.classList.add("modal1-vignette");

      const iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add(
        "delete-icon",
        "fa-solid",
        "fa-trash-can",
        "delete-icon-modal1"
      );

      deleteIcon.addEventListener("click", function () {
        let workId = work.id;
        deleteWork(workId, true);
      });

      iconContainer.appendChild(deleteIcon);
      imageContainer.appendChild(iconContainer);
      imageContainer.appendChild(img);

      figure.appendChild(imageContainer);
      modal1_photo.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la galerie :", error);
  }
}

/***étapes N°-3 *********Suppression des travaux existants *****/

// Fonction pour supprimer un travail avec l'ID

function deleteWork(workId, updateGallery) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Vous devez être connecté pour effectuer cette action.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          alert("Non autorisé. Veuillez vous reconnecter.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(() => {
      const modalWorkFigure = document.querySelector(
        `figure[data-work-id="${workId}"]`
      );

      if (modalWorkFigure) {
        modalWorkFigure.remove();
      }
      if (updateGallery) {
        generateModalGallery();
      }
    })
    .catch((error) =>
      console.error("Erreur lors de la suppression du travail :", error)
    );
}

//------Prévisualisation du projet en cours d'ajout -------------------------------------------
function ajouPhotos(event) {
  const modal2img = document.querySelector(".modal2img");
  const faImage = document.querySelector(".fa-image");
  const modal2imagelabel = document.querySelector(".modal2imagelabel");
  const modal2_text = document.querySelector(".modal2_text");

  if (event.target.files && event.target.files[0]) {
    // Utilisation de l'objet FileReader pour lire le fichier
    const reader = new FileReader();

    // Déclenchement de l'événement après la lecture complète
    reader.onload = function (e) {
      // Changement de l'URL de l'image dans l'aperçu
      modal2img.src = e.target.result;
      // Centrage de l'affichage de l'image
      modal2img.style.display = "block";
      modal2img.style.margin = "auto";
      // Masquage des éléments inutiles
      faImage.style.display = "none";
      modal2imagelabel.style.display = "none";
      modal2_text.style.display = "none";
    };
    // Lecture du fichier sélectionné
    reader.readAsDataURL(event.target.files[0]);
  }
}

// Associer la fonction `ajouPhotos` à l'événement change sur l'input file
document.querySelector("#uploadfile").addEventListener("change", ajouPhotos);

// Fonction pour récupérer les catégories et les ajouter dans la liste déroulante
function selectCategories() {
  const URL = "http://localhost:5678/api/categories";
  fetch(URL)
    .then((resp) => resp.json())
    .then((categories) => {
      const select = document.querySelector("#categories-select");
      // Création d'une option par catégorie
      categories.forEach((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.text = categorie.name;
        select.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des catégories:", error)
    );
}
selectCategories();

// Fonction pour ajouter un projet
function ajoutProjet(event) {
  event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

  const token = localStorage.getItem("authToken");

  const title = document.querySelector("#title").value;
  const category = document.querySelector("#categories-select").value;
  const fileInput = document.querySelector(".uploadfile");
  const file = fileInput.files[0]; // Correction pour récupérer le fichier sélectionné

  // Création du formulaire pour envoyer les données à l'API
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category); // Correction: changer "select" en "category"
  formData.append("image", file); // Correction pour ajouter le fichier

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || `Erreur HTTP: ${response.status}`);
        });
      }
    })
    .then((data) => {
      alert("Projet ajouté avec succès", data);
      generateModalGallery();
      fetchAndDisplayProjects();
    })
    .catch((error) => {
      alert(`Échec de l'ajout du projet: ${error.message}`);
    });
}

// Associer la fonction `ajoutProjet` à l'événement submit du formulaire
document.querySelector(".modal2 form").addEventListener("submit", ajoutProjet);

// Fonction qui vérifie si les éléments sont définis et change la couleur en fonction des conditions
function changeColor() {
  const submit = document.querySelector("#modal2_submit");
  const title = document.querySelector("#title");
  const fileInput = document.querySelector(".uploadfile");

  // Réinitialisation de la couleur à chaque appel de la fonction
  submit.style.backgroundColor = "#b3b3b3";

  // Vérification de la définition des éléments et condition pour changer la couleur
  if (
    title.value !== "" &&
    (fileInput.files.length > 0 || fileInput.value !== "")
  ) {
    submit.style.backgroundColor = "#1d6154";
  } else {
    submit.style.backgroundColor = "#b3b3b3";
  }
}

// Ajouter les événements sur le titre et l'input file pour changer la couleur du bouton
document.querySelector("#title").addEventListener("input", changeColor);
document.querySelector("#uploadfile").addEventListener("change", changeColor);

changeColor(); // Appeler la fonction une première fois pour initialiser la couleur
