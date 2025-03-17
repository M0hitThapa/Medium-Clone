import { Hono } from 'hono'

const app = new Hono()


app.post('/api/v1/signup', (c) => {
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
