#version 450

layout (location = 0) in vec3 inNormal;
layout (location = 1) in vec3 inColor;
layout (location = 2) in vec3 inWorldPos;

layout (location = 0) out vec4 outColor;
layout (location = 1) out vec4 outPosition;
layout (location = 2) out vec4 outNormal;
layout (location = 3) out vec4 outAlbedo;

layout (constant_id = 0) const float NEAR_PLANE = 0.1f;
layout (constant_id = 1) const float FAR_PLANE = 256.0f;

// 非线性转线性深度
float linearDepth(float depth)
{
    // 将深度从[0, 1]映射到[-1, 1]
	float z = depth * 2.0f - 1.0f; 
	
	// 使用透视深度映射的逆运算，将非线性深度映射到线性深度
	return (2.0f * NEAR_PLANE * FAR_PLANE) / (FAR_PLANE + NEAR_PLANE - z * (FAR_PLANE - NEAR_PLANE));	
}

void main() 
{
	outPosition = vec4(inWorldPos, 1.0);

	vec3 N = normalize(inNormal);	// 莫得纹理贴图用
	N.y = -N.y;
	outNormal = vec4(N, 1.0);

	outAlbedo.rgb = inColor;

	// Store linearized depth in alpha component
	outPosition.a = linearDepth(gl_FragCoord.z);

	// Write color attachments to avoid undefined behaviour (validation error)
	outColor = vec4(0.0);
}