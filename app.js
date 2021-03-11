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

function redirectGenerate() {
  window.location.href = "generate";
}

function getparam(q) {
  // urlparams parses and decodes the input
  // even when encoding again, urlparams does not exactly replicate the input
  //  return (new URLSearchParams(window.location.search)).get("d");
  // extracting the string directly works
  q = q + "=";
  let s = document.location.search;
  if (s.indexOf(q) < 0) return null;
  let e = s.indexOf("&", s.indexOf(q));
  if (e < 0) e = s.length;
  let r = s.substring(s.indexOf(q) + q.length, e)
  return decodeURI(r);
}

function process() {
  const type = getparam("t");
  const data = getparam("d");

  if (data == null) {
    redirectGenerate();
    return;
  }

  switch (type) {
    case "r":
      redirect(data);
      break;
    case "s":
      execute(data);
      break;
    case "i":
      display(data);
      break;
    default:
      redirectGenerate();
      return;
  }
}

process()