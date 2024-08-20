document.addEventListener("DOMContentLoaded", function () {
  // const loginLink = document.querySelector("#nav-login"); // Lien pour "login" ou "logout"
  const gallery = document.querySelector(".gallery");
  const categoriesContainer = document.querySelector("#categories");

  // Vérifier si le token est présent dans le localStorage
  const token = localStorage.getItem("authToken");

  //****Fonction pour récupérer et afficher les projets****//

  function fetchAndDisplayProjects(filterCategory = null) {
    fetch("http://localhost:5678/api/works")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("data:", data);
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

  //********//Fonction pour récupérer et afficher les catégories//******//
  function fetchAndDisplayCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((categories) => {
        console.log("les categories:", categories);
        // Ajouter le bouton "Tous" pour afficher tous les projets
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.addEventListener("click", () => fetchAndDisplayProjects());
        categoriesContainer.appendChild(allButton);

        // Ajouter des boutons pour chaque catégorie
        categories.forEach((category) => {
          const button = document.createElement("button");
          button.textContent = category.name;
          button.addEventListener("click", () =>
            fetchAndDisplayProjects(category.id)
          );
          categoriesContainer.appendChild(button);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  // Initial fetch pour afficher tous les projets et les catégories
  if (gallery && categoriesContainer) {
    fetchAndDisplayProjects();
    fetchAndDisplayCategories();
  }
});
/******affichage des élements en mode edition******/
function EditMode() {
  const token = localStorage.getItem("authToken");
  const categories = document.querySelector("#categories");
  const topbar = document.querySelector(".topbar");
  const modifier = document.querySelector(".btnmodal");

  console.log(categories);
  console.log("verfitoken:", token);

  if (token) {
    categories.style.display = "none";
    topbar.style.display = "flex";
    modifier.style.display = "flex";
  } else {
    categories.style.display = "block";
    topbar.style.display = "none";
    modifier.style.display = "none";
  }
}
EditMode();

document.addEventListener("DOMContentLoaded", function () {
  // Code pour ouvrir le modal
  const openModalButton = document.querySelector(".btnmodal");
  const modal = document.getElementById("modal");
  const modalCloseButtons = document.querySelectorAll(
    ".modal-close, #arrow-return"
  );

  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      modal.style.display = "flex";
      document.getElementById("modal-works").style.display = "block";
    });
  }

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      modal.style.display = "none";
    });
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Nouveau code pour gérer le bouton "Ajouter une photo"
  const addPhotoButton = document.getElementById("modal-edit-add");
  const modalGallery = document.getElementById("modal-works");
  const modalEdit = document.getElementById("modal-edit");

  if (addPhotoButton && modalGallery && modalEdit) {
    addPhotoButton.addEventListener("click", function () {
      modalGallery.style.display = "none"; // Masque la galerie photo
      modalEdit.style.display = "block"; // Affiche la section pour ajouter une photo
    });
  }
});
