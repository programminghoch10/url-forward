
var form = query("#form")

var origin = window.location.href.substring(0, window.location.href.length - ("generate/".length))

function generateOutput(alertUserOnFailure) {

  if (query("#input").value === "") {
    if (alertUserOnFailure) alert("Missing input!")
    setOutput()
    return
  }

  let outtext = ""
  let selectedType = null
  try {
    selectedType = query('input[name=type]:checked').value
  } catch { }
  if (selectedType == null) {
    if (alertUserOnFailure) alert("Please check one option")
    setOutput()
    return
  }
  let char = selectedType

  let input = query("textarea#input").value
  let title = query("input#title").value

  input = btoa(input)
  title = btoa(title)


  outtext = origin + "?t=" + char + "&d=" + encodeURI(input) + (title ? "&h=" + encodeURI(title) : "")
  setOutput(outtext)
}

function fillFromOutput() {
  if (query("#output").value === "") {
    return
  }

  let inText = query("#output").value
  inText = inText.substring(origin)
  let type = getparam("t", inText)
  queryAll("input[name=type]").forEach((el) => {
    el.checked = type.indexOf(el.value) >= 0
  })

  let data = getparam("d", inText)
  data = atob(data)
  query("#input").value = data

  let title = getparam("h", inText)
  query("input#title").value = atob(title)
}

function setOutput(text) {
  text = text ? text : ""
  let out = query("#output")
  out.value = text
  query("#outputdiv").style.display = text ? "" : "none"
  let longURL = text.length > 2048
  query("p#lengthwarn").style.display = longURL ? "" : "none"
}

form.addEventListener("submit", function (event) {
  event.preventDefault()
  generateOutput(true)
})

form.addEventListener("change", () => {
  if (!query("input#checkbox-autosubmit").checked) return
  generateOutput()
})

query("textarea#input").addEventListener("input", () => {
  if (!query("input#checkbox-autosubmit").checked) return
  generateOutput()
})

query("input#import").addEventListener("click", () => {
  query("#output").value = prompt("Input link")
  fillFromOutput()
  generateOutput()
})

query("input#title").addEventListener("input", () => {
  if (!query("input#checkbox-autosubmit").checked) return
  generateOutput()
})

query("#openlink").addEventListener("click", function (event) {
  event.preventDefault()
  let url = query("textarea#output").value
  window.open(url, '_blank')
})

query("#copylink").addEventListener("click", function (event) {
  event.preventDefault()
  try {
    copyToClipboard(query("textarea#output").value)
  } catch (e) {
    alert("copy to clipboard unsuccessful")
  }
})
