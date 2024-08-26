document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login__form");

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
          alert("Erreur dans l’identifiant ou le mot de passe");
        }
      });
  });
});
