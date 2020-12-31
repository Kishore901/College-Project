// For goals page
const logout = document.querySelector(".logout-a");
window.addEventListener("load", () => {
  let progressBar = document.querySelectorAll(".progress-bar");
  let bar1 = document.querySelector(".G1");
  let bar2 = document.querySelector(".G2");
  let bar3 = document.querySelector(".G3");
  console.log(bar1);
  console.log(bar2);
  console.log(bar3);
  let url = `http://localhost:3000`;
  fetch(`${url}/goalbars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      console.log("Goal has been fetched");
      return data.json();
    })
    .then((goal) => {
      console.log(goal);
      if (goal.goalId > 0) {
        console.log(goal.goalId);
        let Hsaved = goal.Htotalsaved;
        let Htarget = goal.Htarget;
        let Vsaved = goal.Vtotalsaved;
        let Vtarget = goal.Vtarget;
        let Gsaved = goal.Gtotalsaved;
        let Gtarget = goal.Gtarget;
        let Hpercent = (Hsaved / Htarget) * 100;
        let Vpercent = (Vsaved / Vtarget) * 100;
        let Gpercent = (Gsaved / Gtarget) * 100;
        console.log(Hpercent, Vpercent, Gpercent);
        let H = parseInt(Hpercent);
        let V = parseInt(Vpercent);
        let G = parseInt(Gpercent);
        if (H > 100) {
          H = 100;
        }
        if (V > 100) {
          V = 100;
        }
        if (G > 100) {
          G = 100;
        }
        bar1.textContent = `${H}%`;
        bar2.textContent = `${V}%`;
        bar3.textContent = `${G}%`;
        let values = [`${H}%`, `${V}%`, `${G}%`];
        progressBar.forEach((progress, index) => {
          progress.style.width = values[index];
        });
      } else {
        console.log("Values are not set");
        let values = ["0%", "0%", "0%"];
        progressBar.forEach((progress, index) => {
          progress.style.width = values[index];
        });
      }
    });
});

const data = {
  budget: "My budget",
  expense: "My expense",
};
logout.addEventListener("click", () => {
  console.log("-----Trigerred-------");
  //   console.log(data);
  fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(data),
  }).then((response) => window.location.assign(`${url}/loggedout`));
  // .then((data) => {
  //   console.log("Success:", data);
  // });
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
});
