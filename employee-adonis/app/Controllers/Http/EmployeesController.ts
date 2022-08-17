 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Employee from 'App/Models/Employee';
import EmployeeValidator from 'App/Validators/EmployeeValidator'
import { DateTime } from 'luxon';

export default class EmployeesController {
    
    public async store({request,response} : HttpContextContract){

        const valResult = await request.validate(EmployeeValidator).catch(err => response.badRequest(err.messages));
        console.log(valResult);
        const newEmployee = new Employee();
        try{
            await newEmployee.fill({
                name : request.input('name'),
                dob : request.input('dob'),
                doj : request.input('doj'),
                email : request.input('email'),
                phone : request.input('phone'),
                departmentId : request.input('departmentId'),
                createdAt : DateTime.now(),
                updatedAt : DateTime.now()

            }).save()
            return "Employee added successfully"
        }catch{
            return "Employee already exists"
        }
        
    }

    public async fetch(){
        const allEmployees = await Database
                                .from('employees')
                                .join('departments','employees.department_id','=','departments.id')
                                .select('employees.id')
                                .select('employees.name')
                                .select('employees.dob')
                                .select('employees.doj')
                                .select('employees.email')
                                .select('employees.phone')
                                .select('departments.id')
        // const allEmployees = await Employee.query()
        //                                    .join('departments', 'employees.department_id', 'departments.id');
        console.log(allEmployees[0].$extras)
        if(allEmployees[0] == null){
            return "No employees to show"
        }
        return allEmployees;

    }

    public async update({request, response} : HttpContextContract){
        const valResult = await request.validate(EmployeeValidator).catch(err => response.badRequest(err.messages));
        console.log(valResult);
        try{
            const employee = await Employee.findOrFail(Number(request.input('id')));
            employee.name = request.input('name');
            employee.dob = request.input('dob');
            employee.doj = request.input('doj');
            employee.email = request.input('email');
            employee.phone = request.input('phone');
            employee.departmentId = Number(request.input('departmentId'));
            employee.updatedAt = DateTime.now();
            await employee.save();
            return 'Employee details successfully updated'
        }catch{
            return 'Employee doesnot exists'
        }
    }

    public async delete({request} : HttpContextContract){
        try{
            const employee = await Employee.findOrFail(Number(request.input('id')));
            await employee.delete();
            return 'Employee deleted successfully'
        }catch{
            return 'Employee doesnot exists'
        }
    }
}
