 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Employee from 'App/Models/Employee';
import EmployeeValidator from 'App/Validators/EmployeeValidator'

export default class EmployeesController {
    
    public async store({request,response} : HttpContextContract){

        const validatedInput = await request.validate(EmployeeValidator).catch(err => response.badRequest(err.messages));
        const newEmployee = new Employee();
        try{
            await newEmployee.fill({
                name : validatedInput['name'],
                dob : validatedInput['dob'],
                doj : validatedInput['doj'],
                email : validatedInput['email'],
                phone : validatedInput['phone'],
                departmentId : validatedInput['departmentId']

            }).save()
            return "Employee added successfully"
        }catch{
            return "Employee already exists"
        }
        
    }

    public async fetch(){
                                
        const allEmployees = await Employee.query()
                                           .join('departments', 'departments.id','employees.department_id')
                                            .select('departments.name as departmentName' )
                                            .select('employees.id')
                                            .select('employees.name')
                                            .select('employees.dob')
                                            .select('employees.doj')
                                            .select('employees.email')
                                            .select('employees.phone');
    
        const allDetails : any = []

        allEmployees.forEach((element) => {
            allDetails.push({
                name : element.$attributes['name'],
                id : element.$attributes['id'],
                dob : element.$attributes['dob'],
                doj : element.$attributes['doj'],
                email : element.$attributes['email'],
                phone : element.$attributes['phone'],
                departmentName : element.$extras['departmentName']
            })
        })

        console.log(allDetails)
        if(allDetails == null){
            return "No employees to show"
        }
        return allDetails;

    }
    public async show({request} : HttpContextContract){
        try{
            const employee = await Employee.findOrFail(Number(request.input('id')));
            return employee;
        }catch{
            return "Employee doesnot exists"
        }
    }
    public async update({request, response} : HttpContextContract){
        const validatedInput = await request.validate(EmployeeValidator).catch(err => response.badRequest(err.messages));
        try{
            const employee = await Employee.findOrFail(Number(request.input('id')));
            employee.name = validatedInput['name'];
            employee.dob =  validatedInput['dob'];
            employee.doj =  validatedInput['doj'];
            employee.email =  validatedInput['email'];
            employee.phone =  validatedInput['phone'];
            employee.departmentId =  validatedInput['departmentId'];
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
