# Alert Hero (Admin)
---
### Introduction

A web portal for admins and security guards to login then:
* Send, receive, and review messages
* View, Edit, and Delete Users
* View Statistics relevant to their hospital
	* Total # of users 
	* % of users active (on duty/off duty)
	* % of message sent (red, amber, green)
	* Frequency each group messages (number of messages sent)
	* Frequency each user messages (number of messages sent)
---
### Running Locally 
1. git clone this repo or pull from the master branch
2. Move to the Admin folder `cd Admin/desktop/`
3. Open this folder in your text editor of choice. Open two more tabs in your terminal with the same directory.
4. *Make sure your node version is above _9.5_. Check this by running* `node -v`
5. *Server Tab*
	1. Move to the server folder `cd server/`
	2. Run `npm i` to install the latest packages
	3. Setup Database  `createdb alertHero`
	4. In your .env file input your postgres_user as user and your postgres_password as pass
	5. Run `npm start` to start the server, it will run on port 8000.
	6. Proceed to [localhost:8000/graphiql](http://localhost:8000/graphiql) in your browser to test graphQL.
6. *Client Tab*
	1. In the second tab move to the client folder `cd client/`
	2.  Run `npm i` to install the latest packages
	3. Run `npm start` to start the sass loader and the React App, it should open in your default browser. If not proceed to [localhost:3000](http://localhost:3000/) in your browser.
7. Both tabs are *hot* and will reload after you edit and save code. 
8. (Optional) You can use a third terminal tab to commit and push code while the app is running. 
---
### Running in Docker
1. Make a folder called pgdata in the server directory `mkdir pgdata`
2. Run  `node docker-build`
3. Run `docker-compose up`
4. When finished press ^+C to exit and run `docker-compose down`
---
### Deployment 
Will be deployed to either Firebase or AWS. 
---
### Built With 
* [React](https://reactjs.org/) - The front-end framework 
* [Ant Design](https://ant.design/) - The UI Design framework 
* [GraphQL](http://graphql.org/) - The query language
* [PostgreSQL](https://www.postgresql.org/) - The database system
* [Node Js](https://nodejs.org/en/) - The back-end
---
### Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Icarusoncloud9/Alert-Hero/releases).
