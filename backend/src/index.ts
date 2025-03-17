import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()


app.post('/api/v1/signup', (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();

await prisma.user.create({
  data: {
    email: body.email,
    password: body.password,
  }
})
  return c.text('Signup')
})

app.post('/api/v1/signin', (c) => {
  return c.text('signin')
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
