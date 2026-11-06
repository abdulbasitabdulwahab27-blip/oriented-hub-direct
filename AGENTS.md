# Architecture Rules

- Public shop reads must use the read-only `catalog_products` and `catalog_product_prices` views; base tables remain for admin operations so public access exposes only catalog fields.