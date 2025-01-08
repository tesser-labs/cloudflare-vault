_⚠️ This library is not audited and the spec is still a work in progress and likely to change ._

# Cloudflare Vault
Cloudflare Vault provides a secure way to store encrypted secrets on Cloudflare Worker KV using a two-dimensional key structure.

# How It Works
Once the Vault is deployed and running, you can store and retrieve secrets using the following endpoints:

## Storing Secrets
Secrets can be stored by sending a POST request to:
```
https://<host>/vault/<key1>:<key2>
```

## Retrieving Secrets
You can retrieve secrets in two ways:

### Get All Secrets for a Top-Level Key
Send a GET request to the top-level key:

```
curl -X GET https://<host>/vault/<key1>
```
This returns all stored secrets for <key1> as an array.

### Get a Specific Secret
Send a GET request to the fully resolved key path:

```
curl -X GET https://<host>/vault/<key1>:<key2>
```

This returns the specific secret associated with <key1>:<key2>.

# Encryption Details
- Secrets are stored as Base64-encoded strings.
- Data is encrypted at rest using a shared AES-GCM key.
# Important Notes
- Not Production-Ready: This service does not include access management or authentication mechanisms.
- Recommended Setup: To protect secrets, an IAM (Identity and Access Management) system should be implemented alongside this service.
