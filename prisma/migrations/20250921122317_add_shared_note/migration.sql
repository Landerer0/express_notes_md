-- CreateTable
CREATE TABLE "SharedNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "grantedBy" TEXT,
    "expiresAt" DATETIME,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SharedNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SharedNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SharedNote_userId_idx" ON "SharedNote"("userId");

-- CreateIndex
CREATE INDEX "SharedNote_noteId_idx" ON "SharedNote"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNote_noteId_userId_key" ON "SharedNote"("noteId", "userId");
