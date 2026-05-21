var i = 0;
var code = "";
var CLASSES = {
  '>': 't-rt', '<': 't-lt',
  '+': 't-inc', '-': 't-dec',
  '.': 't-dot', ',': 't-com',
  '[': 't-lb', ']': 't-rb'
};

function makeIcon(ch) {
  var cls = CLASSES[ch];
  if (!cls) return null;
  var span = document.createElement("span");
  span.className = "code-icon " + cls;
  return span;
}

function add(c) {
  code += c;
  var disp = document.getElementById("display");
  var icon = makeIcon(c);
  if (icon) disp.appendChild(icon);
  disp.scrollTop = disp.scrollHeight;
}

function del() {
  if (code.length === 0) return;
  code = code.slice(0, -1);
  var disp = document.getElementById("display");
  if (disp.lastChild) disp.removeChild(disp.lastChild);
}

function compile() {
  if (document.body.classList.contains("loading")) return;
  document.body.classList.add("loading");
  var startTime = Date.now();

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      i += 1;
      var bin = brainfuck.compile(code);
      var blob = new Blob([bin], { type: "application/octet-stream" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = `program${i}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      var remaining = Math.max(0, 800 - (Date.now() - startTime));
      setTimeout(function () { document.body.classList.remove("loading"); }, remaining);
    });
  });
}