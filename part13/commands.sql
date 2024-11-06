CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT null,
  title text NOT null,
  likes integer DEFAULT 0
);

INSERT INTO blogs (url, title) values ('some url 1', 'some title 1');
INSERT INTO blogs (url, title) values ('some url 2', 'some title 2');
