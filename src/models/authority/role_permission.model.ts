import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { roles } from './role.model.js';
import { submodules } from './submodule.model.js';
import { permissions } from './permission.model.js';
import { module } from './module.model.js';

export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  subModuleId: integer('sub_module_id')
    .notNull()
    .references(() => submodules.id, { onDelete: 'cascade' }),
  permissionId: integer('permission_id')
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
