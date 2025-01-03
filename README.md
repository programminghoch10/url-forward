# URL-Forward

URL-Forward is a simple website which shows content it receives in query parameters.

https://programminghoch10.github.io/url-forward/

## Functions

Currently supported functions:
Type|Function
-|-
Redirect|Redirect to specified URL
Script|Execute provided script on an empty page
iFrame|Open provided URL in an `iframe`
Text|Display provided plain text
HTML|Render provided HTML code into body and evaluate contained scripts
Clipboard|Copy provided text to clipboard and close afterwards

### OAuth

As a special use case the url
https://programminghoch10.github.io/url-forward/oauth
can be used as an oauth redirect url
to obtain the token and scope in plain text easily.

## Development Notes

### Dark Mode
The body has
[automatic dark mode css rules](index.html#L10-L15)
applied by default. \
If you explicitely don't want this,
remove the class `daynight` from the body
using javascript:
```js
document.body.classList.remove('daynight')
```
Dark mode is always disabled for iFrame type.
