document.addEventListener("DOMContentLoaded", function () {
  const addPhotoButton = document.getElementById("modal-edit-add");
  const modalGallery = document.getElementById("modal-works");
  const modalEdit = document.getElementById("modal-edit");
  const categorySelect = document.getElementById("form-category");
  const imageInput = document.getElementById("form-image");
  const previewContainer = document.getElementById("modal-edit-new-photo");
  const form = document.getElementById("modal-edit-work-form");

  // Vérifiez que les éléments existent avant d'ajouter des événements
  if (addPhotoButton && modalGallery && modalEdit) {
    addPhotoButton.addEventListener("click", function () {
      modalGallery.style.display = "none"; // Masque la galerie photo
      modalEdit.style.display = "block"; // Affiche la section pour ajouter une photo

      // Charger les catégories lors de l'ouverture du modal
      fetchCategories();
    });
  }

  // Gestion de la fermeture de la fenêtre d'ajout de photo et retour à la galerie
  const backButton = document.getElementById("arrow-return");
  if (backButton) {
    backButton.addEventListener("click", function () {
      closeEditModal(); // Appel à une fonction pour réinitialiser et fermer la modale
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

  // Gestion de la prévisualisation de l'image sélectionnée
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    const maxFileSize = 4 * 1024 * 1024; // Taille maximale du fichier : 4 Mo
    if (file.size > maxFileSize) {
      alert(
        "Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo."
      );
      imageInput.value = ""; // Réinitialiser l'input file
    } else if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgPreview = document.createElement("img");
        imgPreview.src = e.target.result;
        imgPreview.id = "form-image-preview";
        imgPreview.style.maxHeight = "169px"; // Ajustez la hauteur comme sur l'image
        imgPreview.style.width = "auto";
        imgPreview.style.display = "block";
        imgPreview.style.margin = "0 auto";

        // Supprimer l'ancienne prévisualisation, s'il y en a une
        const oldPreview = document.getElementById("form-image-preview");
        if (oldPreview) {
          oldPreview.remove();
        }

        // Ajouter l'image prévisualisée à la zone de prévisualisation
        previewContainer.innerHTML = ""; // Effacer les anciens contenus
        previewContainer.appendChild(imgPreview);

        // Cacher l'icône et le texte + Ajouter photo
        document.getElementById("photo-add-icon").style.display = "none";
        document.getElementById("new-image").style.display = "none";
        document.getElementById("photo-size").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Gestion de la soumission du formulaire
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("http://localhost:5678/api/works", {
      method: "POST", // Utilisez la méthode POST
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assurez-vous que le token est bien passé
      },
      body: formData, // Envoyez les données du formulaire
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'image");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.id && data.imageUrl && data.title) {
          // Ajouter la nouvelle image à la galerie
          const gallery = document.querySelector(".gallery");

          const figure = document.createElement("figure");
          figure.setAttribute("id", `work-item-${data.id}`);
          figure.classList.add(`category-id-${data.categoryId}`);

          const img = document.createElement("img");
          img.src = data.imageUrl;
          img.alt = data.title;

          const figcaption = document.createElement("figcaption");
          figcaption.textContent = data.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);

          // Ajouter l'image à la galerie
          gallery.appendChild(figure);

          // Réinitialiser et fermer la modale
          closeEditModal();
        } else {
          console.error("Les données reçues sont incorrectes :", data);
        }
      })
      .catch((error) => console.error("Erreur :", error));
  });

  // Fonction pour fermer la modale et réinitialiser le formulaire
  function closeEditModal() {
    modalEdit.style.display = "none";
    modalGallery.style.display = "block"; // Réaffiche la galerie photo

    // Réinitialiser le formulaire
    form.reset();
    const oldPreview = document.getElementById("form-image-preview");
    if (oldPreview) {
      oldPreview.remove();
    }

    // Réafficher les éléments cachés
    document.getElementById("photo-add-icon").style.display = "block";
    document.getElementById("new-image").style.display = "block";
    document.getElementById("photo-size").style.display = "block";
  }
});
