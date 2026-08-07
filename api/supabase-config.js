export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json({
    url: process.env.SUPABASE_URL || 'https://alnmirdrwaecsamxgwca.supabase.co',
    key: process.env.SUPABASE_PUBLISHABLE_KEY || ''
  });
}
