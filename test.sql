create table test (
    id SERIAL PRIMARY KEY,
    name text,
);

create table deep_test (
    id SERIAL PRIMARY KEY,
    deep_name text,
    test_id int
);

ALTER TABLE deep_test ADD FOREIGN KEY (test_id) REFERENCES test (id);
