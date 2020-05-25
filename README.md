# Penthouse Lambda

Run [penthouse](https://github.com/pocketjoso/penthouse) as a serverless function on Vercel.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/thomkrupa/penthouse-lambda)

## Usage

Make a post request to `<domain>/api/penthouse` with following body:

```json
{
  "url": "<absolute url to page you want you want extract CSS>",
  "cssPath": "<absolute path to css file>"
}
```

Alternatively, you can post HTML and CSS as strings instead of absolute paths.

```json
{
  "html": "<valid html string>",
  "cssString": "<full css string>"
}
```

The function will return an object with critical CSS as follows:

```json
{
  "criticalCss": "<critical css string>"
}
```
