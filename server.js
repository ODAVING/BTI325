/***********************************************************************
*  BTI325 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
* 
*  No part of this assignment has been copied manually or electronically from any other source 
*
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Sina Lahsaee Student ID: 129948162 Date: DEC 28th, 2017
*
*  Online (Heroku) Link: https://fast-fjord-15339.herokuapp.com/
*
***********************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");
var path1 = require("./data-service.js");
var express = require("express");
const clientSessions = require('client-sessions');
var dataServiceAuth = require("./data-service-auth.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var dataServiceComments = require('./data-service-comments.js');
var app = express();

app.use(express.static('public')); 

//assignment 4
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");

// setup a 'route' to listen on the default url path
app.get("/", function(req, res) {
    res.render("home");
});
//A7 
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "week10example_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });

function ensureLogin(req,res,next)
{
    if (!req.session.user)
    {
        res.redirect("/login");
    }
    else 
    {
        next();
    }
};
//A6 updated
app.get("/about", function(req,res){
    dataServiceComments.getAllComments().then(function(data){
        res.render("about", {data: data});
    }).catch(()=>{res.render("about");})
    
});

app.get('/employees', ensureLogin, function(req, res) {
    
    if (req.query !== {} || req.query.manager !== {})
    { 
        if (req.query.status)
            
            path1.getEmployeesByStatus(req.query.status)
            .then( function(data) {
                res.render("employeeList", { data: data, title: "Employees" });;
            })
            .catch( function(err) {res.render("employeeList", { data: {}, title: "Employees" });});

        else if (req.query.department)
            
            path1.getEmployeesByDepartment(req.query.department)
            .then( function(data) {
                res.render("employeeList", { data: data, title: "Employees" }); 
            })
            .catch( function(err) {res.render("employeeList", { data: {}, title: "Employees" });});

        else if (req.query.manager)
            
            path1.getEmployeesByManager(req.query.manager)
            .then( function(data) {
                res.render("employeeList", { data: data, title: "Employees" }); 
            })
            .catch( function(err) {res.render("employeeList", { data: {}, title: "Employees" });});

        else if (req.query)
            path1.getAllEmployees().then( function(data) {
                res.render("employeeList", { data: data, title: "Employees" });     
            })
            .catch( function(err) {res.render("employeeList", { data: {}, title: "Employees" });});

        else 
            {
                res.render("employeeList", { data: {}, title: "Employees" });     
            }
            
    }    
});

app.get("/employee/:empNum", ensureLogin,(req, res) => {
    
      // initialize an empty object to store the values
      let viewData = {};
    
      path1.getEmployeesByNum(req.params.empNum)
      .then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data"
      }).catch(()=>{
        viewData.data = null; // set employee to null if there was an error 
      }).then(path1.getDepartments)
      .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
        
          // loop through viewData.departments and once we have found the departmentId that matches
          // the employee's "department" value, add a "selected" property to the matching 
          // viewData.departments object
    
         for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
              viewData.departments[i].selected = true;
            }
          }
    
      }).catch(()=>{
        viewData.departments=[]; // set departments to empty if there was an error
      }).then(()=>{
          if(viewData.data == null){ // if no employee - return an error
              res.status(404).send("Employee Not Found");
          }else{
            res.render("employee", { viewData: viewData }); // render the "employee" view
          }
      });
    });
    

app.get('/managers', ensureLogin, (req,res)=>{
    path1.getManagers()
    .then( function(data) {
        res.render("employeeList", { data: data, title: "Employees (Managers)" });    
        
    })
    .catch( function(err){res.render("employeeList", { data: {}, title: "Employees (Managers)" });});
});

app.get('/departments', ensureLogin, (req,res)=>{
    path1.getDepartments()
    .then( function(data) {
        res.render("departmentList", { data: data, title: "Departments" });    
    })
    .catch( function(err) {res.render("departmentList", { data: {}, title: "Departments" });});
});
//Updated in A5
app.get("/employees/add", ensureLogin, (req,res) => {
    path1.getDepartments().then((data)=>{
        res.render("addEmployee", {departments: data});
    }).catch(()=>{
        res.render("addEmployee", {departments: []}); 
    })
});

app.post("/employees/add", ensureLogin, (req, res) => {
    path1.addEmployee(req.body).then(function(data){
        res.redirect("/employees");})
    
});
app.post("/employee/update", ensureLogin, (req, res) => {
    path1.updateEmployee(req.body).then(function(data){
    res.redirect("/employees");});
});

//Routes for A5
app.get("/departments/add", ensureLogin, (req,res) => {
    res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res) => {
    path1.addDepartment(req.body).then(function(data){
        res.redirect("/departments");})
    
});

app.post("/departments/update", ensureLogin, (req, res) => {
    path1.updateDepartment(req.body).then(function(data){
    res.redirect("/departments");});
});

app.get('/department/:depNum', ensureLogin, (req,res)=>{
    path1.getDepartmentById(req.params.depNum)
    .then( function(data){
        res.render("department", { data: data });})
    .catch(function(err) {res.status(404).send("Department Not Found");});
});

app.get('/employee/delete/:empNum', ensureLogin, (req,res)=>{
    path1.deleteEmployeeByNum(req.params.empNum)
    .then(function(data){
        res.redirect("/employees");
    }).catch(function(err){res.status(500).send("Unable to Remove Employee / Employee Not Found")});
});

///end of A5 Routes
///A6 POSTS
app.post("/about/addComment", (req, res) => {
    dataServiceComments.addComment(req.body).then(function(){
        res.redirect("/about");}).catch(function(){
            console.log("addComment(data) failed.")
            res.redirect("/about");});
});

app.post("/about/addReply", (req, res) => {
    dataServiceComments.addReply(req.body).then(function(){
        res.redirect("/about");}).catch(function(){
            console.log("addReply(data) failed.")
            res.redirect("/about");});
});

//A7
app.get("/login", function(req,res)
{
  res.render("login");
});

app.get("/register", function(req,res)
{
  res.render("register");
});

app.post("/register",(req,res) => 
{
  dataServiceAuth.registerUser(req.body).then(() => 
  {
    res.render("register",{successMessage:"User created"});
  }).catch((err) => 
  {
    res.render("register",{errorMessage:err, user:req.body.user});
  });
});

app.post("/login",(req,res) => 
{
  dataServiceAuth.checkUser(req.body).then(() =>
  {
    req.session.user = {
      username:req.body.user
    };
    console.log("redirecting to /employees");
    res.redirect("/employees");
  }).catch((err) => 
  {
    res.render("login", {errorMessage:err, user:req.body.user});
  });
});

app.get("/logout",(req,res) => 
{
  req.session.reset();
  res.redirect("/");
});



function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

//end of A6 POST
app.get('*', (req,res)=>{
    res.status(404);
    res.send("Page Not Found");
});
// setup http server to listen on HTTP_PORT
path1.initialize().then( function() {
    dataServiceComments.initialize();})
.then(function(){
    dataServiceAuth.initialize();
})
.then(function(){
    app.listen(HTTP_PORT, onHttpStart)})
    .catch( function (){
        console.log("unable to start dataService");
    });
