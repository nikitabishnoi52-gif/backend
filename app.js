const express=require('express');
const cors=require('cors');
const app=express();
app.set("view engine","ejs");
const indexRouter=require('./Routes/index.js');

const port=3001;

app.use(cors());
app.use(express.json());
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

