let stepper = 10;
let stepperColor;

var coord; // Coordonnées, liées au vertexShader de WebGL.
var matrixLocation; // Matrice, liée au vertexShader de WebGL.
var colorLocation; // Couleur, liée au fragmentShader de WebGL.

// Définitions des matrices 3x3 de transformations utilisées.
const m3 = {
    identity: function() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },
    multiply: function(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
    translation: function(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },
    rotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },
    scaling: function(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },
    //NEW

    projection: function(w, h) {
        return [
            2 / w, 0, 0,
            0, -2 / h, 0,
            -1, 1, 1
        ];
    },

    //
};

function setupGL(gl)
{
    const vertexShaderCode = `
        attribute vec2 coordinates;
        uniform mat3 u_matrix;

        void main()
        {
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
    
    // Liaison des coordonnées, de la matrice et de la couleur aux variables globales définies au début du fichier.
    coord = gl.getAttribLocation(shaderProgram, "coordinates");
    matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
    colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
    
    return shaderProgram;
}

function colorToRGB(color)
{
    if(stepper >= 10)
    {
        stepper = 0;
        stepperColor = [Math.random(), Math.random(), Math.random(), 1];
    }

    if(color === "random")
    {
        ++stepper;
        return stepperColor;
    }

    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    return [r, g, b, 1];
}

function drawRectangle(gl, x, y, width, height, color, shaderProgram, transformation)
{
    const normalizedX = (x / gl.canvas.width );
    const normalizedY = -(y / gl.canvas.height);
    const normalizedWidth = (width / gl.canvas.width) ;
    const normalizedHeight = -(height / gl.canvas.height);

    let vertices = new Float32Array(
        [
            2 * normalizedX - 0.55, 2 * normalizedY + 0.9,
            2 * (normalizedX + normalizedWidth) - 0.55, 2 * normalizedY + 0.9,
            2 * normalizedX - 0.55, 2 * (normalizedY + normalizedHeight) + 0.9,
            2 * (normalizedX + normalizedWidth) - 0.55, 2 * normalizedY + 0.9,
            2 * normalizedX - 0.55, 2 * (normalizedY + normalizedHeight) + 0.9,
            2 * (normalizedX + normalizedWidth) - 0.55, 2 * (normalizedY + normalizedHeight) + 0.9
        ]
    );

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let rgbColor = colorToRGB(color);

    let translation = [0, 0];
    let rotationAngle = 0;
    let scale = [1, 1];

    if (typeof transformation !== 'undefined') {
        translation = transformation.translation;
        rotationAngle = transformation.rotate;
        scale = transformation.homothety;
    }

    let translationMatrix = m3.translation(translation[0], translation[1]);
    let angleInRadians = -rotationAngle * Math.PI / 180 ;
    //Pour la rotation et l'homothetie il faut revenir à l'origine avant la transformation
    let translateToZero = m3.translation(-x, -y);
    let rotationMatrix = m3.rotation(angleInRadians);
    let translateToCoord = m3.translation(x, y);

    let scaleMatrix = m3.scaling(scale[0], scale[1]);

    let matrix = m3.identity();

    matrix = m3.multiply(matrix, translationMatrix);
    matrix = m3.multiply(matrix, translateToZero);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    matrix = m3.multiply(matrix, translateToCoord);

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, rgbColor[0], rgbColor[1], rgbColor[2], rgbColor[3]);
    
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

            let transformation
            if (components.TransformationComponent[entity]) transformation = components.TransformationComponent[entity];

            // Draw the entity as a rectangle
            drawRectangle(gl, position.x, position.y, graphics.shapeInfo.w, graphics.shapeInfo.h, graphics.shapeInfo.color, shaderProgram, transformation);
        }
    }
};

export {webGLRenderSystem}