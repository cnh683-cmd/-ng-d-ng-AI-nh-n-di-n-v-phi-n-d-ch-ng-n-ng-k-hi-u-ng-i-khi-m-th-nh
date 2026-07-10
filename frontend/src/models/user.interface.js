export const UserRoles = {
  USER: 'user',
  ADMIN: 'admin'
};

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} fullName
 * @property {string} role - 'user' | 'admin'
 * @property {boolean} isActive
 * @property {string} avatar (optional)
 */