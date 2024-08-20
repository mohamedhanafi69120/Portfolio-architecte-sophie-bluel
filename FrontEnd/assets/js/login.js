document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login__form");
  const loginLink = document.querySelector("#nav-login"); // Lien pour "login" ou "logout"

  // // Gestion de l'affichage du lien en fonction de la page
  // if (loginLink) {
  //   if (window.location.pathname.endsWith("index.html")) {
  //     // Page d'accueil : afficher "logout" si connecté, sinon "login"
  //     if (token) {
  //       loginLink.textContent = "logout";
  //       loginLink.href = "#"; // Désactiver le lien par défaut
  //       loginLink.addEventListener("click", function () {
  //         localStorage.removeItem("authToken"); // Supprimer le token
  //         window.location.href = "login.html"; // Rediriger vers la page de connexion
  //       });
  //     } else {
  //       loginLink.textContent = "logout";
  //       loginLink.href = "logout.html";
  //     }
  //   } else if (window.location.pathname.endsWith("login.html")) {
  //     // Page de connexion : afficher "login" même après la connexion
  //     loginLink.textContent = "login";
  //     loginLink.href = "login.html";
  //   }

  // Sélectionner le lien de connexion/déconnexion

  // Récupérer le token d'authentification depuis le localStorage
  const validtoken = localStorage.getItem("authToken");

  // Fonction pour mettre à jour le lien de connexion/déconnexion
  function updateLoginLink() {
    // Récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem("authToken");

    // Si un token valide est trouvé (l'utilisateur est connecté)
    if (token) {
      loginLink.textContent = "Logout";
      loginLink.href = "#"; // Désactiver le lien par défaut

      // Supprimer tout écouteur d'événement précédent
      loginLink.removeEventListener("click", handleLogout);

      // Ajouter un écouteur d'événement pour gérer la déconnexion
      loginLink.addEventListener("click", handleLogout);
    } else {
      // Si l'utilisateur n'est pas connecté
      loginLink.textContent = "Login";
      loginLink.href = "login.html";

      // Supprimer tout écouteur d'événement associé au logout
      loginLink.removeEventListener("click", handleLogout);
    }
  }

  // Fonction de gestion de la déconnexion
  function handleLogout(e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    localStorage.removeItem("authToken"); // Supprime le token
    window.location.href = "login.html"; // Redirige vers la page de connexion
  }

  // Appeler la fonction pour mettre à jour le lien en fonction de l'état de connexion
  updateLoginLink();

  // Appeler la fonction pour mettre à jour le lien en fonction de l'état de connexion
  updateLoginLink();

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
            alert("Erreur dans l’identifiant ou le mot de passe"); // Afficher une alerte si l'élément n'existe pas
          }
        });
    });
  }
});
