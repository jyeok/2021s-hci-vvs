-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "memo" TEXT NOT NULL DEFAULT '',
    "textBlockId" INTEGER,
    FOREIGN KEY ("textBlockId") REFERENCES "TextBlock" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("date", "id", "textBlockId") SELECT "date", "id", "textBlockId" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_textBlockId_unique" ON "Schedule"("textBlockId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
