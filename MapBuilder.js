import * as THREE from 'three';

export class MapBuilder {
    constructor(scene) {
        this.scene = scene;
        this.materials = {
            road: new THREE.MeshStandardMaterial({ color: 0x333333 }),
            ocean: new THREE.MeshStandardMaterial({ color: 0x006994, transparent: true, opacity: 0.8 }),
            ruko: new THREE.MeshStandardMaterial({ color: 0xaaaaaa }),
            warkop: new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
            landmark: new THREE.MeshStandardMaterial({ color: 0xffaa00 })
        };
    }

    async loadMapData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.buildCity(data);
            console.log("Vigi: Sistem tata kota Makassar berhasil dirender.");
            return true; 
        } catch (error) {
            console.error("Vigi: Gagal memuat data map.", error);
            return false; 
        }
    } // <-- Vigi: Kurung kurawal yang hilang sudah saya tambahkan di sini

    buildCity(data) {
        if (data.environment?.ocean) this.createOcean(data.environment.ocean);
        
        data.roads.forEach(road => this.createRoad(road));
        data.buildings.forEach(bldg => this.createBuilding(bldg));
        data.landmarks.forEach(lm => this.createLandmark(lm));
    }

    createOcean(oceanData) {
        const geometry = new THREE.PlaneGeometry(oceanData.size[0], oceanData.size[1]);
        const mesh = new THREE.Mesh(geometry, this.materials.ocean);
        mesh.rotation.x = -Math.PI / 2; 
        mesh.position.set(oceanData.position[0], oceanData.position[1] - 0.5, oceanData.position[2]);
        this.scene.add(mesh);
    }

    createRoad(road) {
        const dx = road.end[0] - road.start[0];
        const dz = road.end[1] - road.start[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        
        const geometry = new THREE.PlaneGeometry(road.width, length);
        const mesh = new THREE.Mesh(geometry, this.materials.road);
        
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.atan2(dz, dx) - Math.PI / 2;
        
        const midX = (road.start[0] + road.end[0]) / 2;
        const midZ = (road.start[1] + road.end[1]) / 2;
        mesh.position.set(midX, 0.01, midZ); 
        
        mesh.userData = { isRoad: true, name: road.name };
        this.scene.add(mesh);
    }

    createBuilding(bldg) {
        const geometry = new THREE.BoxGeometry(bldg.size[0], bldg.size[1], bldg.size[2]);
        const material = this.materials[bldg.type] || new THREE.MeshStandardMaterial({ color: bldg.color });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(bldg.position[0], bldg.size[1] / 2, bldg.position[1]);
        mesh.userData = { isBuilding: true, type: bldg.type };
        this.scene.add(mesh);
    }

    createLandmark(lm) {
        const geometry = new THREE.BoxGeometry(lm.size[0], lm.size[1], lm.size[2]);
        const material = new THREE.MeshStandardMaterial({ color: lm.color });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(lm.position[0], lm.size[1] / 2, lm.position[2]);
        mesh.userData = { isLandmark: true, name: lm.name, description: lm.description };
        this.scene.add(mesh);
    }
}