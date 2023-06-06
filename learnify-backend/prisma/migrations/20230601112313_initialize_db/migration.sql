/*
  Warnings:

  - You are about to drop the column `filepath` on the `File` table. All the data in the column will be lost.
  - Added the required column `url` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "File_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("filename", "id", "stream_id") SELECT "filename", "id", "stream_id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
