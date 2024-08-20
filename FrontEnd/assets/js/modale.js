// /****étapes N° 1 - Gestion de la première modale (apparition/disparition)***/

// //***bouton "Modifier" *****//
// const modifierBtn = document.querySelector(".btnmodal");
// /*récupération du container du modal***/
// const modal1 = document.querySelector(".modal1");
// const modal2 = document.querySelector(".modal2");
// //  bouton de fermeture
// const closeBtn = document.querySelector(".fa-xmark");
// /*********overlay***********/
// const overlay = document.querySelector(".overlay");

// /****récupération du bouton d'appel a la seconde modal2****/
// const modal1btn = document.querySelector(".modal1-btn");

// // bouton "Modifier"
// modifierBtn.addEventListener("click", () => {
//   modal1.style.visibility = "visible";
//   overlay.style.display = "flex";
//   generateModalGallery();
// });
// /*******bouton ajout photo*******/
// modal1btn.addEventListener("click", () => {
//   modal2.style.display = "flex";
// });

// //  bouton de fermeture
// closeBtn.addEventListener("click", function () {
//   modal1.style.display = "none";
// });
// //  fermeture au click sur overlay***/
// overlay.addEventListener("click", function () {
//   modal1.style.display = "none";
// });

// //****étapes N°-2 **Génération de la galerie dans la première modale****//

// // Fonction pour générer la galerie à l'intérieur de la première modale

// async function generateModalGallery() {
//   try {
//     const response = await fetch("http://localhost:5678/api/works/");
//     if (!response.ok) {
//       throw new Error("Erreur lors de la récupération des travaux");
//     }
//     const works = await response.json();

//     const modal1_photo = document.querySelector(".modal1_photo");
//     modal1_photo.innerHTML = "";

//     works.forEach((work) => {
//       const figure = document.createElement("figure");
//       const imageContainer = document.createElement("div");
//       imageContainer.classList.add("image-container");

//       const img = document.createElement("img");
//       img.src = work.imageUrl;
//       img.classList.add("modal1-vignette");

//       const iconContainer = document.createElement("div");
//       iconContainer.classList.add("icon-container");

//       const deleteIcon = document.createElement("i");
//       deleteIcon.classList.add(
//         "delete-icon",
//         "fa-solid",
//         "fa-trash-can",
//         "delete-icon-modal1"
//       );

//       deleteIcon.addEventListener("click", function () {
//         let workId = work.id;
//         deleteWork(workId, true);
//       });

//       iconContainer.appendChild(deleteIcon);
//       imageContainer.appendChild(iconContainer);
//       imageContainer.appendChild(img);

//       figure.appendChild(imageContainer);
//       modal1_photo.appendChild(figure);
//     });

//     updateHomePage();
//   } catch (error) {
//     console.error("Erreur lors de la génération de la galerie :", error);
//   }
// }

// //***étapes N°-3 *********Suppression des travaux existants *****//

// // Fonction pour supprimer un travail avec l'ID

// function deleteWork(workId, updateGallery) {
//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     alert("Vous devez être connecté pour effectuer cette action.");
//     return;
//   }

//   fetch(`http://localhost:5678/api/works/${workId}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         if (response.status === 401) {
//           alert("Non autorisé. Veuillez vous reconnecter.");
//         }
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.text();
//     })
//     .then(() => {
//       const modalWorkFigure = document.querySelector(
//         `figure[data-work-id="${workId}"]`
//       );

//       if (modalWorkFigure) {
//         modalWorkFigure.remove();
//       }
//       if (updateGallery) {
//         generateModalGallery();
//       }
//     })
//     .catch((error) =>
//       console.error("Erreur lors de la suppression du travail :", error)
//     );
// }

//*****************new code *****************//

/****-1- Gestion de la première modale (apparition/disparition)***/

//***bouton "Modifier" *****//
const modifierBtn = document.querySelector(".btnmodal");
/*récupération du container du modal***/
const container = document.querySelector(".modal_container");

//  bouton de fermeture
const closeBtn = document.querySelector(".fa-xmark");

// bouton "Modifier"
modifierBtn.addEventListener("click", function () {
  container.style.display = "flex";
  generateModalGallery();
});

//  bouton de fermeture
closeBtn.addEventListener("click", function () {
  container.style.display = "none";
});

//****-2-**Génération de la galerie dans la première modale *//
// Fonction pour générer la galerie à l'intérieur de la première modale

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

    updateHomePage();
  } catch (error) {
    console.error("Erreur lors de la génération de la galerie :", error);
  }
}

//***-3-*********Suppression des travaux existants *****//

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
