onload = draw;
function draw()
{
    var twoCont = document.getElementById('sine-flow');
    var twoParams = {
        fitted: true,
        type: Two.Types.svg
    }
    var two = new Two(twoParams).appendTo(twoCont);

    /* options */

    var speed = 0.0005;
    var frequency = 50;
    var amplitude = 40;
    var resolution = 30;
    var offsetY = two.height / 2;
    var width = two.width * 1.1;
    var color = '#52DEB2'
    var opacityDrop = 0.08;
    var strokeThickness = 8;
    var cap = 'butt';
    var stackCount = 10;
    var stackYOffset = -15;
    var phaseShift = 0.6;
    var angle = 10;
    var time = 0;
    
    drawSineStack(two, frequency, phaseShift, angle, resolution, offsetY, width, amplitude, strokeThickness, color, cap, stackCount, time, stackYOffset, opacityDrop);
    two.play();
    // start update loop
    two.bind('update', function() {
        two.fit();
        for(var i = 0; i < two.scene.children.length; i++)
        {
            var child = two.scene.children[i]
            var newSine = generateSine(frequency, (two.scene.children.length - i) * phaseShift + time, angle, resolution, (two.scene.children.length - i) * stackYOffset, width, amplitude);
            var vert = child.vertices;
            for(var j = 0; j < vert.length; j++)
            {
                if(j % 2 == 0)
                {
                    vert[j].y = newSine[j + 1];
                }
                else
                {
                    vert[j].y = newSine[j];
                }
            }
        }
        time += two.timeDelta * speed;
        //console.log(1/two.timeDelta * 1000); // see fps
    });
}
function sampleSine(freq, t, phase, angle)
{
    return Math.sin(freq * (t - phase * (3.14159/180))) + t * angle;
}
function generateSine(freq, phase, angle, resolution, offsetY, width, amplitude)
{
    var sine = []
    for (var i = 0; i <= resolution; i++)
    {
        sine.push(width * i / resolution);
        sine.push(sampleSine(freq, i / resolution, phase, angle) * amplitude + offsetY);
    }
    return sine;
}
function drawSine(two, freq, phase, angle, resolution, offsetY, width, amplitude, linewidth, color, cap = 'round')
{
    var path = two.makeCurve(...generateSine(freq, phase, angle, resolution, offsetY, width, amplitude), true);
    path.noFill();
    path.stroke = color;
    path.linewidth = linewidth;
    path.cap = cap;
    return path;
}
function drawSineStack(two, freq, phaseShift, angle, resolution, offsetY, width, amplitude, linewidth, color, cap, stackCount, time, stackYOffset, opacityDrop)
{
    function addAlpha(_color, opacity) {
        // coerce values so it is between 0 and 1.
        var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return _color + _opacity.toString(16).toUpperCase();
    }
    var sineStack = [];
    for (var i = stackCount; i > 0; i--)
    {
        sineStack.push(drawSine(two, freq, i * phaseShift + time, angle, resolution, offsetY + i * stackYOffset, width, amplitude, linewidth, addAlpha(color, 1 - i * opacityDrop), cap));
    }
    return sineStack;
}