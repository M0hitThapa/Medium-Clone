import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();
blogRouter.use('/', async (c, next) => {
const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id as string);
    next();
  } else {
    c.status(403)
    return c.json({error: "unauthorized"})
  }
  await next();
})



blogRouter.post('/', async (c) => {

    const authorId =  c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content:body.content,
            authorId:authorId,
        }
    })
    return c.json({
        id: blog.id
    })
})


  
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content:body.content,
            
        }
    })
    return c.json({
        id: blog.id
    })
})
  
blogRouter.get('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const blog = await prisma.post.findFirst({
        where: {
            id:body.id
        },
        
    })
    return c.json({
       blog
    })
})


blogRouter.get("/bulk",async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany();

    return c.json({
        blogs
    })
})
  