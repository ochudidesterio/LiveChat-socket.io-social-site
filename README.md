# LiveChat-socket.io-social-site

This is a social site where you can follow, post and chat with others

# Video Exampple

Video of the code running

<a href="https://www.youtube.com/watch?v=Q6p6ijk625k
" target="_blank"><p align="center"><img src="./Assets/WP_20171107_17_07_56_Pro.jpg" 
alt="social site demo"/></p></a>


# Getting Started

- Download and Install Node.js from  https://nodejs.org/en/download/
- Download and Install visual studio code from https://code.visualstudio.com/download
- Download and Install MongoDB instance on your computer or you should have a MongoDB atlas account
- Knowlegde of ES6

## Verify Installation

- Open a command prompt (or PowerShell), and enter the following
```
    node -v
    
```
- The system should display the Node.js version installed on your system. You can do the same for NPM:

```
    npm -v
    
```

- To check MongoDB Server version, Open the command line via your terminal program and execute the following command:

```
    mongod --version
    
```
- To Check MongoDB Shell version, Type:

```
    mongo
    
```

- On windows you will have to use full path to the mongod.exe and mongo.exe to check mongodb version, if you have not set MongoDB Path.
- But if MongoDb Path is being set, you can simply use the mongod and mongo command.

# Running the Application

- On the terminal of your text editor type the command below to start your node application server

``` 
     npm run watch
     
```

# Database Connection

- For the locally installed database use:

```
    mongodb://localhost/SocialSite
    
```
Where SocialSite is the name of your database.

- If you are using MongoDB Atlas then your connection string should be like:

```
    mongodb+srv://<username>:<password>@cluster0.ivn4s.mongodb.net/<database>?retryWrites=true&w=majority
    
```
Where by username,password and database are your username when creating MongoDB Atlas account, your password when creating your MongoDB atlas account and database name for your collections respectively. For more information about connecting to MongoDB Atlas follow this https://docs.mongodb.com/guides/server/drivers/ 

## Creating Indexes

- This project has a live search feature that uses indexes to querry the database.
- On locally installed database create the indexes on Post Document as follows

```
    db.posts.createIndex( { "title": "text", "body": "text" } )
    
```
- On MongoDB Atlas 
    - click on the documents name
    - navigate to indexes tab 
    - click on create indexes
    - replace field with title and type with text
    - repeat the above process for body
    - click review then confirm
    




