-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    CONSTRAINT "File_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
