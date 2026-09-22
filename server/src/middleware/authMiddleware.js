// creating middleware for the express server to intercet incoming requests, extract the bearr token, verify identity with supabase auth, and restrict access based on user roles

import { supabaseAdmin } from '../config/supabase.js';

export const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach authenticated user to request
    req.user = user;

    // Fetch associated profile details
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Forbidden: User profile not found' });
    }

    req.user.role = profile.role;
    req.user.full_name = profile.full_name;

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error during auth verification' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
};