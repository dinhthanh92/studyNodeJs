var Category = require("../model/Category")
var multer = require('multer');
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

module.exports.category = function (req, res) {
    Category.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("category/category", { listcategory: data });
        }
    })

};
module.exports.cateAdd = function (req, res) {
    res.render("category/add-cate")
};
module.exports.postCateAdd = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            var category = Category({
                nameCategory: req.body.nameCate,
            });
            category.save(function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.redirect('/admin/category');
                }
            })
        }

    });
};
module.exports.cateEdit = function (req, res) {
    Category.findById(req.params.id, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render('category/edit-cate', { Category: data });
        }
    })
}
module.exports.postCateEdit = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            Category.updateOne({ _id: req.body.idCate }, {
                nameCategory: req.body.nameCate,
            }, function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.redirect('/admin/category');
                }
            });
        }
    });
};
module.exports.cateDelete = function (req, res) {
    Category.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.redirect('/admin/category');
        }
    })
};
