<template>
    <div class="container">
        <div class="options"> 
            <!-- <select @change="sortList(value)">
                <option selected value=""> ORDER BY </option> 
                <option value="asc"> ASC </option>
                <option value="desc "> DESC </option>
            </select> -->
            <button @click="add"> ADD </button>
            <div class="add" v-if="toAdd">
                <br/>
                <label for="name" >Employee Name : </label>
                <input name="name" v-model="employee.name"/>
                <label for="dob" >Date of Birth : </label>
                <Datepicker placeholder="Select your date of birth" v-model="employee.dob" :maxDate="new Date()" :enable-time-picker="false"></Datepicker>
                <label for="doj" >Date of Joining : </label>
                <Datepicker placeholder="Select your date of Joining" v-model="employee.doj" :maxDate="new Date()" :enable-time-picker="false"></Datepicker>
                <label for="email" > Email : </label>
                <input name="email" v-model="employee.email"/>
                <label for="phone" >Mobile Number: </label>
                <input name="phone" v-model="employee.phone"/>
                <label> Department Name : </label>
                <select v-model="employee.departmentId" >
                    <option selected value=""> Select a department </option>
                    <option 
                        v-for="department in this.allDepartments" 
                        :value="department.id" 
                        :key="department.id">
                            {{ department.name }}
                    </option>
                </select>

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
            <tr v-for="employee in allEmployees" :key="employee.id">
                <td>{{ employee.id }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.dob }}</td>
                <td>{{ employee.doj }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.phone }}</td>
                <td>{{ employee.departmentId}}</td>
                <!-- <td>{{ employee['$extras']['name']}}</td> -->
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
import '@vuepic/vue-datepicker/dist/main.css'

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
            toAdd : false,
            toEdit : false,
        };
    },
    methods: {
        // async sortList(value) {
        //     if (value == "asc") {
        //         this.allDepartments.sort(function (a, b) {
        //             let x = a.name.toLowerCase();
        //             let y = b.name.toLowerCase();
        //             if (x < y) {
        //                 return -1;
        //             }
        //             if (x > y) {
        //                 return 1;
        //             }
        //             return 0;
        //         });
        //         console.log(this.allDepartments);
        //     }
        //     else if (value == "desc") {
        //         this.allDepartments.sort((a, b) => {
        //             return b.name - a.name;
        //         });
        //         this.allDepartments.reverse();
        //         console.log(this.allDepartments);
        //     }
        //     else {
        //         return;
        //     }
        //     // const fetchDepartments = await this.instance.get('/department');
        //     // this.allDepartments = fetchDepartments.data;
        // },
        async deleteEmployee(key) {
            console.log(key);
            const toDelete = confirm("Are you sure you want to delete this employee?");
            if (toDelete) {
                //console.log(key);
                const del = this.instance.delete("/employee?id=" + key).catch(err => console.log(err));
                console.log(del);
                const fetchEmployees = await this.instance.get("/employee");
                this.allEmployees = fetchEmployees.data;
            }
        },
        add(){
            this.toAdd = true;
        },
        async addEmployee(){
            console.log(this.employee)
            const result = await this.instance.post('/employee', this.employee).catch(err => console.log(err));
            console.log(result.data);
            const fetchEmployees = await this.instance.get("/employee");
            this.allEmployees = fetchEmployees.data;
            this.toAdd = false;
            this.clearForm();
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
            console.log(this.employee)
            const result = await this.instance.put('/employee', this.employee);
            console.log(result);
            this.toEdit = false;
            this.toAdd = false; 
            const fetchEmployees = await this.instance.get("/employee");
            this.allEmployees = fetchEmployees.data;
        }
       
    },
    async mounted() {
        this.instance = axios.create({
            baseURL: " http://127.0.0.1:3333",
            headers: {
                "API_KEY": "TgGaXtgfdeMlATOdVpCcpXl8TbB79TZ_"
            }
        });
        const fetchEmployees = await this.instance.get("/employee");
        this.allEmployees = fetchEmployees.data;
        console.log(this.allEmployees)
        const fetchDepartments = await this.instance.get("/department");
        this.allDepartments = fetchDepartments.data;
    },
}

</script>

<style scoped>
table{
    width: 800px;
    margin: auto;
}
th{
    background-color: rgb(203, 203, 171);
}

.container{
    padding: 20px;
    width: 800px;
    margin: auto;
}
.options{
    padding-bottom: 20px;
}
button,select{
    padding: 5px;
    margin: 5px;
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
input,select{
  border: 1px solid black ;
  padding: 10px;
  margin: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-right: 12px;
  width: 700px;
  border-radius: 5px;
  font-style: italic;
}
Datepicker{
    color: black;
}
label{
font-size: large;
font-family:Verdana, Geneva, Tahoma, sans-serif;
}

.add{
    margin: 50px;
}
.addBtn{
  position: relative;
  width: 100px;
  padding: 10px;
  font-size: large;
  margin-top: 15px;
  margin-left: 40%;
  background-color: rgb(28, 179, 28);
  border: none;
  border-radius: 5px;
}
</style>

