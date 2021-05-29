/*
  Warnings:

  - You are about to alter the column `size` on the `Record` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    "memo" TEXT NOT NULL DEFAULT '',
    "isLocked" INTEGER NOT NULL DEFAULT 0,
    "voice" TEXT NOT NULL
);
INSERT INTO "new_Record" ("createdAt", "id", "isLocked", "memo", "path", "size", "tag", "title", "updatedAt", "voice") SELECT "createdAt", "id", "isLocked", "memo", "path", "size", "tag", "title", "updatedAt", "voice" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE UNIQUE INDEX "Record.path_unique" ON "Record"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
