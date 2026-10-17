#version 100

precision mediump float;

struct GridTexture
{
    sampler2D texture;
    float index;
    float width;
    float height;
};

uniform GridTexture gt_texture;

vec4 sample_grid(vec2 gt_texture_coords, GridTexture gt_tex)
{
    float col = mod(gt_tex.index, gt_tex.width);
    float row = floor(gt_tex.index / gt_tex.width);
    return texture2D(gt_tex.texture, vec2(
        gt_texture_coords.x / gt_tex.width + col / gt_tex.width,
        gt_texture_coords.y / gt_tex.height + row / gt_tex.height
    ));
} 

varying vec2 v_texture_coords;

void main() {
    vec4 color = sample_grid(v_texture_coords, gt_texture);
    if((color.r + color.g + color.b) / 3.0 < 0.1)
        color.a = 0.0;
    gl_FragColor = color;
}
