const m3 = {
    identity: function () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
}
const webGLRenderSystem = (entities, components, gl) => {
    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let shaderProgram = setupGL(gl);

    for (const entity of entities) {
        if (components.PositionComponent[entity] && components.GraphicsComponent[entity] && components.RenderableTag[entity]) {
            const position = components.PositionComponent[entity];
            const graphics = components.GraphicsComponent[entity];

            // Draw the entity as a rectangle
            drawRectangle(gl, position.x, position.y, graphics.shapeInfo.w, graphics.shapeInfo.h, graphics.shapeInfo.color, shaderProgram);
        }
    }

};

function colorToRGB(color){
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // return {r, g, b}
    return [r,g,b, 1.0];
}

function drawRectangle(gl, x, y, width, height, color, shaderProgram) {
    const normalizedX = (x / gl.canvas.width );
    const normalizedY = -(y / gl.canvas.height);
    const normalizedWidth = (width / gl.canvas.width) ;
    const normalizedHeight = -(height / gl.canvas.height);

    let vertices = new Float32Array([
        2*normalizedX-0.55, 2*normalizedY+0.9,
        2*(normalizedX + normalizedWidth)-0.55, 2*normalizedY+0.9,
        2*normalizedX-0.55, 2*(normalizedY + normalizedHeight)+0.9,
        2*(normalizedX + normalizedWidth)-0.55, 2*normalizedY+0.9,
        2*normalizedX-0.55, 2*(normalizedY + normalizedHeight)+0.9,
        2*(normalizedX + normalizedWidth)-0.55, 2*(normalizedY + normalizedHeight)+0.9
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    const matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
    const colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
    let rgbColor = colorToRGB(color);

    let matrix = m3.identity();

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.uniform4f(colorLocation, rgbColor[0], rgbColor[1], rgbColor[2], rgbColor[3]);
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(coord);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setupGL(gl){
    const vertexShaderCode = `
                attribute vec2 coordinates;
                uniform mat3 u_matrix;
                void main() {
                // Transformation & Project
                    vec2 position = (u_matrix * vec3(coordinates, 1)).xy;
                    gl_Position = vec4(position, 0, 1);
                //---
                }
            `;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    const fragmentShaderCode = `
    precision mediump float;
    uniform vec4 u_color;
    void main(void) {
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


export {webGLRenderSystem}