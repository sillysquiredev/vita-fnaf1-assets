#version 100

precision mediump float;

struct VerticalTexture
{
    sampler2D texture;
    float index;
    float count;
};

uniform VerticalTexture vt_background;
uniform VerticalTexture vt_static;
uniform sampler2D u_static1;
uniform sampler2D u_blip_texture;

uniform float u_alpha;
uniform float u_bar_offset;
uniform float u_bar_width;
uniform float u_blip_alpha;

varying vec2 v_texture_coords;

vec4 sample_static()
{
    float v = (v_texture_coords.y + vt_static.index) / vt_static.count;
    if (v < 0.5)
        return texture2D(vt_static.texture, vec2(v_texture_coords.x, v * 2.0));
    else
        return texture2D(u_static1, vec2(v_texture_coords.x, (v - 0.5) * 2.0));
}

void main()
{
    vec4 blip_color = texture2D(u_blip_texture, v_texture_coords);

    vec2 background_position = vec2(v_texture_coords.x, (v_texture_coords.y + vt_background.index) / vt_background.count);
    vec3 background_color = (texture2D(vt_background.texture, background_position) * u_alpha).rgb;

    vec2 static_position = vec2(v_texture_coords.x, (v_texture_coords.y + vt_static.index) / vt_static.count);
    vec3 static_color = sample_static().rgb;

    gl_FragColor = vec4(background_color + static_color * 0.66, 1.0);

    if(v_texture_coords.y > u_bar_offset && v_texture_coords.y < u_bar_offset + u_bar_width)
        gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 1.0, 1.0), 0.2);

    if(blip_color.r > 0.5)
        gl_FragColor = mix(gl_FragColor, blip_color, u_blip_alpha);
}   