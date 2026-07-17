import { db, pool } from "./index.js";
import {
  roles,
  users,
  module,
  submodules,
  permissions,
  rolePermissions,
} from "../models/index.js";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";

async function seed() {
  try {
    console.log("Seeding admin role and user...");

    // 1. Create Admin Role
    let adminRole = await db
      .select()
      .from(roles)
      .where(eq(roles.code, "ADMIN"))
      .then((res) => res[0]);

    if (!adminRole) {
      const [newRole] = await db
        .insert(roles)
        .values({
          id: 4,
          name: "Administrator",
          code: "ADMIN",
        })
        .returning();
      adminRole = newRole;
      console.log("Admin role created.");
    } else {
      console.log("Admin role already exists.");
    }

    // 2. Create Admin User
    const adminEmail = "admin@gmail.com";
    let adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .then((res) => res[0]);

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const [newUser] = await db
        .insert(users)
        .values({
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          roleId: adminRole.id,
        })
        .returning();
      adminUser = newUser;
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
    console.log(`Email: ${adminEmail} | Password: Admin@123`);

    // 3. Create Authority Module
    let adminModule = await db
      .select()
      .from(module)
      .where(eq(module.code, "AUTHORITY"))
      .then((res) => res[0]);
    if (!adminModule) {
      const [newModule] = await db
        .insert(module)
        .values({
          name: "Authority",
          code: "AUTHORITY",
        })
        .returning();
      adminModule = newModule;
      console.log("Authority module created.");
    }

    // 4. Create SubModules
    const subMods = [
      { name: "Role", code: "ROLE" },
      { name: "Permission", code: "PERMISSION" },
      { name: "Submodule", code: "SUBMODULE" },
      { name: "Role Permission", code: "ROLE_PERMISSION" },
      { name: "Client", code: "CLIENT" },
      { name: "Project", code: "PROJECT" },
      { name: "Work Order", code: "WORK_ORDER" },
      { name: "Material Indent Item", code: "MATERIAL_INDENT_ITEM" },
      { name: "Inventory", code: "INVENTORY" },
      { name: "Vendor Category", code: "VENDOR_CATEGORY" },
      { name: "Vendor", code: "VENDOR" },
      { name: "Vendor Rate Contract", code: "VENDOR_RATE_CONTRACT" },
      { name: "Subcontractor", code: "SUBCONTRACTOR" },
      {
        name: "Subcontractor Rate Contract",
        code: "SUBCONTRACTOR_RATE_CONTRACT",
      },
    ];

    for (const sm of subMods) {
      let subM = await db
        .select()
        .from(submodules)
        .where(eq(submodules.code, sm.code))
        .then((res) => res[0]);
      if (!subM) {
        await db.insert(submodules).values({ ...sm, moduleId: adminModule.id });
      }
    }
    console.log("Submodules seeded.");

    // 5. Create Permissions
    const perms = [
      { name: "Create", code: "CREATE" },
      { name: "Read", code: "READ" },
      { name: "Update", code: "UPDATE" },
      { name: "Delete", code: "DELETE" },
    ];

    for (const p of perms) {
      let perm = await db
        .select()
        .from(permissions)
        .where(eq(permissions.code, p.code))
        .then((res) => res[0]);
      if (!perm) {
        await db.insert(permissions).values(p);
      }
    }
    console.log("Permissions seeded.");

    // 6. Assign Role Permissions
    // Fetch ALL existing submodules and permissions
    const allExistingSubMods = await db.select().from(submodules);
    const allExistingPerms = await db.select().from(permissions);

    for (const subM of allExistingSubMods) {
      for (const perm of allExistingPerms) {
        const existingRp = await db
          .select()
          .from(rolePermissions)
          .where(
            and(
              eq(rolePermissions.roleId, adminRole.id),
              eq(rolePermissions.subModuleId, subM.id),
              eq(rolePermissions.permissionId, perm.id),
            ),
          )
          .then((res) => res[0]);

        if (!existingRp) {
          await db.insert(rolePermissions).values({
            roleId: adminRole.id,
            subModuleId: subM.id,
            permissionId: perm.id,
          });
        }
      }
    }
    console.log(
      "Role permissions assigned to Admin role for all existing submodules and permissions.",
    );

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seed();
