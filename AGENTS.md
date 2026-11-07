# Architecture Rules

- Public shop reads must use the read-only `catalog_products` and `catalog_product_prices` views; base tables remain for admin operations so public access exposes only catalog fields.
- Lovable AI Gateway calls run through TanStack server functions with secrets held server-side; send minimal catalog projections and validate model-selected product IDs before returning them.