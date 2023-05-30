/*
  Warnings:

  - You are about to drop the column `poll_question` on the `Polls` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Polls` table. All the data in the column will be lost.
  - Added the required column `question` to the `Polls` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Polls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "question" TEXT NOT NULL,
    CONSTRAINT "Polls_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Polls" ("id", "stream_id") SELECT "id", "stream_id" FROM "Polls";
DROP TABLE "Polls";
ALTER TABLE "new_Polls" RENAME TO "Polls";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
