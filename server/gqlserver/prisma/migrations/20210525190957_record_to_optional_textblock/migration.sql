-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TextBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isMine" INTEGER NOT NULL DEFAULT 0,
    "isHighlighted" INTEGER NOT NULL,
    "isModified" INTEGER NOT NULL,
    "reliability" REAL NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "recordId" INTEGER,
    "previewId" INTEGER,
    FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("previewId") REFERENCES "Preview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TextBlock" ("content", "end", "id", "isHighlighted", "isMine", "isModified", "previewId", "recordId", "reliability", "start") SELECT "content", "end", "id", "isHighlighted", "isMine", "isModified", "previewId", "recordId", "reliability", "start" FROM "TextBlock";
DROP TABLE "TextBlock";
ALTER TABLE "new_TextBlock" RENAME TO "TextBlock";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
