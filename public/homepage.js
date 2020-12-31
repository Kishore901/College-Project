const translate = document.querySelectorAll(".translate");
const big_title = document.querySelectorAll(".big-title");
const header = document.querySelector(".intro");
let header_height = header.offsetHeight;
// console.log(header_height);

window.addEventListener("scroll", () => {
  let scroll = window.pageYOffset;

  translate.forEach((element) => {
    let speed = element.dataset.speed;
    element.style.transform = `translateY(${scroll * speed}px)`;
  });
  big_title.style.opacity = -scroll / (header_height / 2) + 1;
});
