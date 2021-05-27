/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Record.path_unique" ON "Record"("path");
