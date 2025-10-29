
function query(selector) {
  return document.querySelector(selector)
}

function queryAll(selector) {
  return document.querySelectorAll(selector)
}

async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    textarea.focus()
    textarea.select()
    try {
      var successful = document.execCommand('copy')
      if (!successful) throw "unsuccessful"
      console.log('Copy to clipboard successful.')
    } catch (err) {
      console.error('Unable to copy', err)
      throw "unsuccessful"
    }
    return
  }
  await navigator.clipboard.writeText(text).then(function () {
    console.log('Copy to clipboard successful.')
  }, function (err) {
    throw "unsuccessful"
  })
}

function getParam(param, search) {
  // urlparams parses and decodes the input
  // even when encoding again, urlparams does not exactly replicate the input
  //  return (new URLSearchParams(window.location.search)).get("d")
  // extracting the string directly works
  param = param + "="
  let s = search == undefined ? window.location.search : search
  if (s.indexOf(param) < 0) return ""
  let e = s.indexOf("&", s.indexOf(param))
  if (e < 0) e = s.length
  let r = s.substring(s.indexOf(param) + param.length, e)
  return decodeURI(r)
}

function sanitizeURL(url) {
  try {
    return new URL(url).toString()
  } catch (error) {
    if (!(error instanceof TypeError))
      throw error
    if (error.message.endsWith("Invalid URL"))
      try {
        return new URL("https://" + url).toString()
      } catch (_) { }
    throw error
  }
}
