# Deploy and Host a React Frontend With a Form API on Railway

A React/Vite website served by Caddy with a separate Node.js validation API. The browser submits to the frontend's same-origin `/api/contact` path, which Caddy forwards over private networking.

## About Hosting a React Frontend With a Form API

The template creates two services: `web` and `api`. The frontend builds static assets and serves them with Caddy. The API validates a name, email, and message, returning a receipt without storing or emailing the submission. No database or external credentials are required.

## Why Deploy This Example on Railway

Deploy the frontend and API in one project, connect them through private networking, and manage public domains and service logs together. Enable the built-in CDN on the frontend after deployment to cache public assets. Origin services still use billable resources according to your plan.

## Common Use Cases

- Learning the difference between static delivery and dynamic requests.
- Moving a React website from shared hosting.
- Starting a frontend/API project before adding real form delivery or storage.

## Dependencies for This Example

The repository contains React/Vite frontend dependencies, Caddy configuration, and a Node.js API with no external packages.

### Deployment Dependencies

A Railway account with sufficient credits or an appropriate paid plan. No email account, database, API key, or custom domain is required. The API returns a demonstration receipt only; add persistence or email delivery, rate limiting, and abuse protection before collecting real enquiries. Enable CDN caching in the web service settings after its public domain is created.
