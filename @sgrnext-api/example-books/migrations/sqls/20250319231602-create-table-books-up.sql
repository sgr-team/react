CREATE TABLE "Books" (
  "id"          SERIAL  PRIMARY KEY,
  "title"       VARCHAR NOT NULL,
  "author"      VARCHAR NOT NULL,
  "description" TEXT    NOT NULL
);
