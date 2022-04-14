function draw()
{
    var twoCont = document.getElementById('trace-flow');
    var twoParams = {
        width: twoCont.clientWidth,
        height: twoCont.clientWidth,
        type: Two.Types.svg
    }
    var two = new Two(twoParams).appendTo(twoCont);
    const SQRT_2 = Math.sqrt(2);

    /* options */
    var paths = [
        [
            105, 25,
            -5, 25
        ],
        [
            105, 30,
            75, 30,
            70, 35,
            -5, 35
        ],
        [
            -5, 32.5,
            70 - SQRT_2, 32.5,
            75 - SQRT_2, 27.5,
            105, 27.5
        ],
        [
            75, -5,
            75, 17.5,
            70, 22.5,
            -5, 22.5
        ],
        [
            77.5, -5,
            77.5, 17.5,
            82.5, 22.5,
            105, 22.5
        ]
    ]; // all points are percentages of w, h
    var speed = 0.0001;
    var pointScale = 5;
    var pointResolution = 5;
    var pointClass = 'trace-flow-point';
    var traceClass = 'trace-flow-trace';
    var trailClass = 'trace-flow-trail';
    var randomness = 1;
    var orderFactor = 0.05;
    var period = 0.05;
    var trailTimeOffset = 0.1;
    var pointsPerTrace = 5;

    var points = new Two.Group();
    var traces = new Two.Group();
    var trails = new Two.Group();
    var pointPhase = [];
    for(var i = 0; i < paths.length; i++)
    {
        var trace = pointsToPath(two, paths[i]);
        trace.noFill();
        trace.noStroke();
        trace.className = traceClass;
        traces.add(trace);
        for(var j = 0; j < pointsPerTrace; j++)
        {
            pointPhase.push(Math.random() * randomness);
            var point = pathLerp(traces.children[i], pointPhase[i * pointsPerTrace + j]); // circle pos

            var circle = two.makeCircle(new Two.Vector(point.x, point.y), pointScale, pointResolution);
            circle.noFill();
            circle.noStroke();
            circle.className = pointClass;
            points.add(circle);
            
            var trailEnd = pathLerp(traces.children[i], clamp(pointPhase[i * pointsPerTrace + j] - trailTimeOffset));
            var trail = two.makeLine(point.x, point.y, trailEnd.x, trailEnd.y);
            trail.noFill();
            trail.noStroke();
            trail.className = trailClass;
            trails.add(trail);
        }
    }

    two.add(traces);
    two.add(trails);
    two.add(points);
    
    
    two.play();
    document.addEventListener("visibilitychange", (_) => {
        if (document.visibilityState == "visible") {
          two.play();
        } else {
          two.pause();
        }
    });
    // start update loop
    two.bind('update', function() {
        for(var i = 0; i < traces.children.length; i++)
        {
            for(var j = 0; j < pointsPerTrace; j++)
            {
                if(pointPhase[i * pointsPerTrace + j] > 1)
                {
                    points.children[i * pointsPerTrace + j].visible = false;
                    trails.children[i * pointsPerTrace + j].visible = false;
                    if(pointPhase[i * pointsPerTrace + j] > 1 + period * (Math.random() * randomness) * (j * orderFactor))
                    {
                        pointPhase[i * pointsPerTrace + j] = 0;
                        points.children[i * pointsPerTrace + j].visible = true;
                        trails.children[i * pointsPerTrace + j].visible = true;
                    }
                }
                else
                {
                    var pos = pathLerp(traces.children[i], pointPhase[i * pointsPerTrace + j])
                    points.children[i * pointsPerTrace + j].position = pos;
                    var trailEnd = pathLerp(traces.children[i], clamp(pointPhase[i * pointsPerTrace + j] - trailTimeOffset));
                    trails.children[i * pointsPerTrace + j].vertices[0].x = pos.x;
                    trails.children[i * pointsPerTrace + j].vertices[0].y = pos.y;
                    trails.children[i * pointsPerTrace + j].vertices[1].x = trailEnd.x;
                    trails.children[i * pointsPerTrace + j].vertices[1].y = trailEnd.y;
                }
                pointPhase[i * pointsPerTrace + j] += two.timeDelta * speed;
            }
        }
        //console.log(1/two.timeDelta * 1000); // see fps
    });
}
window.addEventListener("load", draw);
function pointsToPath(two, points)
{
    var anchors = [];
    for(var i = 0; i <= points.length - 2; i+=2)
    {
        anchors.push(new Two.Anchor(two.width / 100 * points[i], two.height / 100 * points[i + 1]));
    }
    return new Two.Path(anchors, false, false, false);
}

function pathLerp(path, t) {
    var res = path.vertices.length;
    var i = Math.floor(t * (res - 1));
    var start = new Two.Vector(path.vertices[i].x, path.vertices[i].y);
    var end = new Two.Vector(path.vertices[i + 1].x, path.vertices[i + 1].y);
    return start.lerp(end, t * (res - 1) - i);
}

function clamp(num)
{
    if(num > 1)
        return 1;
    else if(num < 0)
        return 0;
    return num;
}
