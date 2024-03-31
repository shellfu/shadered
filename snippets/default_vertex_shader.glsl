// Vertex Shader for WebGL and Three.js
// This shader handles transforming vertex positions, normals, and passing texture coordinates.

// Uniforms documentation: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

// Matrix that transforms model coordinates to world coordinates. Not used directly here, but important for understanding transformations.
uniform mat4 modelMatrix;

// Matrix transforming world coordinates to view (camera) coordinates. Contributes to modelViewMatrix.
uniform mat4 viewMatrix;

// Combines model and view transformations. Used for transforming vertex positions to view space for lighting and perspective calculations.
uniform mat4 modelViewMatrix;

// Projects 3D view-space coordinates to 2D screen space. Essential for rendering the model from the camera's perspective.
uniform mat4 projectionMatrix;

// Transforms normals to view space, ensuring they are correctly oriented for lighting calculations after model transformations.
uniform mat3 normalMatrix;

// Vertex attributes provided by Three.js or custom geometry

// Vertex position in model (local) space.
in vec3 position;

// Normal vector associated with the vertex, used for lighting.
in vec3 normal;

// Texture coordinates for the vertex, used for texturing.
in vec2 uv;

// Outputs to the fragment shader

// Passes transformed vertex position in view space to the fragment shader. Essential for lighting calculations.
out vec3 fragPosition;

// Passes transformed normal vector to the fragment shader, ensuring correct lighting.
out vec3 fragNormal;

// Passes texture coordinates directly to the fragment shader for texturing.
out vec2 fragTexCoord;

// Passes transformed vertex position in world space to the fragment shader.
// This is crucial for effects and calculations that must be consistent regardless of the camera's viewpoint, such as environmental noise or global illumination.
out vec3 worldPosition;

void main() {
    // Transform vertex position from model space to view space using the modelViewMatrix.
    // This is crucial for view-dependent calculations like lighting, as it places vertices relative to the camera's viewpoint.
    fragPosition = vec3(modelViewMatrix * vec4(position, 1.0));

    // Transform vertex position from model space to world space.
    // The modelMatrix transforms local coordinates to global coordinates, enabling world-space calculations in the fragment shader.
    // This is essential for effects that are independent of the viewer's perspective, ensuring consistent visual appearance.
    worldPosition = vec3(modelMatrix * vec4(position, 1.0));

    // Normalize the normal vector and transform it to view space using normalMatrix.
    // Proper transformation of normals is vital for accurate lighting, especially after model transformations that include non-uniform scaling.
    fragNormal = normalize(normalMatrix * normal);

    // Pass texture coordinates directly to the fragment shader without transformation.
    // Texture coordinates are typically defined in [0, 1] space and are not affected by model or view transformations.
    fragTexCoord = uv;

    // Calculate the final position of the vertex in clip space.
    // projectionMatrix maps the view-space coordinates to screen space, completing the vertex's journey through the rendering pipeline.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
