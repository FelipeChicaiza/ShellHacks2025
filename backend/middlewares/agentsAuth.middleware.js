import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const TOKEN = process.env.AGENTS_API_TOKEN || 'changeme';

export default function agentsAuth(req, res, next) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth) return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ success: false, message: 'Invalid Authorization format' });
  const token = parts[1];
  if (!token || token !== TOKEN) return res.status(403).json({ success: false, message: 'Invalid token' });
  next();
}
