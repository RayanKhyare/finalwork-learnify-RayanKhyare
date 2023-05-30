-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Poll_votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "poll_id" INTEGER,
    "option_id" INTEGER,
    CONSTRAINT "Poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Polls" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Poll_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Poll_option" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "question" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    CONSTRAINT "questions_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" INTEGER,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "Users_role_fkey" FOREIGN KEY ("role") REFERENCES "Roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "stream_id" INTEGER,
    "message" TEXT NOT NULL,
    CONSTRAINT "Messages_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "beschrijving" TEXT
);

-- CreateTable
CREATE TABLE "Streams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "category_id" INTEGER,
    "room_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iframe" TEXT NOT NULL,
    CONSTRAINT "Streams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Streams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Polls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "poll_question" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    CONSTRAINT "Polls_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "answers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stream_id" INTEGER,
    "question_id" INTEGER,
    "username" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "answers_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "Streams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Poll_option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "poll_id" INTEGER,
    "option" TEXT NOT NULL,
    CONSTRAINT "Poll_option_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Polls" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "category_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iframe" TEXT NOT NULL,
    CONSTRAINT "Videos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Videos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
