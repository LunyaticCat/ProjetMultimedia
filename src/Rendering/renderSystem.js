function setupGL(gl)
{
    const vertexShaderCode = `
        attribute vec2 coordinates;
        void main(void)
        {
            gl_Position = vec4(coordinates, 0.0, 1.0);
        }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    const fragmentShaderCode = `
        precision mediump float;
        uniform vec4 u_color;
        void main(void)
        {
            gl_FragColor = u_color;
        }
        `;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram;
}

function colorToRGB(color)
{
    let map = new Map();

    map.set("orange",   [255.0,165.0,0.0,1.0]);
    map.set("blue",     [0.0,0.0,255.0,1.0]);
    map.set("red",      [255.0,0.0,0.0,1.0]);
    map.set("#E1ABAE",  [225.0,171.0,174.0, 1.0]);

    return map.get(color);
}

function drawRectangle(gl, shaderProgram, x, y, width, height, color)
{
    const normalizedX = (x / gl.canvas.width );
    const normalizedY = -(y / gl.canvas.height);
    const normalizedWidth = (width / gl.canvas.width) ;
    const normalizedHeight = -(height / gl.canvas.height);

    let vertices = new Float32Array(
        [
            2*normalizedX-0.55, 2*normalizedY+0.9,
            2*(normalizedX + normalizedWidth)-0.55, 2*normalizedY+0.9,
            2*normalizedX-0.55, 2*(normalizedY + normalizedHeight)+0.9,
            2*(normalizedX + normalizedWidth)-0.55, 2*normalizedY+0.9,
            2*normalizedX-0.55, 2*(normalizedY + normalizedHeight)+0.9,
            2*(normalizedX + normalizedWidth)-0.55, 2*(normalizedY + normalizedHeight)+0.9
        ]
    );

    const vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    const colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
    let rgbColor = colorToRGB(color);
    
    gl.uniform4f(colorLocation, rgbColor[0], rgbColor[1], rgbColor[2], rgbColor[3]);
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(coord);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const webGLRenderSystem = (entities, components, gl) => {
    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let shaderProgram = setupGL(gl);

    for(const entity of entities)
    {
        if(components.PositionComponent[entity] && components.GraphicsComponent[entity] && components.RenderableTag[entity])
        {
            const position = components.PositionComponent[entity];
            const graphics = components.GraphicsComponent[entity];
            
            var x = position.x;
            var y = position.y;
            var width = graphics.shapeInfo.w;
            var height = graphics.shapeInfo.h;
            var color = graphics.shapeInfo.color;

            // Draw the entity as a rectangle
            drawRectangle(gl, shaderProgram, x, y, width, height, color);
        }
    }
};

export {webGLRenderSystem}