document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector("#nav-login"); // Lien pour "login" ou "logout"
  const gallery = document.querySelector(".gallery");
  const categoriesContainer = document.querySelector("#categories");

  // Vérifier si le token est présent dans le localStorage
  const token = localStorage.getItem("authToken");

  // Gestion de l'affichage du lien en fonction de la page
  if (loginLink) {
    if (window.location.pathname.endsWith("index.html")) {
      // Page d'accueil : afficher "logout" si connecté, sinon "login"
      if (token) {
        loginLink.textContent = "logout";
        loginLink.href = "#"; // Désactiver le lien par défaut
        loginLink.addEventListener("click", function () {
          localStorage.removeItem("authToken"); // Supprimer le token
          window.location.href = "login.html"; // Rediriger vers la page de connexion
        });
      } else {
        loginLink.textContent = "login";
        loginLink.href = "login.html";
      }
    } else if (window.location.pathname.endsWith("login.html")) {
      // Page de connexion : afficher "login" même après la connexion
      loginLink.textContent = "login";
      loginLink.href = "login.html";
    }
  }

  ///**************Récupération des traveaux************///
  ///*****Fonction pour récupérer et afficher les projets****///

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

  ///********Récupération des catégories**********///
  ///*****Fonction pour récupérer et afficher les catégories******///

  function fetchAndDisplayCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((categories) => {
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

        // populateCategories(categories);///
      })
      .catch((error) => console.error("Error:", error));
  }

  // Initial fetch pour afficher tous les projets et les catégories
  if (gallery && categoriesContainer) {
    fetchAndDisplayProjects();
    fetchAndDisplayCategories();
  }
});

//******affichage des éléments en mode édition******//

function EditMode() {
  const token = localStorage.getItem("authToken");
  const categories = document.querySelector("#categories");
  const topbar = document.querySelector(".topbar");
  const modifier = document.querySelector(".btnmodal");

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
