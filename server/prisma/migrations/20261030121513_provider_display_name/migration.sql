-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "baseUrl" TEXT NOT NULL,
    "api" TEXT NOT NULL DEFAULT 'openai-completions',
    "keyMode" TEXT NOT NULL DEFAULT 'literal',
    "apiKeyEnv" TEXT,
    "apiKeyEnc" TEXT,
    "modelsJson" TEXT NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTestAt" DATETIME,
    "lastTestOk" BOOLEAN,
    "lastTestError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Provider" ("api", "apiKeyEnc", "apiKeyEnv", "baseUrl", "createdAt", "enabled", "id", "keyMode", "lastTestAt", "lastTestError", "lastTestOk", "modelsJson", "name") SELECT "api", "apiKeyEnc", "apiKeyEnv", "baseUrl", "createdAt", "enabled", "id", "keyMode", "lastTestAt", "lastTestError", "lastTestOk", "modelsJson", "name" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
