

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/','EmployeesController.fetch')
    Route.post('/', 'EmployeesController.store')
    Route.get('/show', 'EmployeesController.show')
    Route.put('/', 'EmployeesController.update')
    Route.delete('/', 'EmployeesController.delete')
    Route.get('/orderbyname', 'EmployeesController.orderByName')
    Route.get('/orderbydepartment', 'EmployeesController.orderByDepartment')
  }).prefix('employee')
  
  Route.group(() => {
    Route.get('/','DepartmentsController.fetch');
    Route.post('/', 'DepartmentsController.store');
    Route.get('/show', 'DepartmentsController.show')
    Route.put('/', 'DepartmentsController.update');
    Route.delete('/', 'DepartmentsController.delete');
    Route.get('/orderby', 'DepartmentsController.orderBy');
  }).prefix('department')
}).middleware('auth')



