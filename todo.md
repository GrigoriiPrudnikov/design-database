- [x] Add limits for columns (like VARCHAR(100))
- [x] Add error handling in createQuery
- [x] Rename Datatype enum values to CamelCase
- [x] Add dialog for query
- [ ] Add relations to createQuery
- [ ] Rewrite validateDefaultValue and create "validate" props for changeProperty
- [ ] Add constraints for columns
- [ ] Add relations to query [docs](https://www.postgresql.org/files/documentation/pdf/17/postgresql-17-US.pdf)
  ```sql
  CREATE TABLE orders (
      order_id integer PRIMARY KEY,
      product_no integer REFERENCES products (product_no),
      quantity integer
  );
  ```
