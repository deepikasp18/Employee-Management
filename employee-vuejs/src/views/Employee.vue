<template>
    <div class="container">
        <div class="options"> 
            <label>FILTER BY DEPARTMENT</label>
            <select  @change="updateList(departmentName)" v-model="departmentName" >
            <option selected value="" > Select a department </option>
            <option 
                v-for="department in allDepartments" 
                :value="department.name" 
                :key="department.id" >
                {{ department.name }}
            </option>
            </select>
            <label> ORDER BY </label>
            <select v-model=order @change="sortList(order)">
                <option selected value=""> ORDER BY </option> 
                <option value="name_asc">NAME IN ASC </option>
                <option value="name_desc ">NAME IN DESC </option>
                <option value="department_asc ">DEPARTMENT IN ASC </option>
                <option value="department_desc ">DEPARTMENT IN DESC </option>
            </select>
            <button @click="add"> ADD </button>
            <div class="add" v-if="toAdd">
                <br/>
                <label for="name" >Employee Name : </label><br/>
                <input name="name" v-model="employee.name"/><br/>
                <label for="dob" >Date of Birth : </label><br/>
                <Datepicker 
                    placeholder="Select your date of birth" 
                    v-model="employee.dob" 
                    :maxDate="new Date()" 
                    :enable-time-picker="false">
                </Datepicker><br/>
                <label for="doj" >Date of Joining : </label><br/>
                <Datepicker placeholder="Select your date of Joining" v-model="employee.doj" :maxDate="new Date()" :enable-time-picker="false"></Datepicker>
                <label for="email" > Email : </label><br/>
                <input name="email" v-model="employee.email"/><br/>
                <label for="phone" >Mobile Number: </label><br/>
                <input name="phone" v-model="employee.phone"/><br/>
                <label> Department Name : </label><br/>
                <select v-model="employee.departmentId" >
                    <option selected value=""> Select a department </option>
                    <option 
                        v-for="department in this.allDepartments" 
                        :value="department.id" 
                        :key="department.id">
                            {{ department.name }}
                    </option>
                </select><br/>

                <button type="submit" class="addBtn" @click="updateEmployee" v-if="toEdit"> Update  </button>
                <button type="submit" class="addBtn" @click="addEmployee" v-else> Add  </button>
                
            </div>
        </div>
        <div class="table">
            <table border="1"> 
            <thead>
            <tr>
                <th> Employee ID </th>
                <th> Employee Name </th>
                <th> Date of Birth </th>
                <th> Date of Joining </th>
                <th> email </th>
                <th> Phone </th>
                <th> Department </th>
                <th> Action </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="employee in Employees" :key="employee.id">
                <td>{{ employee.id }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ this.formatDate(employee.dob) }}</td>
                <td>{{ this.formatDate(employee.doj) }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.phone }}</td>
                <td>{{ employee.departmentName}}</td>
                <td>
                <button class="editBtn" @click="editEmployee(employee.id)">edit</button>
                <button class="deleteBtn" @click="deleteEmployee(employee.id)">delete</button>
            </td>
            </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment'


export default{
    name: "EmployeeManagement",
    components: { Datepicker },
    data() {
        return {
            instance: null,
            employee: {
                id : "",
                name: "",
                dob : "",
                doj : "",
                email : "",
                phone : "",
                departmentId : "",
                createdAt : "",
                updatedAt : ""
            },
            departmentName : "",
            allDepartments : [],
            allEmployees: [],
            Employees : [],
            toAdd : false,
            toEdit : false,
        };
    },
    methods: {
        formatDate(value){
         if (value) {
           return moment(String(value)).format('MMMM DD YYYY')
          }
        },
        validateEmail(email){
            let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/ ;
            return regex.test(email);
        },
        validateInput(){
            if(this.employee.name == "" || this.employee.dob == null || this.employee.doj == null ||
               this.employee.email == "" || this.employee.phone == "" || this.employee.departmentId == ""){
                alert("All fields are required");
                return false;
            }
            if(!this.validateEmail(this.employee.email)){
               alert("Not a valid email")
               return false
            }
            if(this.employee.phone.length != 10){
              alert('Not a valid Mobile Number')
              return false
            }
            return true;
        },
        updateList(departmentName){
            console.log(this.Employees)
            this.Employees = departmentName === "" ? this.allEmployees : this.allEmployees.filter((value) => {
                                                                                                return value.departmentName == departmentName
                                                                                            }, departmentName)   
        },
        async sortList(order) {
            if (order.includes('name')) {
                this.Employees.sort(function (a, b) {
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
                if(order.includes('desc')){
                    this.Employees.reverse();
                }
            }
            else if (order.includes('department')) {
                this.Employees.sort(function (a, b) {
                    let x = a.departmentName.toLowerCase();
                    let y = b.departmentName.toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
                if(order.includes('desc')){
                    this.Employees.reverse();
                }
            }
            else {
                const fetchDepartments = await this.instance.get('/department');
                this.allDepartments = fetchDepartments.data;
            }
            
        },
        async deleteEmployee(key) {
            console.log(key);
            const toDelete = confirm("Are you sure you want to delete this employee?");
            if (toDelete) {
                const del = this.instance.delete("/employee?id=" + key).catch(err => console.log(err));
                console.log(del);
                const fetchEmployees = await this.instance.get("/employee");
                this.Employees = fetchEmployees.data;
            }
        },
        add(){
            this.toAdd = true;
        },
        async addEmployee(){
            if(this.validateInput()){
              //this.employee.dob = dateFormat(this.employee.dob, "isoDate");
            //   console.log(this.employee.dob);
              const result = await this.instance.post('/employee', this.employee).catch(err => console.log(err));
              console.log(result.data);
              const fetchEmployees = await this.instance.get("/employee");
              this.Employees = fetchEmployees.data;
              this.toAdd = false;
              this.clearForm();
            }
            
        },
        clearForm(){
            this.employee.name = '',
            this.employee.dob = '',
            this.employee.doj = '',
            this.employee.email = '',
            this.employee.phone = '',
            this.employee.departmentId = ''
        },
        async editEmployee(key){
            const fetchEmployee = await this.instance.get('/employee/show?id='+key).catch(err => console.log(err));
            console.log(fetchEmployee);
            this.employee = fetchEmployee.data;
            this.toEdit = true;
            this.toAdd = true;
        },
        async updateEmployee(){
            if(this.validateInput()){
              const result = await this.instance.put('/employee', this.employee);
              console.log(result);
              this.toEdit = false;
              this.toAdd = false; 
              const fetchEmployees = await this.instance.get("/employee");
              this.Employees = fetchEmployees.data;
            }
            
        }
       
    },
    async mounted() {
        this.instance = axios.create({
            baseURL: "http://127.0.0.1:3333",
            headers: {
                "API_KEY": "TgGaXtgfdeMlATOdVpCcpXl8TbB79TZ_"
            }
        });
        const fetchEmployees = await this.instance.get("/employee");
        this.allEmployees = fetchEmployees.data;
        this.Employees = fetchEmployees.data;
        const fetchDepartments = await this.instance.get("/department");
        this.allDepartments = fetchDepartments.data;
    },
}

</script>

<style scoped>
table{
    width: 1200px;
    margin:auto
    
}
th{
    background-color: rgb(203, 203, 171);
}

.container{
    padding: 20px;
    width: 1200px;
    margin: auto;
}
.options{
    padding-bottom: 20px;
}
button{
    background-color: green;
    padding: 5px;
    margin: 15px;
    margin-right:auto
}
.options select{
    width : 150px;
    margin: 20px;
}
.editBtn{
  background-color: #e8ff16;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  color: rgb(12, 12, 12);
}
.deleteBtn{
  background-color: #f91100;
  padding: 10px 20px;
  margin:5px;
  border: none;
  color: white;
}
input,.add select{
  border: 1px solid black ;
  padding: 10px;
  margin: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-right: 12px;
  width: 800px;
  border-radius: 5px;
  font-style: italic;
}

label{
font-size: large;
font-family:Verdana, Geneva, Tahoma, sans-serif;
}

.add{
    margin: 100px;
}
.addBtn{
  position: relative;
  width: 100px;
  padding: 10px;
  font-size: large;
  margin-top: 15px;
  margin-left: auto;
  background-color: rgb(28, 179, 28);
  border: none;
  border-radius: 5px;
}
</style>

