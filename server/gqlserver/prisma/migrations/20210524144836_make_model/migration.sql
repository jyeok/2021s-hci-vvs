/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    "memo" TEXT NOT NULL DEFAULT '',
    "voice" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Preview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voice" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TextBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isHighlighted" INTEGER NOT NULL,
    "isModified" INTEGER NOT NULL,
    "reliability" REAL NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "previewId" INTEGER,
    FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("previewId") REFERENCES "Preview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "textBlockId" INTEGER NOT NULL,
    FOREIGN KEY ("textBlockId") REFERENCES "TextBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Preview_recordId_unique" ON "Preview"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_textBlockId_unique" ON "Schedule"("textBlockId");
