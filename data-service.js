//Added in A5/A6
const Sequelize = require('sequelize');
const dataServiceComments = require("./data-service-comments.js");
//Added in A5
var sequelize = new Sequelize('ddi9hsc1gf2he1','flxfaqbfbfbewk','f44b2aa4ec379bf3e17054bc37553ed86c0528572f5a8e66d49e9dfd300294e1',
                                {host: 'ec2-50-16-202-213.compute-1.amazonaws.com',
                                 dialect: 'postgres',
                                 port: 5432,
                                 dialectOptions: {ssl:true}
                                });
//Added in A5                           
var Employee = sequelize.define(
    'Employee', {
    employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
    }, 
    {
    createdAt: false,
    updatedAt: false 
    });
//Added in A5
var Department = sequelize.define('Department', {
    departmentId: 
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
        departmentName: Sequelize.STRING
    },
    {
            createdAt: false, 
            updatedAt: false 
    });
//updated in A5
module.exports.initialize = function () {
    return new Promise(function (resolve,reject){
        sequelize.sync().then(function(Employee){
            resolve();
        }).then(function(Department){
            resolve();
        }).catch(function(error){
            reject('Unable to sync the database')
        })
    });     
};
//updated in A5, This method was 
module.exports.addEmployee = function(employeeData){
    var tempEmp = [];
    
    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function(resolve, reject){
        sequelize.sync().then(()=>{
            for (var k in employeeData) 
            {
                if(employeeData[k] == "")
                {
                    employeeData[k] = null;
                }
            }
            tempEmp = Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate});
                resolve(tempEmp);
            }).catch((error)=>{
                reject('Unable to Add Employee');
            });
        })
    };
//updated in A5
module.exports.getAllEmployees = function (){
    return new Promise(function (resolve,reject){
        var tempEmp = []; 
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll();
            resolve(tempEmp);
        }).catch(function(error){
            reject('No Results Returned')
        })
    });
};
//updated in A5
module.exports.getEmployeesByStatus = function(status){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll({where:{status:status}})
            resolve(tempEmp);
        }).catch((error)=>{
            reject("No Results Returned");
        })
    });
};
//updated in A5
module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll({where:{department:department}});
            resolve(tempEmp);
        }).catch((error)=>{
            reject('No Results Returned');
        })
    });
};
//updated in A5
module.exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll({where:{employeeManagerNum:manager}});
            resolve(tempEmp);
        }).catch((error)=>{
            reject('No Results Returned');
        });
    });
};
//updated in A5
module.exports.getEmployeesByNum = function(num){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll({where:{employeeNum:num}});
            resolve(tempEmp);
        }).catch((error)=>{
            reject('No Results Returned');
        });
    });
};
//updated in A5
module.exports.updateEmployee = function (employeeData){
    var tempEmp = [];
    employeeData.isManager = (employeeData.isManager) ? true : false;

        return new Promise(function(resolve,reject){
            sequelize.sync().then(()=>{
                for (var k in employeeData) 
                {
                    if(employeeData[k] == ""){
                        employeeData[k] = null;
                    }
                }
                tempEmp = Employee.update({
                    firstName: employeeData.firstName,
                    last_name: employeeData.last_name,
                    email: employeeData.email,
                    addressStreet: employeeData.addressStreet,
                    addresCity: employeeData.addresCity,
                    addressPostal: employeeData.addressPostal,
                    addressState: employeeData.addressPostal,
                    isManager: employeeData.isManager,
                    employeeManagerNum: employeeData.employeeManagerNum,
                    status: employeeData.status,
                    department: employeeData.department
                }, 
                {where:{employeeNum:employeeData.employeeNum}
                });
                resolve(tempEmp);
            }).catch((error)=>{
                reject('Could Not Update Employee');
            });
        });
    };
//updated in A5
module.exports.getManagers = function(){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Employee.findAll({where:{isManager:true}});
            resolve(tempEmp);
        }).catch((error)=>{
            reject('No Results Returned');
        });
    });
};
//updated in A5
module.exports.getDepartments = function(){
    return new Promise(function (resolve,reject){
        var tempEmp = [];
        sequelize.sync().then(()=>{
            tempEmp = Department.findAll();
            resolve(tempEmp);
        }).catch((error)=>{
            reject('No Results Returned');
        })
    });
};

module.exports.addDepartment = function(departmentData){
        return new Promise(function(resolve,reject){
            var tempEmp = [];
            sequelize.sync().then(()=>{
                for (var k in departmentData) {
                    if(departmentData[k] == ""){
                        departmentData[k] = null;
                    }
                }
                tempEmp = Department.create({
                    departmentId : departmentData.departmentId,
                    departmentName: departmentData.departmentName
                });
                resolve(tempEmp);
            }).catch((error)=>{
                reject('Department Was not Added');
            });
        });
    };

    //Added in A5
    module.exports.updateDepartment = function(departmentData){
        return new Promise(function(resolve, reject){
            var tempEmp = [];
            sequelize.sync().then(()=>{
                for(var k in departmentData){
                    if(departmentData[k] == "") {
                        departmentData[k] = null;
                    }
                }
                tempEmp = Department.update(
                    {departmentName: departmentData.departmentName}, 
                    {where:{departmentId:departmentData.departmentId}
            });
                resolve(tempEmp);
            }).catch((error)=>{
                reject("Could Not Update Department");});
        });
    };

    //Added in A5
    module.exports.getDepartmentById = function(departid){
        return new Promise(function(resolve, reject) {
            var tempEmp = [];
            sequelize.sync().then(()=>{
                tempEmp = Department.findAll({where:{departmentId:departid}});
                resolve(tempEmp);
            }).catch((error)=>{
                reject('No Results Returned');
            });
        });
    }

    //Added in A5
    module.exports.deleteEmployeeByNum = function(employeeNum){
        return new Promise(function(resolve, reject){
            var tempEmp = [];
            sequelize.sync().then(()=>{
                tempEmp = Employee.destroy({where:{employeeNum:employeeNum}});
                resolve(tempEmp);
            }).catch((error)=>{
                reject('Could Not Delete Employee');
            });
        });
    };
