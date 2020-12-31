const table = document.querySelector(".table-bud");
const logout = document.querySelector(".logout-a");
const monthSubmitForm = document.querySelector(".month-year");
const buttons = document.querySelectorAll(".btn");
const total = document.querySelector(".total-btn");
const totalDiv = document.querySelector(".total-div");
const totalcalbtn = document.querySelector(".totalcalbtn");
const totalbudcal = document.querySelector(".totalbudcal");
const totalexpcal = document.querySelector(".totalexpcal");
let url = `http://localhost:3000`;
table.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    // let btn = document.querySelectorAll(`.${e.target.className}`)
    let bud = e.target.parentElement;
    let expense = bud.previousElementSibling.children[0].value;
    console.log(expense);
    let budget =
      bud.previousElementSibling.previousElementSibling.children[0].value;
    console.log(budget);
    let name =
      bud.previousElementSibling.previousElementSibling.previousElementSibling
        .textContent;

    let total = budget - expense;

    let avail = bud.nextElementSibling;
    avail.innerHTML = `Rs. ${total}`;

    if (total < 0) {
      avail.style.color = "red";
    } else if (total > 0) {
      avail.style.color = "green";
    }
    let now = new Date();
    let m = now.getMonth() + 1;
    var y = now.getFullYear();
    console.log(y);
    console.log(m);
    let time = `${y}-${m}`;
    const data = {
      budget,
      expense,
      name,
      time,
    };
    console.log(data);

    fetch(`${url}/budgetpost`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data.status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
// const data = {
//   budget: "My budget",
//   expense: "My expense",
// };
logout.addEventListener("click", () => {
  console.log("-----Trigerred-------");
  // console.log(data);
  fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(data),
  }).then((response) => window.location.assign(`${url}/loggedout`));
  // .then((response) => response.json())
  // .then((data) => {
  //   console.log("Success:", data);
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
});
let calTime;
// for form

monthSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Budget Month year trigerred");
  console.log(e.target.month.value);
  let time = e.target.month.value;
  calTime = time;
  let now = new Date();
  let m = now.getMonth() + 1;
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

  fetch(`${url}/budgetcal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((User) => {
      console.log("Budget Fetch Response Working");
      return User.json();
    })
    .then((data) => {
      console.log(data);
      const Available = (avail, Total) => {
        avail.innerHTML = `Rs. ${Total}`;
        if (Total < 0) {
          avail.style.color = "red";
        } else if (Total == 0) {
          avail.style.color = "black";
        } else if (Total > 0) {
          avail.style.color = "green";
        }
      };
      //Rent
      console.log(data.Budget.budgetId);
      table.children[1].children[0].children[1].children[0].value =
        data.Budget.rent;
      table.children[1].children[0].children[2].children[0].value =
        data.Expense.rent;
      let total0 = data.Budget.rent - data.Expense.rent;
      Available(table.children[1].children[0].children[4], total0);

      //Grocery
      table.children[1].children[1].children[1].children[0].value =
        data.Budget.grocery;
      table.children[1].children[1].children[2].children[0].value =
        data.Expense.grocery;
      let total1 = data.Budget.grocery - data.Expense.grocery;
      Available(table.children[1].children[1].children[4], total1);
      //Bill
      table.children[1].children[2].children[1].children[0].value =
        data.Budget.bills;
      table.children[1].children[2].children[2].children[0].value =
        data.Expense.bills;
      let total2 = data.Budget.bills - data.Expense.bills;
      Available(table.children[1].children[2].children[4], total2);
      //Leisure
      table.children[1].children[3].children[1].children[0].value =
        data.Budget.leisure;
      table.children[1].children[3].children[2].children[0].value =
        data.Expense.leisure;
      let total3 = data.Budget.leisure - data.Expense.leisure;
      Available(table.children[1].children[3].children[4], total3);
      //shopping
      table.children[1].children[4].children[1].children[0].value =
        data.Budget.shopping;
      table.children[1].children[4].children[2].children[0].value =
        data.Expense.shopping;
      let total4 = data.Budget.shopping - data.Expense.shopping;
      Available(table.children[1].children[4].children[4], total4);
      //misc
      table.children[1].children[5].children[1].children[0].value =
        data.Budget.misc;
      table.children[1].children[5].children[2].children[0].value =
        data.Expense.misc;
      let total5 = data.Budget.misc - data.Expense.misc;
      Available(table.children[1].children[5].children[4], total5);
      //home
      table.children[1].children[6].children[1].children[0].value =
        data.Budget.home;
      table.children[1].children[6].children[2].children[0].value =
        data.Expense.home;
      let total6 = data.Budget.home - data.Expense.home;
      Available(table.children[1].children[6].children[4], total6);
      //vacation
      table.children[1].children[7].children[1].children[0].value =
        data.Budget.vac;
      table.children[1].children[7].children[2].children[0].value =
        data.Expense.vac;
      let total7 = data.Budget.vac - data.Expense.vac;
      Available(table.children[1].children[7].children[4], total7);
      //gadget
      table.children[1].children[8].children[1].children[0].value =
        data.Budget.gadget;
      table.children[1].children[8].children[2].children[0].value =
        data.Expense.gadget;
      let total8 = data.Budget.gadget - data.Expense.gadget;
      Available(table.children[1].children[8].children[4], total8);
      //investment
      table.children[1].children[9].children[1].children[0].value =
        data.Budget.investment;
      table.children[1].children[9].children[2].children[0].value =
        data.Expense.investment;
      let total9 = data.Budget.investment - data.Expense.investment;
      Available(table.children[1].children[9].children[4], total9);
    });
});
// calculates the recommended 40-30-20-10 rule
total.addEventListener("click", () => {
  let data;
  if (!calTime) {
    let now = new Date();
    let m = now.getMonth() + 1;
    var y = now.getFullYear();
    let time = `${y}-${m}`;
    data = { time };
  } else {
    let time = calTime;
    data = { time };
  }
  fetch(`${url}/total`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((income) => {
      console.log("Income response trigerred");
      return income.json();
    })
    .then((data) => {
      console.log(data);
      let totalIncome =
        data.salary +
        data.interest +
        data.dividend +
        data.rental +
        data.pocketMoney;
      let recNeed = totalIncome * (40 / 100);
      let recWant = totalIncome * (30 / 100);
      let recGoal = totalIncome * (20 / 100);
      let recInv = totalIncome * (10 / 100);
      console.log(totalIncome, recNeed, recWant, recGoal, recInv);
      let rent = parseInt(
        table.children[1].children[0].children[1].children[0].value
      );
      let grocery = parseInt(
        table.children[1].children[1].children[1].children[0].value
      );
      let bill = parseInt(
        table.children[1].children[2].children[1].children[0].value
      );
      let leisure = parseInt(
        table.children[1].children[3].children[1].children[0].value
      );
      let shopping = parseInt(
        table.children[1].children[4].children[1].children[0].value
      );
      let misc = parseInt(
        table.children[1].children[5].children[1].children[0].value
      );
      let home = parseInt(
        table.children[1].children[6].children[1].children[0].value
      );
      let vac = parseInt(
        table.children[1].children[7].children[1].children[0].value
      );
      let gadget = parseInt(
        table.children[1].children[8].children[1].children[0].value
      );
      let inv = parseInt(
        table.children[1].children[9].children[1].children[0].value
      );
      let Need = rent + grocery + bill;
      let Want = leisure + shopping + misc;
      let Goal = home + vac + gadget;
      let html = `<table class="total-table">
                  <thead>
                  <td class='total-head'>Budget</td>
                  <td class='total-head'>Recommended by 40-30-20-10 rule</td>
                  <td class='total-head'>Your Budget</td>
                  </thead>
                  <tr>
                  <td>Needs</td>
                  <td>${recNeed}</td>
                  <td>${Need}</td>
                  </tr>
                  <tr>
                  <td>Wants</td>
                  <td>${recWant}</td>
                  <td>${Want}</td>
                  </tr>
                  <tr>
                  <td>Goals</td>
                  <td>${recGoal}</td>
                  <td>${Goal}</td>
                  </tr>
                  <tr>
                  <td>Investments</td>
                  <td>${recInv}</td>
                  <td>${inv}</td>
                  </tr>
                  </table>`;
      totalDiv.innerHTML += html;
      scroll({
        top: 1000,
        behavior: "smooth",
      });
    });
});

totalcalbtn.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    let Brent = parseInt(
      table.children[1].children[0].children[1].children[0].value
    );
    let Erent = parseInt(
      table.children[1].children[0].children[2].children[0].value
    );
    let Bgroc = parseInt(
      table.children[1].children[1].children[1].children[0].value
    );
    let Egroc = parseInt(
      table.children[1].children[1].children[2].children[0].value
    );
    let Bbill = parseInt(
      table.children[1].children[2].children[1].children[0].value
    );
    let Ebill = parseInt(
      table.children[1].children[2].children[2].children[0].value
    );
    let Bleisure = parseInt(
      table.children[1].children[3].children[1].children[0].value
    );
    let Eleisure = parseInt(
      table.children[1].children[3].children[2].children[0].value
    );
    let Bshop = parseInt(
      table.children[1].children[4].children[1].children[0].value
    );
    let Eshop = parseInt(
      table.children[1].children[4].children[2].children[0].value
    );
    let Bmisc = parseInt(
      table.children[1].children[5].children[1].children[0].value
    );
    let Emisc = parseInt(
      table.children[1].children[5].children[2].children[0].value
    );
    let Bhome = parseInt(
      table.children[1].children[6].children[1].children[0].value
    );
    let Ehome = parseInt(
      table.children[1].children[6].children[2].children[0].value
    );
    let Bvac = parseInt(
      table.children[1].children[7].children[1].children[0].value
    );
    let Evac = parseInt(
      table.children[1].children[7].children[2].children[0].value
    );
    let Bgad = parseInt(
      table.children[1].children[8].children[1].children[0].value
    );
    let Egad = parseInt(
      table.children[1].children[8].children[2].children[0].value
    );
    let Binv = parseInt(
      table.children[1].children[9].children[1].children[0].value
    );
    let Einv = parseInt(
      table.children[1].children[9].children[2].children[0].value
    );
    let Btotal =
      Brent +
      Bgroc +
      Bbill +
      Bleisure +
      Bshop +
      Bmisc +
      Bhome +
      Bvac +
      Bgad +
      Binv;
    let Etotal =
      Erent +
      Egroc +
      Ebill +
      Eleisure +
      Eshop +
      Emisc +
      Ehome +
      Evac +
      Egad +
      Einv;
    totalbudcal.value = Btotal;
    totalexpcal.value = Etotal;
  }
});
