
function query(element) {
  return document.querySelector(element)
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
