
const webGLRenderSystem = (entities, components, gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const program = gl.createProgram();

    setupShaders(gl, program);
};



export {webGLRenderSystem}