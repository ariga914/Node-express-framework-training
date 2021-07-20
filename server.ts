import "reflect-metadata";
import { createConnection } from 'typeorm';
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import { getManager } from "typeorm";
import { User } from "./entity/User";
import * as jwt from 'jsonwebtoken';
import console = require("console");

const ormOptions: any = {
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

createConnection(ormOptions)
    .then(value => {
        console.log('3306: [SUCCESS] Database connected!');
        
        // create express app
        const app = express();
        const TOKEN_SECRET = '5f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4'
        app.use(bodyParser.urlencoded({
            extended : true
        }))
        app.use(bodyParser.json());
        function generateAccessToken(email: string | object | Buffer) {
            return jwt.sign(email, TOKEN_SECRET, { expiresIn: '1800s' });
        }

        function authenticateToken(req: Request, res: Response, next: () => {}): void {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.sendStatus(401)

            jwt.verify(token, TOKEN_SECRET as string, (err: any, user: any) => {
                console.log(err);
          
                if (err) return res.sendStatus(403)
                
                next()
            })
          }
          
        
        // Routes Definitions
        app.get("/", (_req, res) => {
            res.status(200).send("Hi!. My name is Bi");
        });

        app.get('/listUsers', authenticateToken, async (_req, res: Response) => {
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            const users = await userRepository.find();
        
            // return loaded users
            res.send(users);
        })
        
        
        app.post('/add', async function (req: Request, res: Response) {
            // Prepare output in JSON format
            const user = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                profession: req.body.profession
            };
        
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
            
            //load a user by email and password
            const exisitingUser = await userRepository.find({
                where : {
                    'email' : req.body.email,
                    'password' : req.body.password
                } 
            });
            //return mesg if user is not exisiting
            if (exisitingUser && exisitingUser.length > 0) {
                res.send("Emial is exisisting, Please input another email!");
                return;
            }
            const users = await userRepository.save(user);
        
            // return loaded users
            res.send(users);
        })
        
        app.get('/:id', async function (req, res) {
            // First read existing users.
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            // load a user by a given user id
            const user = await userRepository.findOne(+req.params.id);
        
            // if user was not found return 404 to the client
            if (!user) {
                res.status(404);
                res.end();
                return;
            }
        
            // return loaded user
            res.send(user);
        })
        
        app.delete('/:id', async function (req, res) {
            // First read existing users.
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            const exisistingUser = await userRepository.findByIds(req.params.id);
            if (exisistingUser.length === 0) {
                res.sendStatus(404);
            }
            
            userRepository.delete(req.params.id);
            res.end();
            return;
        })

        app.put('/:id', async (req, res) => {
            // Prepare output in JSON format
            const user = {
                id: +req.params.id,
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                profession: req.body.profession
            };
            
            // First read existing users.
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);

            const exisistingUser = await userRepository.findByIds(req.params.id);
            if (exisistingUser.length === 0) {
                res.sendStatus(404);
                return;
            }

            const users = await userRepository.save(user);

            res.send(users);
            return;
        })

        app.patch('/:id', async (req, res) => {
                        
            const userRepository = getManager().getRepository(User);

            const exisistingUser = await userRepository.findByIds(req.params.id);
            if (exisistingUser.length === 0) {
                res.sendStatus(404);
                return;
            }
            
            const updatedInfo = await userRepository.save(Object.assign({id: +req.params.id}, req.body));            res.send(updatedInfo);
            return;
        })

        app.post('/login', async (req, res) => {
            const userRepository = getManager().getRepository(User);

            //load a users by email and password
            const user = await userRepository.find({
                where : {
                    'email' : req.body.email,
                    'password' : req.body.password
                }
            });
            //return 403 if user is not exisiting
            if (!user || user.length === 0) {
                res.sendStatus(403);
            }

            //generate token and return to client
            const token = generateAccessToken({email : req.body.email});
            res.json(token);
        })
        
        // run app
        app.listen(3000);

        console.log("Express application is up and running on port 3000");

    })
    .catch(error => {
        console.log('3306: [ERROR] Database error');
        console.log(`ERROR: ${error}`);
    });
