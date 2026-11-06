# Procurement Product Matching Assistant

## What to build
- Add an AI-assisted panel to the existing public institutional procurement page where buyers describe needs in plain language.
- Recommend matching catalog products, quantities and brief reasons; let buyers review and edit suggested items before using them in the existing quote request form.
- Keep the existing procurement submission, email, tracking and WhatsApp flow intact; suggestions only prefill its requirement list.

## Implementation
- Add a bounded server function that validates the request and catalog candidates, makes a streamed Lovable AI Gateway Responses call, and validates the returned product references against the supplied catalog IDs.
- Keep AI prompts, gateway credentials and model calls server-side. Use the supported default model and structured output, with safe error handling and request/input limits.
- Add the recommendation UI to `/procurement`, using current catalog products and design-system conventions; provide loading, empty, error and editable results states.
- Verify recommendation results populate the existing quotation form, and check the preview build/typecheck and runtime logs.

## Technical details
- Reuse the procurement form and read-only catalog views; do not create database tables or change order submission behavior.
- Implement the server function and server-only gateway helper in client-safe/server-only module boundaries, respectively.
- Record the server boundary decision in `AGENTS.md`.
