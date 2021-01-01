const logout = document.querySelector(".logout-a");
const monthSubmitForm = document.querySelector(".month-year-income");
const tableInc = document.querySelector(".table-income");
const buttons = document.querySelectorAll(".btn");
const IncomeTotalBtn = document.querySelector(".incomeTotalCalc");
let url = `http://localhost:3000`;
// const data = {
//   budget: "My budget",
//   expense: "My expense",
// };

// logout function
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
});

// get past income data
monthSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("----Income Month Year Submit Triggered------");
  console.log(e.target.month.value);
  let time = e.target.month.value;
  let now = new Date();
  let m = parseInt(now.getMonth() + 1);
  if (m < 10) {
    m = `0${m}`;
  }
  var y = now.getFullYear();
  let timeNow = `${y}-${m}`;
  if (time !== timeNow) {
    // hides update buttons for previous data
    console.log(buttons);
    buttons.forEach((btn) => {
      btn.style.display = "none";
    });
  } else {
    buttons.forEach((btn) => {
      btn.style.display = "";
    });
  }
  let data = { time };

  fetch(`${url}/incomecal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((income) => {
      console.log("Response working");

      return income.json();
    })
    .then((data) => {
      console.log(data);
      // for updating salary value
      tableInc.children[1].children[0].children[0].nextElementSibling.firstChild.value =
        data.salary;
      // for updating interest value
      tableInc.children[1].children[1].children[0].nextElementSibling.firstChild.value =
        data.interest;
      // for updating dividend value
      tableInc.children[1].children[2].children[0].nextElementSibling.firstChild.value =
        data.dividend;
      // for updating rental value
      tableInc.children[1].children[3].children[0].nextElementSibling.firstChild.value =
        data.rental;
      // for updating pocket money
      tableInc.children[1].children[4].children[0].nextElementSibling.firstChild.value =
        data.pocketMoney;
    })
    .catch((err) => {
      console.log(err);
    });
});

// updating income values in database
tableInc.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    let row = e.target.parentElement;
    let val = row.previousElementSibling.children[0].value;
    let name = row.previousElementSibling.children[0].name;
    let now = new Date();
    let m = parseInt(now.getMonth() + 1);
    var y = now.getFullYear();
    if (m < 10) {
      m = `0${m}`;
    }
    console.log(y);
    console.log(m);
    let time = `${y}-${m}`;
    console.log(name);
    console.log(time);
    let data = { val, name, time };
    console.log(data);

    fetch(`${url}/incomepost`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

IncomeTotalBtn.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    let salary = parseInt(
      tableInc.children[1].children[0].children[0].nextElementSibling.firstChild
        .value
    );
    let interest = parseInt(
      tableInc.children[1].children[1].children[0].nextElementSibling.firstChild
        .value
    );
    let dividend = parseInt(
      tableInc.children[1].children[2].children[0].nextElementSibling.firstChild
        .value
    );
    let rental = parseInt(
      tableInc.children[1].children[3].children[0].nextElementSibling.firstChild
        .value
    );
    let pocket = parseInt(
      tableInc.children[1].children[4].children[0].nextElementSibling.firstChild
        .value
    );
    let total = salary + interest + dividend + rental + pocket;
    tableInc.children[1].children[5].children[0].nextElementSibling.firstChild.value = total;
  }
});
