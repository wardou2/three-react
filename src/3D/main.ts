import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TimelineMax, Expo} from 'gsap'
import { request } from 'http';


export class RENDERER {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    objects: THREE.Mesh[]

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.objects = []

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
        // window.addEventListener('mousemove', this.onMouseMove)
    }

    render = () => {
        window.requestAnimationFrame(this.render);
        this.controls.update()

        this.renderer.render(this.scene, this.camera);
    }

    initialize = () => {
        this.camera.position.set(0,0,100)

        this.renderer.setClearColor("#202020")
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        // Insert scene to DOM
        let element = document.getElementById('canavs-id')
        if (element) element.appendChild(this.renderer.domElement)
    }

    addLights = () => {
        let light = new THREE.PointLight(0xFFFFFF, 1, 1000)
        light.position.set(0,0,-150)
        light.castShadow = true
        this.scene.add(light)

        light = new THREE.PointLight(0xFFFFFF, 2, 0)
        light.position.set(0,0,150)
        light.castShadow = true
        this.scene.add(light)
    }

    initControls = () => {
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enablePan = true
        this.controls.enableZoom = true

        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    addObjects = () => {
        let geometry = new THREE.SphereGeometry(.1, 9, 9)
        let material = new THREE.MeshLambertMaterial({color: 0xf7f7f7 })

        for (let x=-10; x<10; x++) {
            for (let y=-10; y<10; y++) {
                for (let z=-10; z<0; z++) {
                let mesh = new THREE.Mesh(geometry, material)
                    mesh.position.x = (x)*10
                    mesh.position.y = (y)*10
                    mesh.position.z = (z)*10
                    // mesh.position.z = 0
                    this.objects.push(mesh)
                    this.scene.add(mesh)
                }
            }
        }
    }

    onMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let i=0; i < intersects.length; i++) {
            let tl = new TimelineMax().delay(.3)
            tl.to(intersects[i].object.scale, 1, {x: 2, ease: Expo.easeOut})
            tl.to(intersects[i].object.scale, 1, {y: 2, ease: Expo.easeOut}, "=-1")
        }
    }
}