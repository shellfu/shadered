import { SceneSetup } from './scene.js';
import { ShaderManager } from './shader_manager.js';
import { ShaderEditor } from './shader_editor.js';
import { UIController } from './ui_controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'block';

    document.querySelector('.close-button').onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const originalConsoleError = console.error;
    console.error = function (message, ...optionalParams) {
        if (message.includes('THREE.WebGLProgram: Shader Error')) {
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
            originalConsoleError.apply(console, [message, ...optionalParams]);
        }
    };

    async function setupApplication() {
        try {
            const vshResponse = await fetch('./snippets/default_vertex_shader.glsl');
            const fshResponse = await fetch('./snippets/default_fragment_shader.glsl');
            if (!vshResponse.ok || !fshResponse.ok) {
                throw new Error('Shader file fetch failed');
            }

            window.vertexShaderCode = await vshResponse.text();
            window.fragmentShaderCode = await fshResponse.text();

            await loadShadersFromLocalStorage();

            const sceneSetup = new SceneSetup();
            const shaderManager = new ShaderManager(sceneSetup.scene, window.material);
            const editor = new ShaderEditor('editor', shaderManager);
            const uiController = new UIController(editor, shaderManager);

            editor.setValue(window.fragmentShaderCode);
            sceneSetup.animate();

            attachEditorEventListeners(editor);
        } catch (error) {
            console.error('An error occurred during application setup:', error);
        }
    }

    function saveShadersToLocalStorage(vertexShaderContent, fragmentShaderContent) {
        localStorage.setItem('vertexShaderContent', vertexShaderContent);
        localStorage.setItem('fragmentShaderContent', fragmentShaderContent);
    }

    async function loadShadersFromLocalStorage() {
        const savedVertexShader = localStorage.getItem('vertexShaderContent');
        const savedFragmentShader = localStorage.getItem('fragmentShaderContent');

        window.vertexShaderCode = savedVertexShader || window.vertexShaderCode;
        window.fragmentShaderCode = savedFragmentShader || window.fragmentShaderCode;
    }

    function attachEditorEventListeners(editor) {
        editor.editor.session.on('change', () => {
            const vertexShaderContent = editor.getVertexShaderContent();
            const fragmentShaderContent = editor.getFragmentShaderContent();

            saveShadersToLocalStorage(vertexShaderContent, fragmentShaderContent);
        });
    }

    setupApplication().catch(error => {
        console.error('An error occurred:', error);
    });
});

