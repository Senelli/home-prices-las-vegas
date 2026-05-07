CREATE TABLE city_zipcodes (
    ZipCode INTEGER PRIMARY KEY,
    City    VARCHAR(50),
    State   VARCHAR(10)
);

CREATE TABLE home_values (
    ZipCode INTEGER,
    "Date"  DATE,
    Value   NUMERIC,
    FOREIGN KEY (ZipCode) REFERENCES city_zipcodes(ZipCode)
);