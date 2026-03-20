import { NextRequest } from 'next/server';
import { getAdminAuth } from '../firebase/admin';

export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const user = await getAdminAuth().verifyIdToken(token);
    return { user };
  } catch (err) {
    console.error('Verify auth error:', err);
    return { error: 'Invalid token', status: 401 };
  }
}
