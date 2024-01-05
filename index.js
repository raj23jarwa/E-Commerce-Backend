const express = require('express');
const cors = require('cors');
const User = require('./db/user');
const Product =require('./db/product');
require('./db/config');

const app = express();

// Middleware for parsing JSON in request body
app.use(express.json());
app.use(cors());

// Define a route for handling GET requests to "/signup"
app.get("/signup", (req, resp) => {
    resp.send("GET request to /signup");
});

// Define a route for handling POST requests to "/signup"
app.post("/signup", async (req, resp) => {
    try {
        let user = new User(req.body);
        // Save the new user to the database
        let result = await user.save();
        result = result.toObject();
        delete result.password;
        resp.send(result);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: "Error saving user to the database" });
    }
});
// Loginapi
app.get("/login", (req, resp) => {
    resp.send("GET request to /signup");
});
app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: 'No user found Please signup first' });
        }
    }
});
// add-product api

app.post("/add-product", async(req,resp)=>{
    let product = new Product(req.body);
    let result =await product.save();
    resp.send(result);
})
// Product list api

app.get("/products",async(req,resp)=>{
    let products=await Product.find();
    if(products.length>0){
        resp.send(products);
    }
    else{
        resp.send({result:"No Products found"})
    }
})

// Delete product api
app.delete("/product/:id",async(req,resp)=>{
    // resp.send(req.params.id);
    const result=await Product.deleteOne({_id:req.params.id})
    resp.send(result);

})
// api for single get product
app.get("/product/:id",async(req,resp)=>{
    let result =await Product.findOne({_id:req.params.id});
    if(result){
        resp.send(result)
    }
    else{
        resp.send({result:"No record found"})
    }
})

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
