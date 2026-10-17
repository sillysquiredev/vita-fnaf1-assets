#version 100
precision mediump float;

struct GridTexture
{
    sampler2D texture;
    float index;
    float width;
    float height;
};

struct MultipleGridTexture
{
    sampler2D texture[2];
    float index;
    float width;
    float height;
};

uniform GridTexture gt_background;
uniform MultipleGridTexture gt_static;
uniform sampler2D u_blip_texture;

uniform float u_alpha;
uniform float u_bar_offset;
uniform float u_bar_width;
uniform float u_blip_alpha;

varying vec2 v_texture_coords;

void main()
{
    float bg_col = mod(gt_background.index, gt_background.width);
    float bg_row = floor(gt_background.index / gt_background.width);
    vec3 background_color = (texture2D(gt_background.texture, vec2(
        v_texture_coords.x / gt_background.width + bg_col / gt_background.width,
        v_texture_coords.y / gt_background.height + bg_row / gt_background.height
    )) * u_alpha).rgb;

    float st_col = mod(gt_static.index, gt_static.width);
    float st_row = floor(gt_static.index / gt_static.width);
    vec2 st_uv = vec2(v_texture_coords.x,
                      v_texture_coords.y / gt_static.height + st_row / gt_static.height);

    vec4 st_sample;
    if (int(floor(st_col)) == 0)
        st_sample = texture2D(gt_static.texture[0], st_uv);
    else
        st_sample = texture2D(gt_static.texture[1], st_uv);

    vec3 static_color = (st_sample * 0.66).rgb;
    gl_FragColor = vec4(background_color + static_color, 1.0);

    if (v_texture_coords.y > u_bar_offset && v_texture_coords.y < u_bar_offset + u_bar_width)
        gl_FragColor = mix(gl_FragColor, vec4(1.0), 0.2);

    vec4 blip_color = texture2D(u_blip_texture, v_texture_coords);
    if (blip_color.r > 0.5)
        gl_FragColor = mix(gl_FragColor, blip_color, u_blip_alpha);
}   