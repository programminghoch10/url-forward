function redirect(url) {
  if (!redirectParam.startsWith("http")) {
    url = "https://" + redirectParam;
  }

  window.location.href = url;
}

function execute(script) {
  eval(script);
}

function display(src) {
  const el = document.createElement("iframe");
  el.src = src;
  document.body.appendChild(el);
}

const parameters = new URLSearchParams(window.location.search);
const redirectParam = parameters.get("r");

if (redirectParam != null) {
  redirect(redirectParam);
}

const script = parameters.get("s");

if (script != null) {
  execute(script);
}

// urlparams parses and decodes the input
// even when encoding again, urlparams does not exactly replicate the input
//const iframe = parameters.get("i");

//extracting the string directly works
const iframe = document.location.search.substring("i=".length + 1)

if (iframe != null) {
  display(iframe);
}

if (redirectParam == null && script == null && iframe == null) {
  window.location.href = "generate";
}
