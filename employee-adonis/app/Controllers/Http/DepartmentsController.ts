 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department';
import DepartmentValidator from 'App/Validators/DepartmentValidator'
import { DateTime } from 'luxon';

export default class DepartmentsController {
    
    public async store({request,response}:HttpContextContract){

        await request.validate(DepartmentValidator).catch(err => response.badRequest(err.messages));
        const newDepartment = new Department();
        try{
            newDepartment.fill({
                name: request.input('name'),
                createdAt : DateTime.now(),
                updatedAt : DateTime.now(),
            }).save();
            return "Department added successfully"
        }catch{
            return "Department already exists"
        }
    }

    public async fetch(){

        const departments = await Department.all();
        if(departments[0] == null){
            return "No department to show"
        }
        return departments;
    }

    public async show({request} : HttpContextContract){
        try{
            const department = await Department.findOrFail(Number(request.input('id')));
            return department;
        }catch{
            return "Department doesnot exists"
        }
    }
    public async update({request, response} : HttpContextContract){

        await request.validate(DepartmentValidator).catch(err => response.badRequest(err.messages));
        try{
            const department = await Department.findOrFail(request.input('id'));
            department.name = request.input('name');
            department.updatedAt = DateTime.now();
            await department.save();
            return "Department name successfully updated"
        }catch{
            return "Department doesnot exists"
        }
    }

    public async delete({request} : HttpContextContract){

        try{
            const department = await Department.findOrFail(request.input('id'));
            await department.delete();
            return "Department successfully deleted"
        }catch{
            return "Department doesnot exists"
        }
    }
}
