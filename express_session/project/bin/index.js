var express = require("express");
var redis = require("redis");
var mysql = require("mysql");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require("path");
var async = require("async");
var unirest = require('unirest');
var os = require('os');

var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_SERVER);
var app = express();
var router = express.Router();

console.log("REDIS_SERVER :", process.env.REDIS_SERVER);
console.log("REDIS_PORT: ", process.env.REDIS_PORT);

client.on('connect', function () {
    console.log("Redis connected: ");
});
client.on('error', function (err) {
    console.log("Redis Error: ", err);
});

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'mysql',
    user: 'root',
    password: 'tbdtest',
    database: 'redis_demo',
    debug: false
});

app.set('views', path.join(__dirname, '../', 'views'));
app.engine('html', require('ejs').renderFile);

app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({host: process.env.REDIS_SERVER, port: process.env.REDIS_PORT, client: client, ttl: 3600000}),
    cookie: {maxAge: 3600000},
    saveUninitialized: false,
    resave: false
}));

app.use(cookieParser("secretSign#143_!223"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

console.log("MACHINE_NAME::::::::::>> ", process.env.MACHINE_NAME);
router.get('/', function (req, res) {
    var result = req.session["counter"];
    if (result !== undefined) {
        result += 1;
    } else {
        result = 0;
    }
    req.session["counter"] = result;
    getValuePoolnode(function (cb) {
        console.timeEnd("PoolNode Time");
        res.render('index.ejs', {
            counter: result,
            value: JSON.stringify(cb.value),
            time: cb.time,
            master: process.env.MACHINE_NAME,
            machinename: cb.hostname
        });
    });
});

function getValuePoolnode(callback) {
    var URL = `http://${process.env.IP_LOCAL_HOST}:3003/Render/renderCmp`;
    unirest.get(URL).end(function (response) {
        if (response.body) {
            callback(response.body);
        } else {
            callback(null);
        }
    });
}

function handle_database(req, type, callback) {
    async.waterfall([
        function (callback) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    callback(true);
                } else {
                    callback(null, connection);
                }
            });
        },
        function (connection, callback) {
            var SQLquery;
            switch (type) {
                case "login" :
                    SQLquery = "SELECT * from user_login WHERE user_email='" + req.body.user_email + "' AND `user_password`='" + req.body.user_password + "'";
                    break;
                case "checkEmail" :
                    SQLquery = "SELECT * from user_login WHERE user_email='" + req.body.user_email + "'";
                    break;
                case "register" :
                    SQLquery = "INSERT into user_login(user_email,user_password,user_name) VALUES ('" + req.body.user_email + "','" + req.body.user_password + "','" + req.body.user_name + "')";
                    break;
                case "addStatus" :
                    SQLquery = "INSERT into user_status(user_id,user_status) VALUES (" + req.session.key["user_id"] + ",'" + req.body.status + "')";
                    break;
                case "getStatus" :
                    SQLquery = "SELECT * FROM user_status WHERE user_id=" + req.session.key["user_id"];
                    break;
                default :
                    break;
            }
            callback(null, connection, SQLquery);
        },
        function (connection, SQLquery, callback) {
            connection.query(SQLquery, function (err, rows) {
                connection.release();
                if (!err) {
                    if (type === "login") {
                        callback(rows.length === 0 ? false : rows[0]);
                    } else if (type === "getStatus") {
                        callback(rows.length === 0 ? false : rows);
                    } else if (type === "checkEmail") {
                        callback(rows.length === 0 ? false : true);
                    } else {
                        callback(false);
                    }
                } else {
                    callback(true);
                }
            });
        }
    ], function (result) {
        if (typeof(result) === "boolean" && result === true) {
            callback(null);
        } else {
            callback(result);
        }
    });
}

router.post('/login', function (req, res) {
    console.log("From Login");
    handle_database(req, "login", function (response) {
        console.log("------------->>> ", response);
        if (response === null) {
            res.json({"error": "true", "message": "Database error occured"});
        } else {
            if (!response) {
                res.json({"error": "true", "message": "Login failed ! Please register"});
            } else {
                req.session.key = response;
                res.json({"error": false, "message": "Login success."});
            }
        }
    });
});

router.get('/home', function (req, res) {
    if (req.session.key) {
        res.render("home.ejs", {email: req.session.key["user_name"]});
    } else {
        res.redirect("/");
    }
});


router.get("/fetchStatus", function (req, res) {
    if (req.session.key) {
        handle_database(req, "getStatus", function (response) {
            if (!response) {
                res.json({"error": false, "message": "There is no status to show."});
            } else {
                res.json({"error": false, "message": response});
            }
        });
    } else {
        res.json({"error": true, "message": "Please login first."});
    }
});

router.post("/addStatus", function (req, res) {
    console.log("From AddStatus ", "session", req.session.key);
    if (req.session.key) {
        handle_database(req, "addStatus", function (response) {
            if (!response) {
                res.json({"error": false, "message": "Status is added."});
            } else {
                res.json({"error": false, "message": "Error while adding Status"});
            }
        });
    } else {
        res.json({"error": true, "message": "Please login first."});
    }
});

router.post("/register", function (req, res) {
    handle_database(req, "checkEmail", function (response) {
        if (response === null) {
            res.json({"error": true, "message": "This email is already present"});
        } else {
            handle_database(req, "register", function (response) {
                if (response === null) {
                    res.json({"error": true, "message": "Error while adding user."});
                } else {
                    res.json({"error": false, "message": "Registered successfully."});
                }
            });
        }
    });
});

router.get('/logout', function (req, res) {
    if (req.session.key) {
        // req.session.destroy(function(){
        //  res.redirect('/');
        // });
        // } else {
        res.redirect('/');
    }
});

app.use('/', router);

app.listen(3000, function () {
    console.log("I am running at 3000");
});