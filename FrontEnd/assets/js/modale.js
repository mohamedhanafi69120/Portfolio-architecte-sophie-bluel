document.addEventListener("DOMContentLoaded", function () {
  // Bouton pour passer à l'ajout d'une photo
  const addPhotoButton = document.getElementById("modal-edit-add");
  const modalGallery = document.getElementById("modal-works");
  const modalEdit = document.getElementById("modal-edit");
  const categorySelect = document.getElementById("form-category");

  // Vérifiez que les éléments existent avant d'ajouter des événements
  if (addPhotoButton && modalGallery && modalEdit) {
    addPhotoButton.addEventListener("click", function () {
      modalGallery.style.display = "none"; // Masque la galerie photo
      modalEdit.style.display = "block"; // Affiche la section pour ajouter une photo

      // Charger les catégories lors de l'ouverture du modal
      fetchCategories();
    });
  }

  // Autres scripts pour fermer la fenêtre d'ajout de photo et revenir à la galerie
  const backButton = document.getElementById("arrow-return");

  if (backButton) {
    backButton.addEventListener("click", function () {
      modalEdit.style.display = "none"; // Masque la section d'ajout de photo
      modalGallery.style.display = "block"; // Réaffiche la galerie photo
    });
  }

  // Fonction pour récupérer et afficher les catégories dans le menu déroulant
  function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        // Vider les options existantes
        categorySelect.innerHTML = '<option value=""></option>';

        // Ajouter chaque catégorie comme option
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des catégories :", error)
      );
  }
});
