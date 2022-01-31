const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/todo_db');
// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://localhost:27017/todo_db');
// }

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'error connecting to db.'));

// db.once('open', function(){
//   console.log('sucessfully connected to the database');
// });

const url = "mongodb+srv://razziil:arihant100@arihant-s-cluster.zgpmp.mongodb.net/test_db?retryWrites=true&w=majority";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.catch((err) => console.log(error.message));

// mongoose.set('useFindAndModify', false);