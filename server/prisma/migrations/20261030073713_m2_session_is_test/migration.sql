-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgentSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "page" TEXT,
    "ua" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "endedReason" TEXT,
    "turnCount" INTEGER NOT NULL DEFAULT 0,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "finishReason" TEXT,
    "configVersionId" TEXT,
    "isTest" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AgentSession" ("configVersionId", "endedAt", "endedReason", "finishReason", "id", "inputTokens", "outputTokens", "page", "startedAt", "turnCount", "ua", "visitorId") SELECT "configVersionId", "endedAt", "endedReason", "finishReason", "id", "inputTokens", "outputTokens", "page", "startedAt", "turnCount", "ua", "visitorId" FROM "AgentSession";
DROP TABLE "AgentSession";
ALTER TABLE "new_AgentSession" RENAME TO "AgentSession";
CREATE INDEX "AgentSession_startedAt_idx" ON "AgentSession"("startedAt");
CREATE INDEX "AgentSession_visitorId_idx" ON "AgentSession"("visitorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
