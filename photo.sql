\c postgres;

DROP DATABASE IF EXISTS photo;
CREATE DATABASE photo;

\c photo;

CREATE TABLE photographes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL
);

CREATE TABLE orientations (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  orientation INTEGER NOT NULL REFERENCES orientations(id),
  fichier VARCHAR(100) NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  id_photographe INTEGER NOT NULL REFERENCES photographes(id)
);

CREATE TABLE commentaires (
  id SERIAL PRIMARY KEY,
  texte VARCHAR(200) NOT NULL,
  id_photo INTEGER NOT NULL REFERENCES photos(id)
);


INSERT INTO photographes (nom, prenom) VALUES ('Raghid', 'Osseiran');
INSERT INTO photographes (nom, prenom) VALUES ('Martin', 'Zibo');
INSERT INTO photographes (nom, prenom) VALUES ('Joah', 'Emy');
INSERT INTO photographes (nom, prenom) VALUES ('Luis', 'IDK');

SELECT * FROM photographes;

INSERT INTO orientations (nom) VALUES ('portrait');
INSERT INTO orientations (nom) VALUES ('paysage');

SELECT * FROM orientations;

INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Evangelion', '2001-03-01', 1, 'image1.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Geass', '2003-01-01', 1, 'image2.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Fourth Eye', '2004-01-03', 2, 'image3.jpg', 4);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Speed', '2010-01-01', 2, 'image4.jpg', 3);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Momento mori', '1985-01-01', 2, 'image5.jpg', 1);

SELECT * FROM photos;

INSERT INTO commentaires (texte,id_photo) VALUES ('WOOOW SO COOL', 1);
INSERT INTO commentaires (texte,id_photo) VALUES ('THATS CRAZY', 1);


SELECT * FROM commentaires;
