function redirect(url) {
  url = sanitizeURL(url)
  window.location.href = url
}

function execute(script) {
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
  document.body.innerText = text
}

async function copyTextToClipboard(text) {
  try {
    await copyToClipboard(text)
    setTimeout(closeTab, 100)
  } catch (e) {
    if (query("textarea#text")) {
      alert("Copy failed. Please copy the text manually.")
      document.body.removeChild(query("input#copybutton"))
      query("p#t1").innerText = "Could not copy text to clipboard."
      query("p#t2").innerText = "Please copy the text manually."
      while (query("body br")) document.body.removeChild(query("body br"))
      query("textarea#text").focus()
      return
    }
    let html = "<p id=t1>Could not automatically copy text to clipboard.</p>"
    html += "<p id=t2>Click the button to try again, or manually copy the text below</p>"
    html += "<input id=copybutton type=button value=\"Copy to clipboard\" onclick=\"copyTextToClipboard(query('textarea#text').value)\"><br><br>"
    html += "<textarea id=text></textarea>"
    setBodyHTML(html)
    query("textarea#text").value = text
  }
}

function downloadFile(transferObject) {
  transferObject = JSON.parse(transferObject)
  let name = transferObject.name
  let type = transferObject.type
  let data = transferObject.data
  let blob = new Blob([data], { type })
  let url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.innerText = `Save ${name}`
  a.href = url
  a.download = name
  try {
    a.click()
    closeTab()
  } catch {
    document.body.appendChild(a)
  }
}

function redirectGenerate() {
  window.location.href = "generate"
}

function setBodyClasses(daynight, removemargin) {
  document.body.classList[daynight ? "add" : "remove"]("daynight")
  document.body.classList[removemargin ? "add" : "remove"]("nomargin")
}

function closeTab() {
  window.close()
}

function process() {
  var type = getparam("t")
  var data = getparam("d")
  var title = getparam("h")

  if (data == null) {
    redirectGenerate()
    return
  }

  data = atob(data)
  title = atob(title)

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
    case "c":
      copyTextToClipboard(data)
      break
    case "f":
      downloadFile(data)
      break
    default:
      redirectGenerate()
      return
  }
}

process()
