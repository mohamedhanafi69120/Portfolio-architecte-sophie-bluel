document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login__form");
  const loginLink = document.querySelector("#nav-login"); // Lien pour "login" ou "logout"

  // Vérifier si le token est présent dans le localStorage
  const token = localStorage.getItem("authToken");

  // Gestion de l'affichage du lien en fonction de la page
  if (loginLink) {
    if (token) {
      // Si un token est présent, afficher "logout"
      loginLink.textContent = "logout";
      loginLink.href = "#"; // Désactiver le lien par défaut

      // Ajouter un événement pour la déconnexion
      loginLink.addEventListener("click", function () {
        localStorage.removeItem("authToken"); // Supprimer le token
        window.location.href = "login.html"; // Rediriger vers la page de connexion
      });
    } else {
      // Si pas de token, afficher "login"
      loginLink.textContent = "login";
      loginLink.href = "login.html";
    }
  }

  // Gestion du formulaire de connexion
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("authToken", data.token); // Stocker le token dans le localStorage
          window.location.href = "index.html"; // Rediriger vers la page d’accueil après la connexion
        })
        .catch((error) => {
          const errorMessage = document.querySelector(".loginEmail__error");
          if (errorMessage) {
            errorMessage.textContent = error.message; // Afficher l'erreur sous le champ email
          }
        });
    });
  }
});
