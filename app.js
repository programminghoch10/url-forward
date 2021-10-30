function redirect(url) {
  url = sanitizeURL(url)
  window.location.href = url
}

function execute(script) {
  setBodyClasses(true, false)
  eval(script)
}

function display(src) {
  setBodyClasses(false, true)
  src = sanitizeURL(src)
  let el = document.createElement("iframe")
  el.src = src
  document.body.appendChild(el)
}

function setBodyHTML(html) {
  document.body.innerHTML = html
  document.querySelectorAll("body script").forEach(script => eval(script.text))
}

function setBodyText(text) {
  setBodyClasses(true, false)
  document.body.innerText = text
}

function redirectGenerate() {
  window.location.href = "generate"
}

function setBodyClasses(black, margin) {
  document.body.classList[black ? "add" : "remove"]("black")
  document.body.classList[margin ? "add" : "remove"]("margin")
}

function sanitizeURL(url) {
  if (!url.includes("://")) {
    url = "https://" + url
  }
  return url
}

function getparam(q) {
  // urlparams parses and decodes the input
  // even when encoding again, urlparams does not exactly replicate the input
  //  return (new URLSearchParams(window.location.search)).get("d")
  // extracting the string directly works
  q = q + "="
  let s = document.location.search
  if (s.indexOf(q) < 0) return null
  let e = s.indexOf("&", s.indexOf(q))
  if (e < 0) e = s.length
  let r = s.substring(s.indexOf(q) + q.length, e)
  return decodeURI(r)
}

function process() {
  var type = getparam("t")
  var data = getparam("d")
  var title = getparam("h")

  if (data == null) {
    redirectGenerate()
    return
  }

  if (type.endsWith("b")) {
    data = atob(data)
    type = type.substring(0, type.length - 1)
    title = title ? title : "" //convert null to empty string
    title = atob(title)
  }

  if (title) {
    document.title = title
  }

  switch (type) {
    case "r":
      redirect(data)
      break
    case "s":
      execute(data)
      break
    case "i":
      display(data)
      break
    case "t":
      setBodyText(data)
      break
    case "h":
      setBodyHTML(data)
      break
    default:
      redirectGenerate()
      return
  }
}

process()
