import express from "express";
import bcrypt from 'bcrypt'
import cors from "cors"
import axios from "axios";
import pg from 'pg'
import 'dotenv/config'
const { Pool } = pg
const app = express()
const port = 5000
import jwt from 'jsonwebtoken'

app.use(cors())
app.use(express.json())

// here
const pool = new Pool({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})


app.get('/getProducts', async (req, res) => {
    try {
        const url = 'https://fakestoreapi.com/products';
        const response = await axios.get(url);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const authorize = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if(token == null) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user // you get back exactly what you serialize, deserialized
        next()
    })
}

app.post('/delete/:id', authorize, async (req,res) => {
    const id = req.params.id
    const client = await pool.connect();
    let status_code = 200
    try {
        const deleteQuery = `DELETE FROM shopping_cart WHERE id = $1 AND email = $2;`
        await client.query(deleteQuery,[id, req.user.email])
    } catch (error) {
        console.log(error)
        status_code = 500
    } finally {
        client.release()
    }
    return res.status(status_code).send()
})

app.post('/empty', authorize, async (req,res) => {
    const email = req.user.email
    const client = await pool.connect();
    let status_code = 200;
    try {
        const emptyCartQuery = `DELETE FROM shopping_cart WHERE email = $1;`
        await client.query(emptyCartQuery,[email])
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }
    return res.status(status_code).send()
})

app.post('/update', authorize, async (req,res) => {
    const id = req.body.id
    const quantity = req.body.quantity
    const client = await pool.connect()
    let status_code = 200;
    try {
        const updateQuery = `UPDATE shopping_cart SET quantity = $1 WHERE id = $2 AND email = $3;`
        await client.query(updateQuery, [quantity,id,req.user.email])
    } catch (error) {
        console.log(error)
    } finally {
        client.release()
    }
    return res.status(status_code).send()
})


app.post('/add', authorize, async (req, res) => {
    const product = req.body.product;
    const qty = req.body.quantity;
    const client = await pool.connect();
    let status_code = 200;
    let message;

    try {
        const productQuery = `
            INSERT INTO products (id, title, price, description, category, image, rating_rate, rating_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING;
        `;
        const productValues = [
            product.id, product.title, product.price, product.description,
            product.category, product.image, product.rating.rate, product.rating.count
        ];
        await client.query(productQuery, productValues);

        const cartQuery = `
            INSERT INTO shopping_cart (email, id, quantity)
            VALUES ($1, $2, $3);
        `;
        const cartValues = [req.user.email, product.id, qty];
        await client.query(cartQuery, cartValues);

        message = 'Added to cart';
    } catch (error) {
        console.error(error);
        status_code = 500;
        message = 'An error occurred';
    } finally {
        client.release();
    }

    return res.status(status_code).json({ message });
});


app.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const client = await pool.connect();
    let message = ""
    let status_code = 200
    try {
        await client.query(`INSERT INTO users (email,password) VALUES ('${req.body.email}','${hashedPassword}')`)
        message = "User created"
    } catch (error) {
        console.error(error)
        if(error.code == 23505) message = "User already exists"
        status_code = 401
    } finally {
        client.release();
    }
    return res.status(status_code).json({message})
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

app.post('/refreshToken', async (req,res) => {
    const client = await pool.connect();
    try {
        const checkRefreshValidQuery = `SELECT * FROM refresh_tokens WHERE token = $1`;
        const response = await client.query(checkRefreshValidQuery,[req.body.refreshToken])
        if(response.rowCount == 0){
            return res.sendStatus(401)
        }
        jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
            if(err) res.sendStatus(403);
            const newAccessToken = generateAccessToken({email: user.email})
            res.status(200).json({accessToken: newAccessToken})
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(403);
    } finally {
        client.release()
    }
})

app.delete('/logout', async (req,res) => {
    const refreshToken = req.body.refreshToken
    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM refresh_tokens WHERE token = $1;`, [refreshToken])
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(403)
    } finally {
        client.release()
    }
})

app.get('/cart/:userEmail', authorize, async (req, res) => {
    const client = await pool.connect();
    const userEmail = req.params.userEmail
    try {
        const getCart = await client.query(`SELECT 
                p.id, 
                p.title, 
                p.price, 
                p.description,
                p.category,
                p.image,
                p.rating_count,
                p.rating_rate,
                s.quantity
            FROM 
                shopping_cart s
            JOIN 
                products p ON s.id = p.id
            JOIN 
                users u ON s.email = u.email
            where u.email = '${userEmail}';`)
        const items = getCart.rows;
        res.status(200).json({items})
    } catch (error) {
        console.log(error)
        res.sendStatus(401)
    } finally {
        client.release()
    }
})

app.post('/login', async (req, res) => {
    const client = await pool.connect();
    try {
        const getUsers = await client.query("SELECT * FROM users");
        const users = getUsers.rows;
        const user = users.find(user => user.email === req.body.email)
        if (user == null) return res.status(401).json({message: "User not found"});
        if (await bcrypt.compare(req.body.password, user.password)) { 
            const userObj = { email: req.body.email }
            const accessToken = generateAccessToken(userObj)
            const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET)
            await client.query(`INSERT INTO refresh_tokens (token) VALUES ($1);`,[refreshToken])
            const getCart = await client.query(`SELECT 
                p.id, 
                p.title, 
                p.price, 
                p.description,
                p.category,
                p.image,
                p.rating_count,
                p.rating_rate,
                s.quantity
            FROM 
                shopping_cart s
            JOIN 
                products p ON s.id = p.id
            JOIN 
                users u ON s.email = u.email
            where u.email = '${req.body.email}';`)
            const items = getCart.rows;
            res.status(200).json({ message: "Logged in", items, accessToken, refreshToken }) 
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Incorrect password" })
    } finally {
        client.release();
    }
})

app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}`);
})