onload = draw;
function draw()
{
    var twoCont = document.getElementById('helix-flow');
    var twoParams = {
        height: $(window).height() * 0.6,
        width: $(window).width(),
        type: Two.Types.svg
    }
    var two = new Two(twoParams).appendTo(twoCont);

    /* options */

    var speed = 0.001;
    var frequency = 80;
    var amplitude = 110;
    var amplitudeDiff = 0.75;
    var resolution = 15 * (two.width * 0.001);
    var offsetX = two.width * 0.75;
    var sineClass = 'helix-flow-sine';
    var cosineClass = 'helix-flow-cosine';
    var sineBackgroundClass = 'helix-flow-sine-background';
    var bgStacks = 5;
    var bgSpeed = 0.5;
    var time = 0;
    var sway = 0.15;
    var falloff = 0.1;
    var stacks = 0;
    var frequencyFluctuation = 250;
    var noiseEffect = 0.01;
    var cosPhase = 0.75;
    
    var lines = new Two.Group();
    for(let i = 0; i < 2; i++)
    {
        let sine = generatePath(two, false, frequency, amplitude, resolution);
        sine.noFill();
        sine.noStroke();
        sine.className = i % 2 == 0 ? sineClass : cosineClass;
        lines.add(sine);
    }
    lines.translation.x = offsetX;
    var bgLines = new Two.Group();
    for(let i = 0; i < bgStacks; i++)
    {
        let sine = generatePath(two, false, frequency, amplitude, resolution);
        sine.noFill();
        sine.noStroke();
        sine.className = sineBackgroundClass;
        bgLines.add(sine);
    }
    two.add(bgLines);
    two.add(lines);
    bgLines.translation.x = offsetX;
    two.play();
    // start update loop
    window.onresize = function()
    {
        two.height = $(window).height() * 0.6;
        two.width = $(window).width();
        offsetX = two.width * 0.75;
        lines.translation.x = offsetX;
        bgLines.translation.x = offsetX;
    }
    two.bind('update', function() {
        
        var child, step, vec;
        for(let i = 0; i < lines.children.length; i++)
        {
            child = lines.children[i];
            for(let vert = 0; vert < child.vertices.length; vert++)
            { 
                step = (two.width / resolution);
                if(i % 2 == 0)
                    vec = sampleSineFourier(frequency, vert * step, time, falloff, stacks, frequencyFluctuation, noiseEffect) * amplitude;
                else
                    vec = sampleSineFourier(frequency, vert * step, 3.14159 * 180 * cosPhase + time + Math.sin(time) * sway, falloff, stacks, frequencyFluctuation, noiseEffect) * amplitude;
                child.vertices[vert].x = vec;
                child.vertices[vert].y = vert * step;
            }
        }
        for(let i = 0; i < bgLines.children.length; i++)
        {
            child = bgLines.children[i];
            for(let vert = 0; vert < child.vertices.length; vert++)
            {
                step = (two.width / resolution);
                vec = sampleSine(frequency, vert * step, 3.14159 * 180 / (i + 1) + time * bgSpeed) * amplitude * amplitudeDiff;
                child.vertices[vert].x = vec;
                child.vertices[vert].y = vert * step;
            }
        }
        time += two.timeDelta * speed;
        //console.log("fps: " + 1/two.timeDelta * 1000); // see fps
    });
}
function sampleSine(freq, t, phase)
{
    return Math.sin(freq * (t - phase * (3.14159/180)));
}
function sampleCosine(freq, t, phase)
{
    return Math.cos(freq * (t - phase * (3.14159/180)));
}
function sampleSineFourier(freq, t, phase, falloff, stacks, frequencyFluctuation, effect)
{

    var noise = Math.sin(2 * t * frequencyFluctuation) + Math.sin(3.14159 * t * frequencyFluctuation);
    var result = sampleSine(freq, t, phase)
    for(let i = 0; i < stacks; i++)
    {
        noise = Math.sin(2 * t * frequencyFluctuation * i - noise) + Math.sin(3.14159 * t * frequencyFluctuation * i - noise);
        result += sampleSine(freq, t * noise, phase) * (stacks - i) * falloff * effect / (i + 1);
    }
    return result;
}
function generatePath(two, type, freq, amplitude, resolution)
{
    var path = [];
    var step = (two.height / resolution);
    for(var i = 0; i < resolution; i++)
    {
        var x = i * step;
        var y;
        if(type)
            y = sampleCosine(freq, x, 0);
        else
            y = sampleSine(freq, x, 0);
        path.push(y * amplitude); // flip lines for dir change
        path.push(x);
    }
    return pointsToPath(two, path);
}
function pointsToPath(two, points)
{
    var anchors = [];
    for(var i = 0; i <= points.length - 2; i+=2)
    {
        anchors.push(new Two.Anchor(two.width / 100 * points[i], two.height / 100 * points[i + 1]));
    }
    return new Two.Path(anchors, false, true, false);
}