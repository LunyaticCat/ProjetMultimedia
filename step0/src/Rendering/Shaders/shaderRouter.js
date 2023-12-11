


function compileShader(source, type) {
    var shader = gl.createShader(type);
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

    //TODO : Call the .glsl files

    //-----

    //TODO : Link vertexShader and fragmentShader to the shader sources
    var vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
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
}