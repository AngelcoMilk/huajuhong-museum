-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "board" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'article',
    "title" TEXT NOT NULL,
    "date" TEXT,
    "sourceUrl" TEXT,
    "body" TEXT,
    "labelJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ItemMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'image',
    "usage" TEXT,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "ItemMedia_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnterpriseProfile" (
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "town" TEXT,
    "address" TEXT,
    "tel" TEXT,
    "email" TEXT,
    "site" TEXT,
    "shopsJson" TEXT,
    "lng" REAL,
    "lat" REAL,
    "coordSource" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "EnterpriseProfile_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductProfile" (
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT,
    "variantsJson" TEXT,
    "thumb" TEXT,
    "shopCandidatesJson" TEXT,
    CONSTRAINT "ProductProfile_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VrScene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL DEFAULT '',
    "gid" TEXT,
    "sceneId" TEXT,
    "title" TEXT NOT NULL,
    "thumb" TEXT,
    "preview" TEXT,
    "iframe" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published'
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConfigVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "versionNo" INTEGER NOT NULL,
    "promptJson" TEXT NOT NULL,
    "modelJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "api" TEXT NOT NULL DEFAULT 'openai-completions',
    "keyMode" TEXT NOT NULL DEFAULT 'env',
    "apiKeyEnv" TEXT,
    "apiKeyEnc" TEXT,
    "modelsJson" TEXT NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTestAt" DATETIME,
    "lastTestOk" BOOLEAN,
    "lastTestError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KbSlice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "origin" TEXT,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "source" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KbGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "count" INTEGER NOT NULL DEFAULT 1,
    "firstSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "AgentSession" (
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
    "configVersionId" TEXT
);

-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "citationsJson" TEXT,
    "suggestionsJson" TEXT,
    "toolJson" TEXT,
    "usageJson" TEXT,
    "latencyMs" INTEGER,
    "errorCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AgentSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "configVersionId" TEXT,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "resultJson" TEXT NOT NULL,
    "model" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TrackEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "targetId" TEXT,
    "durationMs" INTEGER,
    "netPrefix" TEXT,
    "ua" TEXT,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DailyBoardStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "pv" INTEGER NOT NULL DEFAULT 0,
    "uv" INTEGER NOT NULL DEFAULT 0,
    "avgDwellMs" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "postcode" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL DEFAULT '家',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductSku" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "purchasable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'on',
    "sort" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "anonKey" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shop_order" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "shop_order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "thumb" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "shop_order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'succeeded',
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payloadJson" TEXT,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "shop_order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Item_board_section_idx" ON "Item"("board", "section");

-- CreateIndex
CREATE INDEX "Item_status_idx" ON "Item"("status");

-- CreateIndex
CREATE INDEX "Item_board_status_idx" ON "Item"("board", "status");

-- CreateIndex
CREATE INDEX "ItemMedia_itemId_idx" ON "ItemMedia"("itemId");

-- CreateIndex
CREATE INDEX "VrScene_group_idx" ON "VrScene"("group");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE INDEX "ConfigVersion_status_idx" ON "ConfigVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE INDEX "KbSlice_source_idx" ON "KbSlice"("source");

-- CreateIndex
CREATE INDEX "KbGap_status_idx" ON "KbGap"("status");

-- CreateIndex
CREATE INDEX "AgentSession_startedAt_idx" ON "AgentSession"("startedAt");

-- CreateIndex
CREATE INDEX "AgentSession_visitorId_idx" ON "AgentSession"("visitorId");

-- CreateIndex
CREATE INDEX "AgentMessage_sessionId_createdAt_idx" ON "AgentMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalysisReport_kind_createdAt_idx" ON "AnalysisReport"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "TrackEvent_ts_idx" ON "TrackEvent"("ts");

-- CreateIndex
CREATE INDEX "TrackEvent_route_kind_idx" ON "TrackEvent"("route", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBoardStat_day_board_key" ON "DailyBoardStat"("day", "board");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "ProductSku_itemId_idx" ON "ProductSku"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_anonKey_key" ON "Cart"("anonKey");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_skuId_key" ON "CartItem"("cartId", "skuId");

-- CreateIndex
CREATE UNIQUE INDEX "shop_order_orderNo_key" ON "shop_order"("orderNo");

-- CreateIndex
CREATE INDEX "shop_order_userId_createdAt_idx" ON "shop_order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "shop_order_status_idx" ON "shop_order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
