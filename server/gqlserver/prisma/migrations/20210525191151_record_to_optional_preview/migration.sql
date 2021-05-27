-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voice" TEXT NOT NULL,
    "recordId" INTEGER,
    FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Preview" ("id", "recordId", "voice") SELECT "id", "recordId", "voice" FROM "Preview";
DROP TABLE "Preview";
ALTER TABLE "new_Preview" RENAME TO "Preview";
CREATE UNIQUE INDEX "Preview_recordId_unique" ON "Preview"("recordId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
