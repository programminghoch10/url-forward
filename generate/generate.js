
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
      let fileNameElement = query("#fileupload-name")
      let fileName = fileNameElement.value || undefined
      let data = await file.text()
      input = JSON.stringify({
        name: file.name,
        fname: fileName,
        type: file.type,
        data: data,
      })
      break
  }

  if (!input) {
    if (alertUserOnFailure) alert("Failed to find input data.")
    return
  }

  generatePreviewUrl(selectedType)

  let exportAsDataURI = query("input#checkbox-datauri").checked
    && DATAURITYPES.includes(selectedType)
  if (exportAsDataURI) {
    outtext = await generateDataURI(selectedType, input)
  } else {
    input = btoa(input)
    let title = query("input#title").value
    title = btoa(title)
    outtext = origin + "?t=" + selectedType + "&d=" + encodeURI(input) + (title ? "&h=" + encodeURI(title) : "")
  }
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

const DATAURITYPES = ["t", "h", "f", "s"]
async function generateDataURI(selectedType, data) {
  if (!DATAURITYPES.includes(selectedType))
    throw `data uri not supported for type ${selectedType}`
  switch (selectedType) {
    case "f":
      let transferObject = JSON.parse(data)
      let file = new File(
        [transferObject.data],
        transferObject.name,
        { type: transferObject.type },
      )
      return await new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.onerror = (e) => reject(e)
        fileReader.readAsDataURL(file)
      })
    case "h":
      return `data:text/html;base64,${btoa(data)}`
    case "t":
      return `data:text/plain;base64,${btoa(data)}`
    case "s":
      return `javascript:${data}`
    default:
      throw `type ${selectedType} not handled`
  }
}

function fillFromOutput() {
  let inText = query("#output").value
  if (inText === "") {
    return
  }

  if (inText.startsWith("data:") || inText.startsWith("javascript:"))
    return fillFromOutputUri()

  inText = inText.substring(origin)

  let type = getparam("t", inText)
  setTypeRadioButtons(type)

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
      let fileNameElement = query("#fileupload-name")
      fileNameElement.value = transferObject.fname ?? ""
      fileUploadElement.dispatchEvent(new Event("change"))
      break
  }

  let title = getparam("h", inText)
  query("input#title").value = atob(title)
}

function setTypeRadioButtons(type) {
  if (!type) throw "missing type for setting radio buttons"
  queryAll("input[name=type]").forEach((el) => {
    el.checked = type.indexOf(el.value) >= 0
  })
}

function fillFromOutputUri() {
  let inText = query("#output").value
  if (inText === "")
    return
  query("input#checkbox-datauri").checked = true
  let type = undefined
  if (inText.startsWith("data:text/html")) type = "h"
  if (inText.startsWith("data:text/plain")) type = "t"
  if (inText.startsWith("javascript:")) type = "s"
  if (!type) {
    alert("Unable to import data URI. Be aware, that importing files is not supported.")
    return
  }
  setTypeRadioButtons(type)

  let data = inText.replace(/^(javascript:|data:text\/(html|plain)(;base64)?,)/, "")
  let base64 = /^data:text\/(html|plain);base64,/.test(inText)
  if (base64)
    data = atob(data)
  query("#input").value = data
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

query("#fileupload-file").addEventListener("change", function () {
  let fileUploadElement = query("#fileupload-file")
  let file = fileUploadElement.files[0]
  if (!file) return
  let fileNameElement = query("#fileupload-name")
  fileNameElement.setAttribute('placeholder', file.name)
})
