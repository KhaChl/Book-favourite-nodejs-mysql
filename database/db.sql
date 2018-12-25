CREATE DATABASE IF NOT EXISTS app_books CHARACTER SET utf8 COLLATE utf8_general_ci;

USE app_books;

CREATE TABLE IF NOT EXISTS users(
    id int(20) auto_increment not null,
    username varchar(20) not null,
    password varchar(255) not null,
    name varchar(20) not null,
    surname varchar(20) not null,
    CONSTRAINT pk_users PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE IF NOT EXISTS books(
    id int(20) auto_increment not null,
    user_id int(20) not null,
    title varchar(20) not null,
    url varchar(255) not null,
    description text,
    created_at timestamp not null DEFAULT current_timestamp,
    CONSTRAINT pk_users PRIMARY KEY(id),
    CONSTRAINT fk_books_users FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE=InnoDb;



