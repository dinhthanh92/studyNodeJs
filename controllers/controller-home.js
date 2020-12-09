
var Product = require("../model/Product")
var Session = require("../model/Session")
var Customer = require("../model/Customer")
var shortid = require('shortid');
var multer = require('multer');
const session = require("express-session");
var JSAlert = require("js-alert");
const { Schema } = require("mongoose");
const { compile } = require("ejs");
const { product } = require("./controller-admin");
const { mapReduce } = require("../model/Product");


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgPro");

module.exports.home = function (req, res) {
    Session.findOne({ _id: req.session.views }, function (err, datas) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            Product.find(function (err, data) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {

                    res.render("./paperuser/home", { listSession: datas, listproduct: data });
                }
            })
        }
    })
}
module.exports.quannam = function (req, res) {
    Product.find({ cateProduct: 'Quần' }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render('./paperuser/quannam', { listproduct: data });
        }
    })
}
module.exports.aonam = function (req, res) {
    Product.find({ cateProduct: 'Áo' }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render('./paperuser/quannam', { listproduct: data });

        }
    })
}
module.exports.cart = function (req, res) {
    var pro_ids = req.params.proid;
    let sessionss = req.session.views;

    if (!sessionss) {
        res.redirect('/');
    }
    Session.findOne({ _id: sessionss }, function (err, data) {
        if (err) {
            res.send("err find")
        } else {
            var datas = data
            Product.findOne({ _id: pro_ids }, function (err, dataPro) {
                if (err) {
                    res.send("err find pro1")
                } else {
                    var dataPros = dataPro
                    if (datas.cart.length == 0) {
                        datas.cart.push({
                            Product_id: pro_ids,
                            namePro: dataPros.nameProduct,
                            imagePro: dataPros.imgProduct,
                            Quality: 1,
                            Units: dataPros.priceProduct,
                            Price: dataPros.priceProduct
                            
                        })
                        datas.totalPrice = dataPros.priceProduct
                        datas.save()
                        res.redirect("http://localhost:3000/")
                    } else {
                        var indexs = datas.cart.findIndex(indexObj => indexObj.Product_id == pro_ids);
                        if (indexs == -1) {
                            var qualitys = datas.cart[indexs];
                            datas.cart.push({
                                Product_id: pro_ids,
                                namePro: dataPros.nameProduct,
                                imagePro: dataPros.imgProduct,
                                Quality: 1,
                                Units: dataPros.priceProduct,
                                Price: dataPros.priceProduct
                            });
                            datas.totalPrice += dataPros.priceProduct;
                            datas.save();
                            res.redirect("http://localhost:3000/");
                        } else {
                            var qualitys = datas.cart[indexs];
                            qualitys.Quality += 1;
                            qualitys.Price = qualitys.Quality * qualitys.Units
                            datas.totalPrice += dataPros.priceProduct;
                            datas.save()
                            res.redirect("http://localhost:3000/")
                        }
                    }
                }
            })

        }
    })

}
module.exports.viewCart = function (req, res) {
    Session.findOne({ _id: req.session.views }, function (err, data) {
        if (err) {
            console.log("loi find")
        } else {
            if (err) {
                console.log("err find cart")
            } else {
                
                res.render("./paperuser/view-cart", { listcart: data })
            }
        }
    })

}
module.exports.deleteviewCart = function (req, res) {
    Session.findOne({ _id: req.session.views }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err })
        } else {           
            var indexs = data.cart.findIndex(indexObj => indexObj.Product_id == req.params.id);  
                             
            if (data.cart.length === 1) {   
                data.cart.splice(indexs, 1)           
                data.totalPrice = 0;
                data.save();  
                //console.log(index)            
                res.redirect("/view-cart/" + req.session.views)
            } else {         
                data.cart.splice(indexs, 1)      
                let initialValue = 0                              
                data.totalPrice = data.cart.reduce(function (accumulator, currentValue) {
                return accumulator + currentValue.Price
                }, initialValue);
                data.save();
                //console.log(indexs)
                res.redirect("/view-cart/" + req.session.views);
            }
        }
    })
}
module.exports.updatePlusViewCart = function (req, res) {
    Session.findOne({ _id: req.session.views }, function (err, data) {
        if (err) {
            console.log("loi")
        } else {
            var indexs = data.cart.findIndex(indexObj => indexObj.Product_id == req.params.id);
            var index = data.cart[indexs]
            index.Quality += 1;
            index.Price = index.Price + index.Units
            data.totalPrice = data.totalPrice + index.Units;
            data.save();
            res.redirect("/view-cart/" + req.session.views)
        }
    })
}
module.exports.updateMinViewCart = function (req, res) {
    Session.findOne({ _id: req.session.views }, function (err, data) {
        if (err) {
            console.log("loi")
        } else {
            var indexs = data.cart.findIndex(indexObj => indexObj.Product_id == req.params.id);
            var index = data.cart[indexs]
            if (index.Quality === 1) {
                res.redirect("/view-cart/" + req.session.views)
            } else {
                index.Quality -= 1
                index.Price = index.Price - index.Units
                data.totalPrice = data.totalPrice - index.Units;
                data.save();
                res.redirect("/view-cart/" + req.session.views)
            }
        }
    })
}
module.exports.order = function (req, res) {
    Session.findOne({_id: req.session.views}, function(err, data){
       if(err){ 
           res.json({ "kq": 0, "errMsg": err })
        } else {
        res.cookie("customerID", "" + shortid.generate(), {singed:true});
        res.render("./paperuser/order" , {listdata: data})
       }
    })
    
}
module.exports.postorder = function (req, res) {
Session.findOne({_id: req.session.views}, function(err, data){
    if (err){
        res.json({ "kq": 0, "errMsg": err })
    } else{           
        var customer = Customer({
            _id: req.cookies.customerID,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address, 
            product: data.cart,
            total: req.body.total 
        })
        customer.save(function(err){
            if (err){
                res.json({ "kq": 1, "errMsg": err })
            } else{          
                res.redirect("http://localhost:3000/")
            }
        }) 
    }  
})
    
}