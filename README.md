# FCC APIs project URL Shortener Microservice
A microservice for creating short urls which redirect to specified destination site
### Details:
1. You can POST a new URL to `[project_url]/api/shorturl/new` and receive a shortened URL in the JSON response.
  Example: `{"original_url":"www.google.com","short_url":1}`
2. If an invalid URL is passed through which doesn't follow the `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error": "invalid URL"}`. The service uses a custom regex and the `dns.lookup(host, cb)` method from the `dns` core module to ensure the provided URL meets the required syntax and that it points to a valid URL.
3. When visiting the shortened URL, the service redirects the request to the original link.

### Short URL Creation:
Example: `POST [project_url]/api/shorturl/new - https://www.google.com`

### Example Usage:
https://sunny-avocado.glitch.me/api/shorturl/4

### Will Redirect to:
https://github.com/hiimdan
