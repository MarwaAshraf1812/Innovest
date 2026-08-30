const { initSocketServer } = require('./sockets');
const { apiRateLimiter, authRateLimiter } = require('./middlewares/rateLimiter');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize modularized Socket.IO system
initSocketServer(server);

dbConection();

// Cors
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://client-ruddy-iota-11.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow in dev/staging if needed
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// Apply Rate Limiters
app.use('/api/', apiRateLimiter);
app.use('/api/user/login', authRateLimiter);
app.use('/api/user/signup', authRateLimiter);

// Routes
app.use('/api', adminModule());
app.use('/api', communityModule());
app.use('/api', userModule());
app.use('/api', messageModule());
app.use('/api', likeModule());
app.use('/api', commentModule());
app.use('/api', ProjectModule());
app.use('/api', proposalModule());


// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
