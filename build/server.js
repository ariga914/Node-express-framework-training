"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var express = require("express");
var bodyParser = require("body-parser");
var typeorm_2 = require("typeorm");
var User_1 = require("./entity/User");
var jwt = require("jsonwebtoken");
var console = require("console");
var ormOptions = {
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
    database: 'express-test',
    timezone: 'Z',
    logging: ["query", "error"],
    entities: ['entity/**/*.ts'],
    migrations: ['migration/**/*.ts'],
    migrationsRun: true
};
typeorm_1.createConnection(ormOptions)
    .then(function (value) {
    console.log('3306: [SUCCESS] Database connected!');
    // create express app
    var app = express();
    var TOKEN_SECRET = '5f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4';
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    function generateAccessToken(email) {
        return jwt.sign(email, TOKEN_SECRET, { expiresIn: '1800s' });
    }
    function authenticateToken(req, res, next) {
        var authHeader = req.headers['authorization'];
        var token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            return res.sendStatus(401);
        jwt.verify(token, TOKEN_SECRET, function (err, user) {
            console.log(err);
            if (err)
                return res.sendStatus(403);
            console.log(req.user);
            console.log("=====================");
            req.user = user;
            console.log(user);
            next();
        });
    }
    // Routes Definitions
    app.get("/", function (req, res) {
        res.status(200).send("Hi!. My name is Bi");
    });
    app.get('/listUsers', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userRepository, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userRepository = typeorm_2.getManager().getRepository(User_1.User);
                    return [4 /*yield*/, userRepository.find()];
                case 1:
                    users = _a.sent();
                    // return loaded users
                    res.send(users);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/add', function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userRepository, exisitingUser, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Prepare output in JSON format
                        console.log(req.body);
                        user = {
                            email: req.body.email,
                            name: req.body.name,
                            password: req.body.password,
                            profession: req.body.profession
                        };
                        userRepository = typeorm_2.getManager().getRepository(User_1.User);
                        return [4 /*yield*/, userRepository.find({
                                where: {
                                    'email': req.body.email,
                                    'password': req.body.password
                                }
                            })];
                    case 1:
                        exisitingUser = _a.sent();
                        //return mesg if user is not exisiting
                        if (exisitingUser && exisitingUser.length > 0) {
                            res.send("Emial is exisisting, Please input another email!");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        users = _a.sent();
                        // return loaded users
                        res.send(users);
                        return [2 /*return*/];
                }
            });
        });
    });
    app.get('/:id', authenticateToken, function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userRepository, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userRepository = typeorm_2.getManager().getRepository(User_1.User);
                        return [4 /*yield*/, userRepository.findOne(+req.params.id)];
                    case 1:
                        user = _a.sent();
                        // if user was not found return 404 to the client
                        if (!user) {
                            res.status(404);
                            res.end();
                            return [2 /*return*/];
                        }
                        // return loaded user
                        res.send(user);
                        return [2 /*return*/];
                }
            });
        });
    });
    app.delete('/:id', function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userRepository, exisistingUser;
            return __generator(this, function (_a) {
                userRepository = typeorm_2.getManager().getRepository(User_1.User);
                exisistingUser = userRepository.findByIds(req.params.id);
                if (!exisistingUser) {
                    res.sendStatus(404).end("This user doesn't exisit.");
                    return [2 /*return*/];
                }
                userRepository.delete(req.params.id);
                res.end();
                return [2 /*return*/];
            });
        });
    });
    app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userRepository, user, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userRepository = typeorm_2.getManager().getRepository(User_1.User);
                    return [4 /*yield*/, userRepository.find({
                            where: {
                                'email': req.body.email,
                                'password': req.body.password
                            }
                        })];
                case 1:
                    user = _a.sent();
                    //return 403 if user is not exisiting
                    if (!user || user.length === 0) {
                        res.sendStatus(403);
                    }
                    token = generateAccessToken({ email: req.body.email });
                    res.json(token);
                    return [2 /*return*/];
            }
        });
    }); });
    // run app
    app.listen(3000);
    console.log("Express application is up and running on port 3000");
})
    .catch(function (error) {
    console.log('3306: [ERROR] Database error');
    console.log("ERROR: " + error);
});
//# sourceMappingURL=server.js.map