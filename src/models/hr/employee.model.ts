// Employee model has been merged into user.model.ts
// This file re-exports everything for backward compatibility
export {
  users as employees,
  type User as Employee,
  type NewUser as NewEmployee,
} from './user.model.js';
