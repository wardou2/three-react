import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class RENDERER {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Resize screen 
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix()
        })
        
        this.initialize()
        this.addLights()
        this.addObjects()
        this.initControls()
        this.render()
    }

    render = () => {
        window.requestAnimationFrame(this.render);
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
    }

    initialize = () => {
        this.camera.position.set(8, 8, 8)

        this.renderer.setClearColor("#e5e5e5")
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        // Insert scene to DOM
        let element = document.getElementById('canavs-id')
        if (element) element.appendChild(this.renderer.domElement)
    }

    addLights = () => {
        let light = new THREE.PointLight(0xFFFFFF, 1, 1000)
        light.position.set(0,0,0)
        light.castShadow = true
        this.scene.add(light)

        light = new THREE.PointLight(0xFFFFFF, 2, 0)
        light.position.set(0,0,25)
        light.castShadow = true
        this.scene.add(light)
    }

    initControls = () => {
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enablePan = true
        this.controls.enableZoom = true
        this.controls.autoRotate = true

        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    addObjects = () => {
        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let material = new THREE.MeshLambertMaterial({color: 0xf7f7f7 })

        for (let i=0; i<15; i++) {
            let mesh = new THREE.Mesh(geometry, material)
            mesh.position.x = (Math.random() - 0.5)*10
            mesh.position.y = (Math.random() - 0.5)*10
            mesh.position.z = (Math.random() - 0.5)*10
            this.scene.add(mesh)
        }
    }
}