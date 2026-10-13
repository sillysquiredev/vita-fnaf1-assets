#version 100

precision mediump float;

struct GridTexture
{
    sampler2D texture;
    float index;
    float width;
    float height;
};

uniform GridTexture gt_background;
uniform GridTexture gt_static;
uniform sampler2D u_blip_texture;

uniform float u_alpha;
uniform float u_bar_offset;
uniform float u_bar_width;
uniform float u_blip_alpha;

varying vec2 v_texture_coords;

vec4 sample_grid(vec2 gt_texture_coords, GridTexture gt_tex)
{
    float col = mod(gt_tex.index, gt_tex.width);
    float row = floor(gt_tex.index / gt_tex.width);
    return texture2D(gt_tex.texture, vec2(
        gt_texture_coords.x / gt_tex.width + col / gt_tex.width,
        gt_texture_coords.y / gt_tex.height + row / gt_tex.height
    ));
}   

void main()
{
    vec3 background_color = (sample_grid(v_texture_coords, gt_background) * u_alpha).rgb;
    vec3 static_color = (sample_grid(v_texture_coords, gt_static) * 0.66).rgb;
    gl_FragColor = vec4(background_color + static_color, 1.0);

    if(v_texture_coords.y > u_bar_offset && v_texture_coords.y < u_bar_offset + u_bar_width)
    {
        gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 1.0, 1.0), 0.2);
        gl_FragColor.a = 1.0;
    }

    vec4 blip_color = texture2D(u_blip_texture, v_texture_coords);
    if(blip_color.r > 0.5)
        gl_FragColor = mix(gl_FragColor, blip_color, u_blip_alpha);
}   