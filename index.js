var express = require('express');
//var shortid = require('shortid');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')


//var session = require('express-session')
var app = express();
var controller = require("./controllers/controller-admin");
var controllerCate = require("./controllers/controller-category");
var controllerUser = require("./controllers/controller-home");
var controllerMid = require("./controllers/middleware");
var controller_session = require("./controllers/session");
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}))

//body-parser
var bodyParser = require('body-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(controller_session)

app.set("view engine", "ejs");
app.set("views", "./views")
app.listen(3000)

//connect mongoosejs
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.jc001.mongodb.net/NodeJs?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if (err){
        console.log("connect fail" + err)
    } else {
        console.log("connect successfull")
    }
});

app.get("/login", controller.login);
app.post("/login", controller.postlogin);

app.get("/dangky", controllerMid.aulogin, controller.dangky);
app.post("/dangky", controllerMid.aulogin, controller.postdangky);

app.get("/user", controllerMid.aulogin, controller.user);
app.get("/user/delete/:id", controllerMid.aulogin, controller.deleteuser);
app.get("/user/edit/:id", controllerMid.aulogin, controller.userEdit);
app.post("/user/edit", controller.postUserEdit);

app.get("/admin/product/add", controllerMid.aulogin, controller.addProduct);
app.post("/admin/product/add", controller.postAddProduct);
app.get("/admin", controllerMid.aulogin, controller.admin);
app.get("/admin/product", controllerMid.aulogin, controller.product);
app.get("/admin/product/edit/:id", controllerMid.aulogin, controller.proEdit)
app.post("/admin/product/edit", controller.postProEdit);
app.get("/admin/product/delete/:id", controllerMid.aulogin, controller.proDelete)

app.get("/admin/category", controllerMid.aulogin, controllerCate.category);
app.get("/admin/category/add", controllerMid.aulogin, controllerCate.cateAdd);
app.post("/admin/category/add", controllerCate.postCateAdd);
app.get("/admin/category/edit/:id", controllerMid.aulogin, controllerCate.cateEdit);
app.post("/admin/category/edit", controllerCate.postCateEdit);
app.get("/admin/category/delete/:id", controllerMid.aulogin, controllerCate.cateDelete);

app.get("/", controllerUser.home);
app.get("/quan-nam", controllerUser.quannam);
app.get("/ao-nam", controllerUser.aonam);
app.get("/cart/:proid", controllerUser.cart);
app.get("/view-cart/:id", controllerUser.viewCart)
app.get("/view-cart/delete/:id", controllerUser.deleteviewCart)
app.get("/view-cart/update/plus/:id", controllerUser.updatePlusViewCart)
app.get("/view-cart/update/min/:id", controllerUser.updateMinViewCart)
app.get("/view-cart/order/:id", controllerUser.order) 
app.post("/view-cart/order", controllerUser.postorder) 




