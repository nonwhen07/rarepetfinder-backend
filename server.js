const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');
const path = require('path');

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://0130shun.github.io',
];

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // 不要 throw error
      }
    },
  })
);

app.use(jsonServer.bodyParser);

const rules = auth.rewriter({
  users: 664,
  stores: 664,
});

app.use(rules);
app.db = router.db;

app.use(auth);
app.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json(req.user);
});
app.use(router);

const PORT = process.env.PORT || 3001; // fallback

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
