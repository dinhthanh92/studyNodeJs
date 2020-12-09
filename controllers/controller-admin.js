var Product = require("../model/Product")
var Category = require("../model/Category")
var User = require("../model/User")
var shortid = require('shortid');
var multer = require('multer');
const { db, getMaxListeners, findOne } = require("../model/Product");
const { render } = require("ejs");

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

module.exports.admin = function (req, res) {
    res.render("admin-page")
};
module.exports.addProduct = function (req, res) {
    Category.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("product/add", { listcategory: data });
        }
    })
};
module.exports.postAddProduct = function (req, res) {
    upload(req, res, function (err) {

        if (!req.file) {
            var product = Product({
                nameProduct: req.body.namePro,
                cateProduct: req.body.catePro,
                priceProduct: req.body.pricePro,
            });
            product.save(function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.redirect('/admin/product');
                }
            });
        } else {

            if (err instanceof multer.MulterError) {
                res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
            } else if (err) {
                res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
            } else {
                var product = Product({
                    nameProduct: req.body.namePro,
                    cateProduct: req.body.catePro,
                    priceProduct: req.body.pricePro,
                    imgProduct: req.file.filename
                });
                product.save(function (err) {
                    if (err) {
                        res.json({ "kq": 0, "errMsg": err });
                    } else {
                        res.redirect('/admin/product');
                    }
                })
            }
        }
    });
};
module.exports.product = function (req, res) {
    Product.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("product/product", { listproduct: data });
        }
    })

};
module.exports.proEdit = function (req, res) {
    Category.find(function (err, pro) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            Product.findById(req.params.id, function (err, data) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.render('product/edit-pro', { Product: data, listcategory: pro })
                }
            })

        }
    })
}
module.exports.postProEdit = function (req, res) {
    upload(req, res, function (err) {
        if (!req.file) {
            Product.updateOne({ _id: req.body.idPro }, {
                nameProduct: req.body.namePro,
                cateProduct: req.body.catePro,
                priceProduct: req.body.pricePro,
            }, function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.json({success: true});
                }
            });
        } else {
            if (err instanceof multer.MulterError) {
                res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
            } else if (err) {
                res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
            } else {
                Product.updateOne({ _id: req.body.idPro }, {
                    nameProduct: req.body.namePro,
                    cateProduct: req.body.catePro,
                    priceProduct: req.body.pricePro,
                    imgProduct: req.file.filename
                }, function (err) {
                    if (err) {
                        res.json({ "kq": 0, "errMsg": err });
                    } else {
                        res.redirect('/admin/product');
                    }
                });
            }
        }
    });
};
module.exports.proDelete = function (req, res) {
    Product.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.redirect('/admin/product');
        }
    })
};
module.exports.login = function (req, res) {
    
    res.render("user/login")
}
module.exports.postlogin = function (req, res) {
    var usernames = req.body.username;
    var password = req.body.password;
    User.findOne({ username: usernames }, function (err, data) {
        if (err) {
            res.send("err find")
        } else {
            if (data === null) {
                res.send("username sai")
                return;
            }
            if (data.password !== password) {
                res.send("password sai")
            } else {
                
                res.cookie("userID", "" + shortid.generate(), {singed:true});
                res.redirect("/user")
                
            }
        }
    })
};

module.exports.deleteuser = function (req, res) {
    User.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.redirect('/user');
        }
    })
}

module.exports.dangky = function (req, res) {
    res.render("user/dangky");
}
module.exports.postdangky = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            var user = User({
                username: req.body.username,
                password: req.body.password,
            });
            User.findOne({username: user.username}, function(err, data){
                if (err){
                    res.send("username ton tai")
                } else {
                    if (data!==null){
                        res.send("username ton tai" + user.username)
                    } else(
                        user.save(function (err) {
                            if (err) {
                                res.json({ "kq": 0, "errMsg": err });
                            } else {
                                res.redirect('user');
                            }
                        })
                    )
                }
            })
        }

    });
};

module.exports.user = function (req, res) {
    User.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("user/user", { listuser: data });
        }
    })
};

module.exports.userEdit = function (req, res) {
    User.findById(req.params.id, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("user/edit", { listuser: data })
        }
    })
}
module.exports.postUserEdit = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            User.updateOne({ _id: req.body.idUser }, {
                username: req.body.username,
                password: req.body.password
            }, function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.redirect('/user');
                }
            });
        }
    });
}
