<template>
    <div class="container">
        <div class="options"> 
            <select @change="sortList(value)">
                <option selected value=""> ORDER BY </option> 
                <option value="asc"> ASC </option>
                <option value="desc "> DESC </option>
            </select>
            <button @click="add"> ADD </button>
            <div class="add" v-if="toAdd">
                <br/>
                
                <label for="name" v-if="toEdit">Update Department Name : </label>
                <label for="name" v-else>Enter Department Name : </label>
                <input name="name" v-model="this.department.name"/>
                <button type="submit" class="addBtn" @click="updateDepartment" v-if="toEdit"> Update  </button>
                <button type="submit" class="addBtn" @click="addDepartment" v-else> Add  </button>
                
            </div>
        </div>
        <div class="table">
            <table border="1"> 
            <thead>
            <tr>
                <th> Department ID </th>
                <th> Department Name </th>
                <th> Action </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="department in allDepartments" :key="department.id">
                <td>{{ department.id }}</td>
                <td>{{ department.name }}</td>
                <td>
                <button class="editBtn" @click="editDepartment(department.id)">edit</button>
                <button class="deleteBtn" @click="deleteDepartment(department.id)">delete</button>
            </td>
            </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default{
    name: "DepartmentManagement",
    data() {
        return {
            instance: null,
            department: {
                id : "",
                name: "",
                createdAt : "",
                updatedAt : ""
            },
            allDepartments: [],
            toAdd : false,
            toEdit : false,
        };
    },
    methods: {
        async sortList(value) {
            if (value == "asc") {
                this.allDepartments.sort(function (a, b) {
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
                console.log(this.allDepartments);
            }
            else if (value == "desc") {
                this.allDepartments.sort((a, b) => {
                    return b.name - a.name;
                });
                this.allDepartments.reverse();
                console.log(this.allDepartments);
            }
            else {
                return;
            }
            // const fetchDepartments = await this.instance.get('/department');
            // this.allDepartments = fetchDepartments.data;
        },
        async deleteDepartment(key) {
            console.log(key);
            const toDelete = confirm("Are you sure you want to delete this employee?");
            if (toDelete) {
                console.log(key);
                const del = this.instance.delete("/department?id=" + key).catch(err => console.log(err));
                console.log(del);
                const fetchDepartments = await this.instance.get("/department");
                this.allDepartments = fetchDepartments.data;
            }
        },
        add(){
            this.toAdd = true;
        },
        async addDepartment(){
            const result = await this.instance.post('/department', {name : this.department.name}).catch(err => console.log(err));
            console.log(result.data);
            const fetchDepartments = await this.instance.get("/department");
            this.allDepartments = fetchDepartments.data;
            this.toAdd = false;
            this.clearForm();
        },
        clearForm(){
            this.department.name = ''
        },
        async editDepartment(key){
            const fetchDepartment = await this.instance('/department/show?id='+key).catch(err => console.log(err));
            this.department = fetchDepartment.data;
            this.toEdit = true;
            this.toAdd = true;
        },
        async updateDepartment(){
            console.log(this.department)
            const result = await this.instance.put('/department', this.department);
            console.log(result);
            this.toEdit = false;
            this.toAdd = false; 
            const fetchDepartments = await this.instance.get("/department");
            this.allDepartments = fetchDepartments.data;
        }
       
    },
    async mounted() {
        this.instance = axios.create({
            baseURL: " http://127.0.0.1:3333",
            headers: {
                "API_KEY": "TgGaXtgfdeMlATOdVpCcpXl8TbB79TZ_"
            }
        });
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
input{
  padding: 10px;
  margin: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-right: 12px;
  width: 700px;
  border-radius: 5px;
  font-style: italic;
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
