function query(element) {
  return document.querySelector(element)
}

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

  let char = ""
  switch (selectedType) {
    case "redirect":
      char = "r"
      break
    case "script":
      char = "s"
      break
    case "iframe":
      char = "i"
      break
    case "text":
      char = "t"
      break
    case "html":
      char = "h"
      break
    default:
      if (alertUserOnFailure) alert("Please check one option")
      setOutput()
      return
  }

  let input = query("textarea#input").value
  let base64 = query("input#checkbox-base64").checked
  let title = query("input#title").value

  if (base64) {
    input = btoa(input)
    char += "b"
    title = btoa(title)
  }

  outtext = origin + "?t=" + char + "&d=" + encodeURI(input) + (title ? "&h=" + title : "")
  setOutput(outtext)
}

function setOutput(text) {
  let out = query("#output")
  out.value = text
  if (text) {
    query("#outputdiv").style.display = ""
  } else {
    query("#outputdiv").style.display = "none"
  }
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

query("#openlink").addEventListener("click", function (event) {
  event.preventDefault()
  let url = query("textarea#output").value
  window.open(url, '_blank')
})

query("#copylink").addEventListener("click", function (event) {
  event.preventDefault()
  copyToClipboard(query("textarea#output").value)
})
