-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "id", "name", "passwordHash", "phone") SELECT "createdAt", "id", "name", "passwordHash", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE TABLE "new_shop_order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "subtotalCents" INTEGER NOT NULL,
    "shippingFeeCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "addressJson" TEXT NOT NULL,
    "shippingJson" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "remark" TEXT NOT NULL DEFAULT '',
    "carrier" TEXT,
    "trackingNo" TEXT,
    "shippedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "shop_order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shop_order" ("addressJson", "createdAt", "expiresAt", "id", "note", "orderNo", "paidAt", "paymentMethod", "shippingFeeCents", "shippingJson", "status", "subtotalCents", "totalCents", "userId") SELECT "addressJson", "createdAt", "expiresAt", "id", "note", "orderNo", "paidAt", "paymentMethod", "shippingFeeCents", "shippingJson", "status", "subtotalCents", "totalCents", "userId" FROM "shop_order";
DROP TABLE "shop_order";
ALTER TABLE "new_shop_order" RENAME TO "shop_order";
CREATE UNIQUE INDEX "shop_order_orderNo_key" ON "shop_order"("orderNo");
CREATE INDEX "shop_order_userId_createdAt_idx" ON "shop_order"("userId", "createdAt");
CREATE INDEX "shop_order_status_idx" ON "shop_order"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
