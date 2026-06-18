# Security Policy

## Supported versions

Security fixes are applied to the latest state of the default branch.

## Reporting a vulnerability

Please do **not** open a public issue for security problems.

- Use GitHub private vulnerability reporting if it is enabled.
- Otherwise, contact the maintainer privately using the LinkedIn profile listed in [public.md](./public.md).

Please include:

- affected route, component, or file
- reproduction steps
- potential impact
- suggested mitigation, if known

## Secret handling

Do not commit `.env` files, access tokens, private URLs, or other credentials. Keep generated builds and local-only files out of version control.
