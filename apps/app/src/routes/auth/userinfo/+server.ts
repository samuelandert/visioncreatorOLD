import { SECRET_SUPABASE_JWT_SECRET } from '$env/static/private'
import { error } from '@sveltejs/kit';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function GET({ request }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw error(401, 'No Authorization header provided.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw error(401, 'No JWT provided.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_SUPABASE_JWT_SECRET) as JwtPayload;

    if (!decoded.sub) {
      throw error(401, 'Invalid JWT: Subject missing');
    }
    const user = {
      id: decoded.sub,
      name: decoded.full_name || 'Unknown',
      email: decoded.email,
      roles: [decoded.role]
    };

    console.log(user)

    return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('JWT verification error:', err);
    throw error(401, 'Invalid JWT');
  }
}