-- AlterTable
ALTER TABLE "ConfigVersion" ADD COLUMN "publishedBy" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_AdminUser" ("createdAt", "id", "passwordHash", "username") SELECT "createdAt", "id", "passwordHash", "username" FROM "AdminUser";
DROP TABLE "AdminUser";
ALTER TABLE "new_AdminUser" RENAME TO "AdminUser";
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
