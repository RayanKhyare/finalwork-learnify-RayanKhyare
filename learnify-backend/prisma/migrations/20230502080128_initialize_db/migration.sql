-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Streams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iframe" TEXT NOT NULL,
    CONSTRAINT "Streams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Streams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Streams" ("category_id", "description", "id", "iframe", "title", "user_id") SELECT "category_id", "description", "id", "iframe", "title", "user_id" FROM "Streams";
DROP TABLE "Streams";
ALTER TABLE "new_Streams" RENAME TO "Streams";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
