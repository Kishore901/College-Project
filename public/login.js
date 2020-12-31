const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const conatiner = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  conatiner.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  conatiner.classList.remove("sign-up-mode");
});
