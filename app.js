const express = require("express");
const Sequelize = require("sequelize");
const connection = require("./connection");
const session = require("express-session");
const flash = require("connect-flash");

const path = require("path");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();

const {
  PORT = 3000,
  SESSION_LIFE = 1000 * 60 * 60 * 2,
  SESS_SEC = "don't share this",
  NODE_ENV = "development",
  SESS_NAME = "sid",
} = process.env;

const IN_PROD = NODE_ENV === "production";

//authenticate the connection to database
connection
  .authenticate()
  .then(() => {
    console.log("Connection to database done successfully");
    app.listen(PORT, () => {
      console.log("Running server on port", PORT);
    });
  })
  .catch((err) => {
    console.log("error while connecting", err);
  });

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: SESS_SEC,
    name: SESS_NAME,
    cookie: {
      maxAge: SESSION_LIFE,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);
app.use(flash());

const User = require("./models/user");
const Totalusers = require("./models/totalusers");
const Nominee = require("./models/nominee");
const Income = require("./models/income");
const Budget = require("./models/budget");
const Expense = require("./models/expense");
const Goals = require("./models/goals");
const { request, response } = require("express");

User.hasOne(Nominee, { foreignKey: "userid" }); // 1:1 reln btw user and nominee, nominee has userid as foreign key
User.hasOne(Income, { foreignKey: "userid" }); //1:1 reln with userid of User as foreign key in Income
User.hasOne(Expense, { foreignKey: "userid" });
Expense.hasOne(Budget, { foreignKey: "expenseId" });
User.hasOne(Goals, { foreignKey: "userid" });
User.hasMany(Totalusers, { constraints: false });
connection.query(
  //   "DROP PROCEDURE IF EXISTS addEmail\n" +
  "CREATE PROCEDURE addNominee(IN USERID INT, IN EMAIL VARCHAR(255))\n" +
    "BEGIN\n" +
    "INSERT INTO nominees(email,userid) VALUES(EMAIL,USERID);\n" +
    "END"
);

Nominee.belongsTo(User, { foreignKey: "userid" }); // 1:1 reln btw user and nominee, nominee has userid as foreign key
Income.belongsTo(User, { foreignKey: "userid" }); //1:1 reln with userid of User as foreign key in Income
Expense.belongsTo(User, { foreignKey: "userid" });
Budget.belongsTo(Expense, { foreignKey: "expenseId" });
Goals.belongsTo(User, { foreignKey: "userid" });
Totalusers.belongsTo(User, { constraints: false });
// comment
connection.sync({
  // logging: console.log,
  force: false,
});

// async function asyncall() {
//   const trigger = await connection.query(
//     "CREATE TRIGGER goalUpdate AFTER INSERT ON expenses" +
//       "FOR EACH ROW" +
//       "BEGIN" +
//       "INSERT INTO goals(Hpresent) VALUES(NEW.home);" +
//       "END;"
//   );

//   console.log("Trigger has been called");
// }

// connection
//   .sync({
//     logging: console.log,
//     force: true,
//   })
//   .then(() => {
//     console.log("Connection to database done successfully");
//     app.listen(PORT, () => {
//       console.log("Running server on port", PORT);
//     });
//   })
//   .catch((err) => {
//     console.log("Unable to connect to database", err);
//   });
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const redirectLogin = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect("/sign");
  } else {
    next();
  }
};

const redirectIncome = (req, res, next) => {
  if (req.session.userid) {
    res.redirect("/income");
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  if (req.session.loggedin === true) {
    res.render("homepage", { loggedin: true });
  } else {
    res.render("homepage", { loggedin: false });
  }
});

app.get("/sign", redirectIncome, (req, res) => {
  res.render("login", {
    messages: req.flash(""),
    signup_messages: req.flash(""),
  });
});

app.get("/income", redirectLogin, (req, res) => {
  res.render("income");
});

app.get("/budget", redirectLogin, (req, res) => {
  res.render("budget");
});

app.get("/goals", redirectLogin, (req, res) => {
  res.render("goals", {
    messages: req.flash(""),
  });
});

app.get("/loggedout", (req, res) => {
  console.log("Logged out triggered");
  res.redirect("/");
});

app.post("/logout", redirectLogin, (req, res) => {
  console.log("Request made");
  req.session.destroy((err) => {
    if (err) {
      console.log("error while logging out");
      return res.redirect("/");
    }
    res.clearCookie(SESS_NAME);
    return res.redirect("/");
  });
  // res.send("Hello");
  // response.json({
  //   status: "Success",
  // });
});
// app.get("/report", (req, res) => {
//   res.render("report");
// });
// app.post("/budgetpost", (req, res) => {
//   console.log(req.body);
//   if(req.body.name == 'Rent'){
//     Budget.create

//   }
//   updateone.then(updattwo.then(res.send))
// });
app.post("/signin", redirectIncome, (req, res) => {
  let data = req.body;
  let email = req.body.email;
  let inputpassword = req.body.password;

  //get all user details by email
  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      req.flash("message", "*EMAIL NOT FOUND!*");
      return res.render("login", {
        messages: req.flash("message"),
        signup_messages: req.flash(""),
      });
    } else {
      console.log(user);
      let registereduser = user.dataValues;
      let userid = registereduser.userid;
      let password = registereduser.password;
      let email = registereduser.email;
      console.log(userid, password, email);
      if (inputpassword !== password) {
        console.log("Incorrect password");
        req.flash("message", "*INCORRECT PASSWORD*");
        return res.render("login", {
          messages: req.flash("message"),
          signup_messages: req.flash(""),
        });
      } else {
        req.session.loggedin = true;
        req.session.userid = registereduser.userid;
        console.log(req.session.userid);
        res.redirect("/income");
      }
    }
  });
});

app.post("/signup", redirectIncome, (req, res) => {
  let name = req.body.name;
  let emailId = req.body.email;
  let nominee_email = req.body.email_nominee;
  let password = req.body.password;

  let reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (reg.test(emailId) === false) {
    console.log("Not a valid mail");
    req.flash("message", "*Not A Valid Mail. Please Signup Again.*");
    return res.render("login", {
      signup_messages: req.flash("message"),
      messages: req.flash(""),
    });
  } else if (reg.test(nominee_email) === false) {
    console.log("Not a valid nominee mail");
    req.flash("message", "*Not A Valid Nominee Mail. Please Signup Again.*");
    return res.render("login", {
      signup_messages: req.flash("message"),
      messages: req.flash(""),
    });
  } else if (password.length < 8) {
    console.log("Password should be atleast 8 characters long");
    req.flash(
      "message",
      "*Password Should Be Atleast 8 Characters. Please Signup Again.*"
    );
    return res.render("login", {
      signup_messages: req.flash("message"),
      messages: req.flash(""),
    });
  }
  User.findOne({ where: { email: emailId } }).then((user) => {
    if (!user) {
      console.log("Not previoulsy found");
      User.create({
        name: `${name}`,
        email: `${emailId}`,
        password: `${password}`,
      })
        .then((user) => {
          console.log("User created successfully");
          console.log(user);
          let registereduser = user.dataValues;
          let userid = registereduser.userid;
          // let userCreated = registereduser.createdAt;
          // let userUpdated = registereduser.updatedAt;
          // console.log(userid);
          // console.log(userCreated, userUpdated);
          // Nominee.create({
          //   email: `${nominee_email}`,
          //   userid: `${registereduser.userid}`,
          // });
          const USERID = JSON.stringify(userid);
          const EMAIL = JSON.stringify(nominee_email);
          const query = "CALL addNominee(" + USERID + "," + EMAIL + " )";
          connection.query(query, function (err, result) {
            if (err) {
              console.log("err:", err);
            } else {
              console.log("results:", result);
            }
          });
          console.log("Nominee also created succesfully");
        })
        .then(() => {
          console.log("User created successfully");
          return res.redirect("/sign");
        })
        .catch((err) => {
          console.log("Some error", err);
        });
    } else {
      req.flash("message", "*User Already Exists. Please Login.*");
      return res.render("login", {
        signup_messages: req.flash("message"),
        messages: req.flash(""),
      });
    }
  });
});

app.get("/feedback", (req, res) => {
  res.render("feedback");
});
app.post("/feedback", (req, res) => {
  "use strict";

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL, // generated user
        pass: process.env.GMAIL_PASS, // generated password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: req.body.usermail, // sender address
      to: "bhavyal000009@gmail.com", // list of receivers
      subject: "Feedback", // Subject line
      text: req.body.msg, // plain text body
      name: req.body.username,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  main()
    .then(() => {
      res.render("response");
    })
    .catch(console.error);
});

app.post("/incomecal", (req, res) => {
  console.log("---triggered--");
  console.log(req.body);
  console.log(req.body.time);
  console.log(req.session.userid);
  let month = req.body.time;
  Income.findOne({
    where: { userid: req.session.userid, monthYear: month },
  }).then((user) => {
    if (!user) {
      console.log("No such user");
      let income = {
        incomeId: 0,
        salary: 0,
        interest: 0,
        dividend: 0,
        rental: 0,
        pocketMoney: 0,
        monthYear: "2020-02",
        createdAt: 0,
        updatedAt: 0,
        userid: 0,
      };
      console.log(income);
      return res.send(income);
      // return res.send(dummy);
    } else {
      console.log("User found");
      // let data = user.dataValues;
      let income = user.dataValues;
      console.log(income);
      return res.send(income);
    }
  });
});

// budget submit submit button for info

app.post("/budgetcal", (req, res) => {
  console.log("---Budget cal trigerred----");
  console.log(req.body);
  console.log(req.body.time);
  let month = req.body.time;

  Expense.findOne({
    where: { userid: req.session.userid, monthYear: month },
  }).then((Exp) => {
    if (!Exp) {
      console.log("No such budget and expense record found");
      let Budget = {
        budgetId: 0,
        rent: 0,
        grocery: 0,
        bills: 0,
        leisure: 0,
        shopping: 0,
        misc: 0,
        home: 0,
        vac: 0,
        gadget: 0,
        investment: 0,
        monthYear: "2020-09",
        createdAt: 0,
        updatedAt: 0,
        userid: 1,
      };
      let Expense = {
        expenseId: 0,
        rent: 0,
        grocery: 0,
        bills: 0,
        leisure: 0,
        shopping: 0,
        misc: 0,
        home: 0,
        vac: 0,
        gadget: 0,
        investment: 0,
        monthYear: "2020-09",
        createdAt: 0,
        updatedAt: 0,
        budgetId: 0,
      };
      let User = { Expense, Budget };
      res.send(User);
    } else {
      console.log("Budget Record found");
      console.log(Exp.dataValues);
      let id = Exp.dataValues.expenseId;
      let Expense = Exp.dataValues;
      let User = { Expense };
      console.log(User);
      Budget.findOne({
        where: { budgetId: id, monthYear: month },
      }).then((Bud) => {
        console.log("Expense Record found");
        console.log(Bud.dataValues);
        let Budget = Bud.dataValues;
        User = { Expense, Budget };
        console.log(User);
        return res.send(User);
      });
    }
  });
});
// app.get("/inc", (req, res) => {
//   Income.findOne({
//     where: { userid: req.session.userid, monthYear: month },
//   }).then((user) => {
//     if (!user) {
//       console.log("No such user");
//     } else {
//       console.log("User found");
//       // let data = user.dataValues;
//       let income = user.dataValues;
//       console.log(income);
//       return res.send(income);
//     }
//   });
// });

// income updates:

app.post("/incomepost", (req, res) => {
  console.log(req.body);
  let val = req.body.val;
  let name = req.body.name;
  let time = req.body.time;
  Income.findOne({
    where: { userid: req.session.userid, monthYear: time },
  }).then((user) => {
    if (!user) {
      console.log("No such user present");
      if (name === "salary") {
        Income.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          salary: `${val}`,
        });
      } else if (name === "interest") {
        Income.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          interest: `${val}`,
        });
      } else if (name === "dividend") {
        Income.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          dividend: `${val}`,
        });
      } else if (name === "rental") {
        Income.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          rental: `${val}`,
        });
      } else if (name === "pocketMoney") {
        Income.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          pocketMoney: `${val}`,
        });
      }
    } else {
      if (name === "salary") {
        Income.update(
          { salary: `${val}` },
          { where: { userid: req.session.userid } }
        );
      } else if (name === "interest") {
        Income.update(
          { interest: `${val}` },
          { where: { userid: req.session.userid } }
        );
      } else if (name === "dividend") {
        Income.update(
          { dividend: `${val}` },
          { where: { userid: req.session.userid } }
        );
      } else if (name === "pocketMoney") {
        Income.update(
          { pocketMoney: `${val}` },
          { where: { userid: req.session.userid } }
        );
      } else if (name === "rental") {
        Income.update(
          { rental: `${val}` },
          { where: { userid: req.session.userid } }
        );
      }
    }
  });
});

// budget update

app.post("/budgetpost", (req, res) => {
  console.log(req.body);
  console.log(req.body.budget, req.body.expense, req.body.time, req.body.name);
  let valBud = req.body.budget;
  let valExp = req.body.expense;
  let time = req.body.time;
  let name = req.body.name;
  Expense.findOne({
    where: { userid: req.session.userid, monthYear: time },
  }).then((user) => {
    if (!user) {
      console.log(
        "No user with budget and expense record found, creating the user now"
      );
      if (name === "Rent") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          rent: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            rent: `${valBud}`,
          });
        });
      } else if (name === "Grocery") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          grocery: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            grocery: `${valBud}`,
          });
        });
      } else if (name === "Bill") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          bills: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            bills: `${valBud}`,
          });
        });
      } else if (name === "Leisure") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          leisure: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            leisure: `${valBud}`,
          });
        });
      } else if (name === "Shopping") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          shopping: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            shopping: `${valBud}`,
          });
        });
      } else if (name === "Misc") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          misc: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            misc: `${valBud}`,
          });
        });
      } else if (name === "Home-G1") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          home: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            home: `${valBud}`,
          });
        });
      } else if (name === "Vacation-G2") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          vac: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            vac: `${valBud}`,
          });
        });
      } else if (name === "Gadget-G3") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          gadget: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            gadget: `${valBud}`,
          });
        });
      } else if (name === "Investment") {
        Expense.create({
          userid: `${req.session.userid}`,
          monthYear: `${time}`,
          investment: `${valExp}`,
        }).then((user) => {
          let id = user.dataValues.expenseId;
          Budget.create({
            expenseId: `${id}`,
            monthYear: `${time}`,
            investment: `${valBud}`,
          });
        });
      }
    } else {
      if (name === "Rent") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { rent: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update({ rent: `${valBud}` }, { where: { expenseId: id } });
        });
      } else if (name === "Grocery") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { grocery: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update({ grocery: `${valBud}` }, { where: { expenseId: id } });
        });
      } else if (name === "Bill") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { bills: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update({ bills: `${valBud}` }, { where: { expenseId: id } });
        });
      } else if (name === "Leisure") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { leisure: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update({ leisure: `${valBud}` }, { where: { expenseId: id } });
        });
      } else if (name === "Shopping") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { shopping: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update(
            { shopping: `${valBud}` },
            { where: { expenseId: id } }
          );
        });
      } else if (name === "Misc") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { misc: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update({ misc: `${valBud}` }, { where: { expenseId: id } });
        });
      } else if (name === "Home-G1") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { home: `${valExp}` },
          { where: { userid: req.session.userid } }
        )
          .then(() => {
            Budget.update({ home: `${valBud}` }, { where: { expenseId: id } });
          })
          .then(() => {
            Goals.findOne({ where: { userid: req.session.userid } }).then(
              (goal) => {
                if (!goal) {
                  console.log("Goal is not set");
                } else {
                  let presentMonth = goal.dataValues.HmonthYear;
                  if (presentMonth === time) {
                    Goals.update(
                      { Htotalsaved: `${valExp}` },
                      { where: { userid: req.session.userid } }
                    );
                  } else {
                    let updatedGoal =
                      parseInt(valExp) + parseInt(goal.dataValues.Htotalsaved);
                    Goals.update(
                      {
                        Htotalsaved: `${updatedGoal}`,
                        HmonthYear: `${time}`,
                      },
                      { where: { userid: req.session.userid } }
                    );
                  }
                }
              }
            );
          });
      } else if (name === "Vacation-G2") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { vac: `${valExp}` },
          { where: { userid: req.session.userid } }
        )
          .then(() => {
            Budget.update({ vac: `${valBud}` }, { where: { expenseId: id } });
          })
          .then(() => {
            Goals.findOne({ where: { userid: req.session.userid } }).then(
              (goal) => {
                if (!goal) {
                  console.log("Goal is not set");
                } else {
                  let presentMonth = goal.dataValues.VmonthYear;
                  if (presentMonth === time) {
                    Goals.update(
                      { Vtotalsaved: `${valExp}` },
                      { where: { userid: req.session.userid } }
                    );
                  } else {
                    let updatedGoal =
                      parseInt(valExp) + parseInt(goal.dataValues.Vtotalsaved);
                    Goals.update(
                      {
                        Vtotalsaved: `${updatedGoal}`,
                        VmonthYear: `${time}`,
                      },
                      { where: { userid: req.session.userid } }
                    );
                  }
                }
              }
            );
          });
      } else if (name === "Gadget-G3") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { gadget: `${valExp}` },
          { where: { userid: req.session.userid } }
        )
          .then(() => {
            Budget.update(
              { gadget: `${valBud}` },
              { where: { expenseId: id } }
            );
          })
          .then(() => {
            Goals.findOne({ where: { userid: req.session.userid } }).then(
              (goal) => {
                if (!goal) {
                  console.log("Goal is not set");
                } else {
                  let presentMonth = goal.dataValues.GmonthYear;
                  if (presentMonth === time) {
                    Goals.update(
                      { Gtotalsaved: `${valExp}` },
                      { where: { userid: req.session.userid } }
                    );
                  } else {
                    let updatedGoal =
                      parseInt(valExp) + parseInt(goal.dataValues.Gtotalsaved);
                    Goals.update(
                      {
                        Gtotalsaved: `${updatedGoal}`,
                        GmonthYear: `${time}`,
                      },
                      { where: { userid: req.session.userid } }
                    );
                  }
                }
              }
            );
          });
      } else if (name === "Investment") {
        let id = user.dataValues.expenseId;
        Expense.update(
          { investment: `${valExp}` },
          { where: { userid: req.session.userid } }
        ).then(() => {
          Budget.update(
            { investment: `${valBud}` },
            { where: { expenseId: id } }
          );
        });
      }
    }
  });
  res.json({
    status: "success",
  });
});

app.post("/total", (req, res) => {
  let time = req.body.time;
  Income.findOne({
    where: { userid: req.session.userid, monthYear: time },
  }).then((user) => {
    if (!user) {
      console.log("No income record found");
      return res.send("No income record found");
    } else {
      let income = user.dataValues;
      console.log(income);
      return res.send(income);
    }
  });
});

app.post("/addgoals", (req, res) => {
  console.log(req.body);
  let Htotal = req.body.homeinput;
  let Vtotal = req.body.vacinput;
  let Gtotal = req.body.gadinput;
  let now = new Date();

  let m = parseInt(now.getMonth() + 1);

  var y = now.getFullYear();
  if (m < 10) {
    m = `0${m}`;
  }
  let time = `${y}-${m}`;
  Goals.findOne({ where: { userid: req.session.userid } }).then((user) => {
    if (!user) {
      console.log("No goal set previously, setting now");
      Goals.create({
        userid: `${req.session.userid}`,
        Htarget: `${Htotal}`,
        Vtarget: `${Vtotal}`,
        Gtarget: `${Gtotal}`,
        HmonthYear: `${time}`,
        VmonthYear: `${time}`,
        GmonthYear: `${time}`,
      }).then(() => {
        console.log("Goal created successfully");
        return res.render("goals", {
          messages: req.flash(""),
        });
      });
    } else {
      console.log("Goals are already set");
      req.flash("message", "*Goals have been set already*");
      return res.render("goals", {
        messages: req.flash("message"),
      });
    }
  });
});

app.post("/goalbars", (req, res) => {
  Goals.findOne({ where: { userid: req.session.userid } }).then((goal) => {
    if (!goal) {
      console.log("No goal as such found");
      let data = {
        goalId: 0,
        Htotalsaved: 0,
        Htarget: 0,
        Vtotalsaved: 0,
        Vtarget: 0,
        Gtotalsaved: 0,
        Gtarget: 0,
        monthYear: "2020-12",
        createdAt: 0,
        updatedAt: 0,
        userid: 0,
      };
      return res.send(data);
    } else {
      console.log(goal.dataValues);
      let data = goal.dataValues;
      return res.send(data);
    }
  });
});
