// Handling the Textures

// From www.learningwebgl.com

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;

function initTexture(path) {
    webGLTexture = gl.createTexture();
    webGLTexture.image = new Image();
    webGLTexture.image.onload = function () {
        handleLoadedTexture(webGLTexture);
    };

    webGLTexture.image.src = path ;
}
