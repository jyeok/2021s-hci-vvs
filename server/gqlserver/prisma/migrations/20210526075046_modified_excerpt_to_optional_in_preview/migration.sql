/*
  Warnings:

  - A unique constraint covering the columns `[previewId]` on the table `TextBlock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TextBlock_previewId_unique" ON "TextBlock"("previewId");
