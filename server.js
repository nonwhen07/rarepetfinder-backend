const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router('db.json');

app.use(cors());
app.use(jsonServer.bodyParser);

//  auth 要放在 router 前面
app.use(auth);
app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
