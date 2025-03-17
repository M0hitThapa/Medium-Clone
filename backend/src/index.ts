import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>()


app.post('/api/v1/signup', async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();

const user = await prisma.user.create({
  data: {
    email: body.email,
    password: body.password,
  }
})
const token = await sign({ id: user.id}, c.env.JWT_SECRET)
  return c.json({
    jwt: token
  })
})

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())


const body = await c.req.json();
const user = await prisma.user.findUnique({
  where: {
    email:body.email,
    password:body.password
  }
});

if(!user) {
  c.status(403);
  return c.json({error:"user not found"})
}
const jwt = await sign({ id: user.id},c.env.JWT_SECRET);
  return c.json({jwt});
})

app.post('/api/v1/blog', (c) => {
  return c.text('blog1')
})

app.put('/api/v1/blog', (c) => {
  return c.text('blog2')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('this is blog')
})




export default app
