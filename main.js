// ES6 Module Imports
import { SceneSetup } from './scene.js';
import { ShaderManager } from './shader_manager.js';
import { ShaderEditor } from './shader_editor.js';
import { UIController } from './ui_controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const originalConsoleError = console.error;
    console.error = function (message, ...optionalParams) {
        if (message.includes('THREE.WebGLProgram: shader error')) {
            let formattedMessage = `<strong>Error:</strong> ${message}<br>`;
            optionalParams.forEach(param => {
                formattedMessage += `<code>${param}</code><br>`;
            });
            document.getElementById('shaderErrorContent').innerHTML = formattedMessage;

            const toggleButton = document.getElementById('toggleShaderError');
            if (toggleButton) {
                toggleButton.classList.add('error', 'blink');
                toggleButton.textContent = 'view compile errors!';
            }
        } else {
            // For all other types of errors, call the original console.error
            originalConsoleError.apply(console, [message, ...optionalParams]);
        }
    };

    // Setup application
    async function setupApplication() {
        try {
            // Fetch shader codes
            const vshResponse = await fetch('./snippets/default_vertex_shader.glsl');
            const fshResponse = await fetch('./snippets/default_fragment_shader.glsl');
            if (!vshResponse.ok || !fshResponse.ok) {
                throw new Error('Shader file fetch failed');
            }

            window.vertexShaderCode = await vshResponse.text();
            window.fragmentShaderCode = await fshResponse.text();

            // Shader material setup
            window.material = new THREE.ShaderMaterial({
                uniforms: {
                    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    time: { value: 0.0 },
                },
                vertexShader: window.vertexShaderCode,
                fragmentShader: window.fragmentShaderCode
            });

            const sceneSetup = new SceneSetup();
            const shaderManager = new ShaderManager(sceneSetup.scene, window.material);
            const editor = new ShaderEditor('editor', shaderManager);
            const uiController = new UIController(editor, shaderManager);

            // Initial shader code setup in editor
            editor.setValue(window.fragmentShaderCode); // Set initial value
            sceneSetup.animate();
        } catch (error) {
            console.error('An error occurred during application setup:', error);
        }
    }

    setupApplication().catch(error => {
        console.error('An error occurred:', error);
    });
});
