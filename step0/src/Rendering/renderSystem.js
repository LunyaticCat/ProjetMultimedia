

let m3 = {
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
let program;
let gl;
let translation = [100, 50];
let rotationAngle = 0;
let scale = [1, 1];
let color;


let positionLocation;
let colorLocation;
//var resolutionLocation;
let positionBuffer;
let matrixLocation;

function fillGeometryCoordinates(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            0, 10,
            50, 0,
            0, 10,
            50, 0,
            50, 10,
            20, 10,
            30, 10,
            20, 10 + 40,
            20 + 10, 10,
            20, 10 + 40,
            20 + 10, 10 + 40



        ]),
        gl.STATIC_DRAW);
}

function updateScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    fillGeometryCoordinates(gl);

    var size = 2;          // 2 elements par iteration
    var type = gl.FLOAT;   // type
    var normalize = false; // pas de normalisation de vecteur
    var stride = 0;        // 0 de décalage entre composants
    var offset = 0;        // 0 décalage de départ
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset
    );
    // set the color
    gl.uniform4fv(colorLocation, color);



    // Compute the matrices
    let translationMatrix = m3.translation(translation[0], translation[1]);
    let angleInRadians = -rotationAngle * Math.PI / 180 ;
    let rotationMatrix = m3.rotation(angleInRadians);
    let scaleMatrix = m3.scaling(scale[0], scale[1]);
    //----

    // Multiply the matrices.

    //NEW
    let matrix = m3.identity();
    //New: on commence par multiplier la matrice de project
    // elle sera donc la dernière transformation à se réaliser
    matrix = m3.multiply(matrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    //----

    //
    gl.uniformMatrix3fv(matrixLocation, false, matrix);



    //
    let primitiveType = gl.TRIANGLES;
    offset = 0;
    let count = 12;
    gl.drawArrays(primitiveType, offset, count);
}

function setupGL() {
    // Shader sources
    let vertexShaderSource = `
                attribute vec2 a_position;
                uniform mat3 u_matrix;
                void main() {
                // Transformation & Project
                    vec2 position = (u_matrix * vec3(a_position, 1)).xy;
                    gl_Position = vec4(position, 0, 1);
                //---
                }
            `;

    let fragmentShaderSource = `
                precision mediump float;
                uniform vec4 u_color;
                void main() {
                    gl_FragColor = u_color;
                }
            `;

    // Compile shader
    function compileShader(source, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Erreur de compilation du shader: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    let vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Link shaders into a program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    //
    positionLocation = gl.getAttribLocation(program, "a_position");
    colorLocation = gl.getUniformLocation(program, "u_color");

    matrixLocation = gl.getUniformLocation(program, "u_matrix");

    color = [Math.random(), Math.random(), Math.random(), 1];

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
}

const webGLRenderSystem = (entities, components, webGL) => {
    gl = webGL;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    program = gl.createProgram();
    setupGL();

    for(const entity of entities){
        if (components.RenderableTag[entity] &&
            components.GraphicsComponent[entity] &&
            components.PositionComponent[entity]
        ) {
            const position = components.PositionComponent[entity];
            const grfx = components.GraphicsComponent[entity];
            let nid = entity.description;
            
        }
    }

    updateScene();
};

export {webGLRenderSystem}