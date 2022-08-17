
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { appKey } from 'Config/app'

export default class Auth {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    
    if(appKey !== request.header('API_KEY'))
    {
      response.unauthorized({ error : "Not an authorised user" });
      return ;
    }
    await next()
  }
}
