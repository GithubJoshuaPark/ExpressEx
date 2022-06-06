### Express framework Exercising building http server
---
> Express framework 사용하여 http server 구축하기 (**2h 지점s**)
[ref Node.js Full Course for Beginners | Complete All-in-One Tutorial | 7 Hours](https://www.youtube.com/watch?v=f2EqECiTBL8)
---
> expressjs.com 
> install express
```
  $npm i express
  $npm i nodemon -g
  $npm i nodemon -D
  $npm i date-fns
  $npm i uuid
  $npm i cors
```
> server.js에 기본적인 middleware 사용설정
```javascript
// built-in middleware to handle urlencoded data
// in other words, form data:L
// 'cotent-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}))

// built-in middleware for json
app.use(express.json())

// serve static files(css, images, js, text)
app.use('/',express.static(path.join(__dirname, '/public')))
```

---
> Let's make Rest API (return json format)
> for rest api, make Model (json files), Controller file, routes file
> this routes file do not response html, but json
```javascript
  // Within the controller file
  // it should implement five rest api mostly,
  // getAll, get, post, put, delete
```

---
> Authentication, Authorization
> ① make registerController, authController
> ② make routes for register, auth
> ③ add router handler in the server.js
```
  $npm i bcrypt
```

---
> JWT (JSON Web Token) usage
```
  $npm i dotenv 
  $npm i jsonwebtoken 
  $npm i cookie-parser
```
> make .env file at the root level
> make two token value using node util

```javascript
// (within termianl)
  $node
  > require('crypto').randomBytes(64).toString('hex')
```
---
> Using Cloud MongoDB
> 1. Make account in cloud.mongodb.com
> 2. Make cluster(cluster0), db(companyDB), collection(employee)
> 3. Make some users (soro123/soro123)
> 4. copy connection string and paste it into .env file
```
  $npm i mongoose
```
[ref mongoosejs.com](https://cloud.mongodb.com/)