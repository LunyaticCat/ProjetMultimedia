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


/**
 * 
 * @param {*} gl WebGl
 */
function setupShaders(gl){

    fetch('../Shaders/vertexShader.glsl')
        .then(response => response.text())
        .then((vertexShaderSource) => {
            fetch('../Shaders/fragmentShader.glsl')
                .then(response => response.text())
                .then((fragmentShaderSource) => {
                    //TODO : Link vertexShader and fragmentShader to the shader sources
                    let vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
                    let fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
                    //------

                    // create and attach the shaders with gl
                    program = gl.createProgram();
                    gl.attachShader(program, vertexShader);
                    gl.attachShader(program, fragmentShader);
                    gl.linkProgram(program);

                    // set attributes for shaders
                    positionLocation = gl.getAttribLocation(program, "a_position");
                    colorLocation = gl.getUniformLocation(program, "u_color");

                    matrixLocation = gl.getUniformLocation(program, "u_matrix");

                    color = [Math.random(), Math.random(), Math.random(), 1];

                    positionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                });
        });
}