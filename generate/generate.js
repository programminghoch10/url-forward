
var form = query("#form")

var origin = window.location.href.substring(0, window.location.href.length - ("generate/".length))

async function generateOutput(alertUserOnFailure) {

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

  let input = ""
  switch (selectedType) {
    default:
      if (query("#input").value === "") {
        if (alertUserOnFailure) alert("Missing input!")
        setOutput()
        generatePreviewUrl(selectedType)
        return
      }
      input = query("textarea#input").value
      break
    case "f":
      let fileUploadElement = query("#fileupload-file")
      let file = fileUploadElement.files[0]
      if (!file) {
        if (alertUserOnFailure) alert("Missing input!")
        setOutput()
        return
      }
      let data = await file.text()
      input = JSON.stringify({
        name: file.name,
        type: file.type,
        data: data,
      })
      break
  }

  let title = query("input#title").value

  if (!input) {
    if (alertUserOnFailure) alert("Failed to find input data.")
    return
  }
  input = btoa(input)
  title = btoa(title)

  generatePreviewUrl(selectedType)

  let char = selectedType
  outtext = origin + "?t=" + char + "&d=" + encodeURI(input) + (title ? "&h=" + encodeURI(title) : "")
  setOutput(outtext)
}

function generatePreviewUrl(selectedType) {
  let urlpreview = document.querySelector("p#urlpreview")
  let active = selectedType === 'r' || selectedType === 'i'
  if (!active) return
  let input = query("textarea#input").value
  if (input == "") {
    urlpreview.innerText = `No URL provided.`
    return
  }
  try {
    urlpreview.innerText = `Parsed URL: ${sanitizeURL(input)}`
  } catch (e) {
    urlpreview.innerText = `Failed to parse URL: ${e}`
  }
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
  switch (type) {
    default:
      query("#input").value = data
      break
    case "f":
      let transferObject = JSON.parse(data)
      let file = new File(
        [transferObject.data],
        transferObject.name,
        { type: transferObject.type },
      )
      let fileUploadElement = query("#fileupload-file")
      // thx https://dev.to/code_rabbi/programmatically-setting-file-inputs-in-javascript-2p7i
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileUploadElement.files = dataTransfer.files
      break
  }

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
