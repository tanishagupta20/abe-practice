const http = require('http')
const fs = require('fs').promises
const server = http.createServer(async (req, res) => {
    // const data = await fs.readFile('./views/index.html')
    // res.write(data.toString())
    // res.end()
let path = './views/'
    switch (req.url) {
        case '/':
            // path += index.html;
            const data = await fs.readFile('./views/index.html')
            res.write(data.toString())

            res.end()
            
        case '/change':
            fs.readFile("./views/index.html", (error, content) => {
                fs.writeFile('./views/new.html', content, (error) => {
                    console.log(content.toString())
                })
            })

            const cont = await fs.readFile('./views/new.html')
            res.write(cont.toString())


            res.end()
            break
    }
})

server.listen(3000, () => {
    console.log("Server Started!")
})


// ----------------------------------------- //
const http = require('http');
const fs = require('fs')
const _ = require('lodash')

const s = http.createServer((req, res) => {
    // console.log("request made");
    // console.log(req)
    // console.log(req.url, req.method);

    // LODASH
    const num = _.random(0, 20)
    console.log(num)

    const greet = _.once(() =>{
        console.log("hello")
    })
    

    greet()
    greet()
    // response headers give the browser what kinda response is coming back to it -- type of data : text, html, json

    // set header content type
    // res.setHeader('Content-type', 'text/plain')
    // res.setHeader('Content-type', 'text/html');

    // res.write('Hello World')
    // res.write('<p>Hi</p>')
    // res.write('<p>123</p>')
    // res.write(JSON.stringify(['abc', 'def', 'ghi']))

    fs.readFile('./docs/blog.txt', (err, data) => {
        console.log('hi!')
        res.writeHead(200,{'Content-Type' : 'text/plain'})
        res.write(data)
    })

    let path = './views/'
    switch(req.url){
        case '/':
            path += 'index.html'
            res.statusCode = 200;
            break
        case '/about':
            path += 'about.html'
            res.statusCode = 200;
            break
        case '/about-me':
            res.statusCode = 301;
            res.setHeader('Location', './about')
            res.end();
            break
        default :
            path += '404.html'
            res.statusCode = 404;
            break
    }

    // SEND AN HTML FILE
    fs.readFile(path, "UTF-8", (error, data) => {
        if(error){
            console.log(error)
            res.end()
        }
        else{
            // res.write(data)
            res.end(data)
        }
    })
    
    res.end()
});

s.listen(3000, 'localhost', () => {
    console.log("listening for requests on port 3000")
});

// enumerated ports