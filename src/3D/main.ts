import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TimelineMax, Expo} from 'gsap'
import { Geometry, Points, PointsMaterial } from 'three';


export class RENDERER {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    material: PointsMaterial
    particleGeometry: Geometry
    particleCloud: any
    objects: THREE.Mesh[]
    theta: number
    WIDTH: number
    HEIGHT: number
    SEPARATION: number

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000)
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.material = new PointsMaterial({color: 0xf7f7f7 })
        this.particleGeometry = new Geometry()
        this.particleCloud = null
        this.objects = []
        this.theta = 0
        this.WIDTH = 100
        this.HEIGHT = 100
        this.SEPARATION = 8

        // Resize screen 
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix()
        })
        
        
        this.initialize()
        this.addParticleGeometry()
        this.initControls()
        this.render()
    }

    render = () => {

        // https://stackoverflow.com/questions/43845399/how-to-make-an-animated-wave-in-threejs
        let index = 0
        let time = Date.now() * 0.00005
        let h = (360 * (1.0 + time) % 360) / 360
        this.material.color.setHSL(h, 0.5, 0.5)

        this.theta += 0.0008
        
        if (this.particleCloud) {
            for (let x=0; x < this.WIDTH; x++) {
                for (let z =0; z < this.HEIGHT; z++) {
                    this.particleCloud.geometry.vertices[index].y = (
                        Math.cos((x / this.WIDTH * Math.PI * 8 + this.theta)) + 
                        Math.sin((z / this.HEIGHT * Math.PI * 8 + this.theta))
                    )*10
                    index++
                }
            }
            this.particleCloud.geometry.verticesNeedUpdate = true
        }
        window.requestAnimationFrame(this.render);
        this.controls.update()

        this.renderer.render(this.scene, this.camera);
    }

    initialize = () => {
        this.camera.position.set(400, 50, 400)

        this.renderer.setClearColor("#202020")
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        // Insert scene to DOM
        let element = document.getElementById('canavs-id')
        if (element) element.appendChild(this.renderer.domElement)
    }

    initControls = () => {
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enablePan = true
        this.controls.enableZoom = true

        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    addParticleGeometry = () => {
        for (let x = 0; x < this.WIDTH; x++) {
            for (let z = 0; z < this.HEIGHT; z++) {
                let vert = new THREE.Vector3()
                vert.x = x * this.SEPARATION - ((this.WIDTH * this.SEPARATION) / 2)
                vert.y = (Math.cos(x / this.WIDTH) * Math.PI * 6) + Math.sin((z / this.HEIGHT) * Math.PI * 6)
                vert.z = z * this.SEPARATION - ((this.HEIGHT * this.SEPARATION) / 2)
                this.particleGeometry.vertices.push(vert)
            } 
        }
        this.particleCloud = new Points(this.particleGeometry, this.material)
        this.scene.add(this.particleCloud)
    }
}