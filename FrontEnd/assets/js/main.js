document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const categoriesContainer = document.querySelector("#categories");

  // Fonction pour récupérer et afficher les projets
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

  // Fonction pour récupérer et afficher les catégories
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
  fetchAndDisplayProjects();
  fetchAndDisplayCategories();
});
