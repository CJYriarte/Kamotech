import express from 'express';
import { verifyJwt, requireRole } from '../middleware/authMiddleware.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

const STAFF_ROLES = ['junior_csr', 'senior_csr', 'tour_coordinator', 'tour_guide', 'admin'];


// List all staff accounts
router.get('/', verifyJwt, requireRole(['admin']), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, contact_number, role, created_at')
    .in('role', STAFF_ROLES)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ staff: data });
});


// Create a new staff account
router.post('/', verifyJwt, requireRole(['admin']), async (req, res) => {
  const { email, password, full_name, contact_number, role } = req.body;

  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'email, password, full_name, and role are required' });
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Step 1: create the actual auth user via the Admin API. email_confirm:
  // true skips the verification email, since an admin creating this
  // account directly is a form of verification in itself.
  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, contact_number },
  });

  if (createError) {
    return res.status(400).json({ error: createError.message });
  }

  const newUserId = created.user.id;

  // Step 2: the handle_new_user trigger already fired and created a
  // profiles row — but it's HARD-CODED to role='customer' (that's the
  // same self-escalation guard from way back in this project, working
  // as intended). This service-role update is the one legitimate way
  // to actually set the real role, since the service key bypasses
  // that trigger's restriction.
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', newUserId);

  if (updateError) {
    return res.status(500).json({ error: `User created but role assignment failed: ${updateError.message}` });
  }

  res.status(201).json({ message: 'Staff account created', user_id: newUserId });
});


// Change an existing staff member's role
router.patch('/:id/role', verifyJwt, requireRole(['admin']), async (req, res) => {
  const { role } = req.body;

  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Role updated' });
});

export default router;