#version 100

precision mediump float;

struct GridTexture
{
    sampler2D id;
    float index;
    float width;
    float height;
};

uniform GridTexture u_texture;
uniform vec4 u_color;

varying vec2 v_texture_coords;

void main() {
    float tx_col = mod(u_texture.index, u_texture.width);
    float tx_row = floor(u_texture.index / u_texture.width);

    vec4 tex = texture2D(u_texture.id, vec2(
        v_texture_coords.x / u_texture.width + tx_col / u_texture.width,
        v_texture_coords.y / u_texture.height + tx_row / u_texture.height
    ));

    gl_FragColor = tex * u_color;
}
