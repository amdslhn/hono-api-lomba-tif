import { MiddlewareHandler} from "hono";
import { getCookie } from "hono/cookie";
import * as jwt from "jsonwebtoken";

const authadmin : MiddlewareHandler = async (c, next) => {
    const tokencookie = getCookie(c, "token")
    const secreet = Bun.env.ACCESS_TOKEN_SECRET
    if(!tokencookie){
        return c.json({
            status : "error",
            message : "Token missing"
        }, 401)
    }
    if(!secreet){
        return c.json({
            status : "error",
            message : "Missing secreet token"
        }, 401)
    }
    try{
        const decode = jwt.verify(tokencookie, secreet)
        c.set("user", decode)
        const role = c.get("user").role
        if(role !== "ADMIN"){
            return c.json({
                status : "error",
                message : "Anda bukan admin"
            },401)  
        }
        await next()
    }catch(e){
        return c.json ({
            status : "error",
            message : "Invalid token"
        },401)

    }
   
}

export default authadmin;