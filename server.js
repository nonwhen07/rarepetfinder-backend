// process.env.JWT_SECRET_KEY = 'your-secret-key-123';

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
// 1. 建立 router
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// 2. 【核心關鍵】必須在任何 auth 中間件之前綁定 db
app.db = router.db;

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

// 3. 設定規則與 auth 中間件
// 常見設定：664 → 擁有者可讀寫、登入者可讀寫、訪客可讀
// 660 → 擁有者可讀寫、登入者可讀寫、訪客不可讀
// 600 → 只有擁有者可讀寫、其他人完全不行
// 644 → 擁有者可讀寫、其他人可讀
const rules = auth.rewriter({
  users: 664,
  stores: 664,
  favorites: 664,
  articles: 664,
  announcements: 664,
  reviews: 664,
});
// 後面進階版本會改成這樣，讓 favorites 只有登入者能讀寫，訪客完全看不到：
// const rules = auth.rewriter({
//   users: 600, // 只有擁有者（或後端）能操作，不讓任何人直接讀寫 users
//   stores: 664, // 任何人（包含未登入）都可以讀取 stores，前台公開使用
//   favorites: 660, // 只有登入使用者能讀寫自己的 favorites（訪客看不到）
//   articles: 664, // 公開文章
//   announcements: 664, // 公開公告
//   reviews: 664, // 如果有評論，也設成公開讀取
// });

app.use(rules);
app.use(auth); // 這裡會去抓 app.db，所以上面的綁定必須先完成

// 4. 自定義 /me 路由（最終乾淨版） - 只解碼 JWT，不驗證簽名，並從 decoded.sub 取 userId
app.get('/me', (req, res) => {
  try {
    // console.log('=== /me Debug Start ===');
    // console.log('Headers:', req.headers);
    // console.log('Authorization Header:', req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // console.log('→ 沒有收到 Bearer Token');
      return res.status(401).json({ error: '未提供 Token' });
    }

    const token = authHeader.split(' ')[1];

    // 使用 jsonwebtoken 解碼（不驗證 signature，只取 payload）
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token); // ← 注意這裡用 decode，不是 verify

    // console.log('Token 解碼後內容:', decoded);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Token 格式錯誤' });
    }

    const userId = Number(decoded.sub);

    // 從 db.json 撈完整資料
    const user = app.db.get('users').find({ id: userId }).value();

    if (!user) {
      return res.status(404).json({ error: '使用者不存在' });
    }

    // 移除密碼
    const { password, ...safeUser } = user;

    // console.log('成功回傳使用者資料:', safeUser.email);
    res.json(safeUser);
  } catch (err) {
    console.error('/me 錯誤:', err.message);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 5. 最後才是真正的 router
app.use(router);

const PORT = process.env.PORT || 3001; // fallback
app.listen(PORT, () => {
  console.log(`RarePet Finder Backend is running on port ${PORT}`);
});
