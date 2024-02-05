export class SceneSetup {
    constructor() {
        this.renderCanvas = document.getElementById('rendered-view');
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.renderCanvas.clientWidth, this.renderCanvas.clientHeight);
        this.renderCanvas.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, this.renderCanvas.clientWidth / this.renderCanvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 1.8;

        this.scene = new THREE.Scene();

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        material = new THREE.RawShaderMaterial({
            vertexShader: vertexShaderCode,
            fragmentShader: fragmentShaderCode,
            glslVersion: THREE.GLSL3,
        });

        this.sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
        this.sphere = new THREE.Mesh(this.sphereGeometry, material);

        this.currentGeometry = this.sphere;
        this.scene.add(this.sphere);
        document.getElementById('shapeType').value = 'sphere';

        this.animate();

        document.getElementById('shapeType').addEventListener('change', (event) => {
            this.switchGeometry(event.target.value);
        });

        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.renderer.setSize(this.renderCanvas.clientWidth, this.renderCanvas.clientHeight);
        this.camera.aspect = this.renderCanvas.clientWidth / this.renderCanvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    switchGeometry(geometryType) {
        if (this.currentGeometry) this.scene.remove(this.currentGeometry);

        if (geometryType === 'cube') {
           const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
           this.currentGeometry = new THREE.Mesh(cubeGeometry, window.material);
           this.scene.add(this.currentGeometry);
           this.camera.position.z = 1.8;
        }
        if (geometryType === 'sphere') {
            const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
            this.currentGeometry = new THREE.Mesh(sphereGeometry, window.material);
            this.scene.add(this.currentGeometry);
            this.camera.position.z = 1.8;
        }
        if (geometryType === 'quad') {
            const quadGeometry = new THREE.PlaneGeometry(1, 1);
            this.currentGeometry = new THREE.Mesh(quadGeometry, window.material);
            this.scene.add(this.currentGeometry);
            this.camera.position.z = 0.8;
        }
    }

}
