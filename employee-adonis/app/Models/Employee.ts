import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public dob:Date

  @column()
  public doj:Date

  @column({})
  public email:string

  @column()
  public phone:string

  @column()
  public departmentId:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



}
