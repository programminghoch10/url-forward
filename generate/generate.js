var form = query("#form")

var origin = window.location.href.substring(0, window.location.href.length - ("generate/".length))

form.addEventListener("submit", function(event) {
    event.preventDefault()
    
    if (query("#input").value === "") {
        alert("Missing input!")
        return
    }

    let out = query("#output")
    let outtext = ""
    let selectedType = null
    try {
        selectedType = document.querySelector('input[name=type]:checked').value
    } catch {}

    let char = ""
    switch(selectedType) {
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
    outtext = origin + "?" + char + "=" + encodeURI(query("textarea#input").value)

    out.value = outtext
    query("#outputdiv").style.display = ""
})

query("#openlink").addEventListener("click", function(event) {
    event.preventDefault()
    let url = query("textarea#output").value
    window.open(url, '_blank')
})