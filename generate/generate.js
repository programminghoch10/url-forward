function query(element) {
  return document.querySelector(element)
}

var form = query("#form")

var origin = window.location.href.substring(0, window.location.href.length - ("generate/".length))

form.addEventListener("submit", function (event) {
  event.preventDefault()

  if (query("#input").value === "") {
    alert("Missing input!")
    return
  }

  let out = query("#output")
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
    default:
      alert("Please check one option")
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

  out.value = outtext
  query("#outputdiv").style.display = ""
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
