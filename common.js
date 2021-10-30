
function copyToClipboard(text) {
  if (!navigator.clipboard) {
    textarea.focus()
    textarea.select()
    try {
      var successful = document.execCommand('copy')
      if (!successful) throw "unsuccessful"
      console.log('Copy to clipboard successful.')
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    return
  }
  navigator.clipboard.writeText(text).then(function () {
    console.log('Copy to clipboard successful.')
  }, function (err) {
    alert("copy failed!")
  })
}
