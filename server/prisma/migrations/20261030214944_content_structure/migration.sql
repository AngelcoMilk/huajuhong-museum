-- AlterTable
ALTER TABLE "Item" ADD COLUMN "author" TEXT;
ALTER TABLE "Item" ADD COLUMN "blocksJson" TEXT;
ALTER TABLE "Item" ADD COLUMN "coverUrl" TEXT;
ALTER TABLE "Item" ADD COLUMN "draftJson" TEXT;
ALTER TABLE "Item" ADD COLUMN "parentId" TEXT;
ALTER TABLE "Item" ADD COLUMN "sourceName" TEXT;
ALTER TABLE "Item" ADD COLUMN "subtitle" TEXT;
ALTER TABLE "Item" ADD COLUMN "summary" TEXT;

-- CreateTable
CREATE TABLE "VrGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "layout" TEXT NOT NULL DEFAULT 'grid',
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VrScene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL DEFAULT '',
    "gid" TEXT,
    "sceneId" TEXT,
    "title" TEXT NOT NULL,
    "thumb" TEXT,
    "preview" TEXT,
    "iframe" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "groupId" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT
);
INSERT INTO "new_VrScene" ("gid", "group", "id", "iframe", "preview", "sceneId", "status", "thumb", "title") SELECT "gid", "group", "id", "iframe", "preview", "sceneId", "status", "thumb", "title" FROM "VrScene";
DROP TABLE "VrScene";
ALTER TABLE "new_VrScene" RENAME TO "VrScene";
CREATE INDEX "VrScene_group_idx" ON "VrScene"("group");
CREATE INDEX "VrScene_groupId_idx" ON "VrScene"("groupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "VrGroup_page_idx" ON "VrGroup"("page");

-- CreateIndex
CREATE INDEX "Item_parentId_idx" ON "Item"("parentId");
