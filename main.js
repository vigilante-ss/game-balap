import * as THREE from 'three';
import { MapBuilder } from './MapBuilder.js';

// Setup standar Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Langit biru
// ... setup camera, renderer, lighting ...

// Panggil Vigi untuk membangun kota
const cityBuilder = new MapBuilder(scene);
cityBuilder.loadMapData('./map.json'); // Pastikan path sesuai

// ... animation loop ...