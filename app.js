const http=require('http')
const {readFile}=require('fs');

const homePage=readFile('./index.html')

const server=http.createServer((req, res)=>{
  const url=req.url
  if(url==='/'){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(homePage)
    res.end()
  } else if(url==='/about'){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('<h1>about page</h1>')
    res.end()
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.write('<h1>page not found</h1>')
    res.end()
  }
})

server.listen(5000, () => {
   console.log('Server is running on http://localhost:5000')
})
   