var canvas0 = document.querySelector("#quadtree"),
    canvas1 = document.querySelector("#points");

var width = canvas0.width,
    height = canvas0.height,
    radius = 1.5,
    scale = window.devicePixelRatio;

if (scale > 1) {
  canvas1.style.width = canvas0.style.width = width + "px";
  canvas1.style.height = canvas0.style.height = height + "px";
  canvas1.width = canvas0.width = width *= scale;
  canvas1.height = canvas0.height = height *= scale;
  radius *= scale;
}

var randomX = d3_random.randomNormal(width / 2, 100 * scale),
    randomY = d3_random.randomNormal(height / 2, 100 * scale);

var quadtree = d3_quadtree.quadtree(width - 1, height - 1),
    x0 = quadtree._x0,
    y0 = quadtree._y0,
    x1 = quadtree._x1,
    y1 = quadtree._y1;

var context0 = canvas0.getContext("2d"),
    context1 = canvas1.getContext("2d");

context0.fillStyle = "rgba(0,0,0,0.1)";
context0.strokeStyle = "#666";
context1.fillStyle = "rgba(240,0,0,1)";
context1.globalCompositeOperation = "multiply";
redraw({node: quadtree._root, x0: x0, y0: y0, x1: x1, y1: y1});


Reveal.addEventListener('quadtree', function() {
  let nPoints = 0;
  let t = d3_timer.timer(function() {
    if (nPoints > 500) t.stop();

    var x, y;

    do x = randomX(), y = randomY();
    while (x0 > x || x > x1 || y0 > y || y > y1);

    quadtree.add({x: x, y: y});
    redraw(quadtree._added);
    context1.beginPath();
    context1.arc(x, y, radius, 0, 2 * Math.PI);
    context1.fill();

    nPoints += 1;
  });
}, false );



function redraw(quad) {
  var quads = [], xm, ym, x0 = quad.x0, y0 = quad.y0, x1 = quad.x1, y1 = quad.y1;

  context0.clearRect(round(x0), round(y0), round(x1) - round(x0), round(y1) - round(y0));
  quads.push(quad);
  while (quad = quads.pop()) {
    node = quad.node, x0 = quad.x0, y0 = quad.y0, x1 = quad.x1, y1 = quad.y1;
    if (node.point) context0.fillRect(round(x0), round(y0), round(x1) - round(x0), round(y1) - round(y0));
    xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
    if (child = node[3]) quads.push({node: child, x0: xm, y0: ym, x1: x1, y1: y1});
    if (child = node[2]) quads.push({node: child, x0: x0, y0: ym, x1: xm, y1: y1});
    if (child = node[1]) quads.push({node: child, x0: xm, y0: y0, x1: x1, y1: ym});
    if (child = node[0]) quads.push({node: child, x0: x0, y0: y0, x1: xm, y1: ym});
    context0.strokeRect(round(x0) + 0.5, round(y0) + 0.5, round(x1) - round(x0), round(y1) - round(y0));
  }
}

function round(x) {
  return Math.round(x);
}
