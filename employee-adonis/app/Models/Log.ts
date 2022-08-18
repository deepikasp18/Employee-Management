import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public action: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public performedAt: DateTime
}
