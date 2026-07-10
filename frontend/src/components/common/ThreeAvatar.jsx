import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeAvatar = ({ animationName }) => {
  const containerRef = useRef();
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    // 1. Tạo scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a202c);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ánh sáng
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // 5. Load model
    const loader = new GLTFLoader();
    loader.load(
      '/models/avatar.glb',
      (gltf) => {
        scene.add(gltf.scene);
        const mixer = new THREE.AnimationMixer(gltf.scene);
        mixerRef.current = mixer;

        // Lưu các animation actions
        const actions = {};
        gltf.animations.forEach((clip) => {
          actions[clip.name] = mixer.clipAction(clip);
        });
        actionsRef.current = actions;

        // Nếu có animationName, phát
        if (animationName && actions[animationName]) {
          actions[animationName].play();
        }
      },
      undefined,
      (error) => {
        console.error('Lỗi tải model:', error);
      }
    );

    // 6. Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(0.016);
      }
      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Phát animation khi animationName thay đổi
  useEffect(() => {
    if (animationName && actionsRef.current) {
      const actions = actionsRef.current;
      // Dừng tất cả
      Object.values(actions).forEach((action) => action.stop());
      // Phát action mới
      if (actions[animationName]) {
        actions[animationName].reset().fadeIn(0.3).play();
      }
    }
  }, [animationName]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      className="rounded-xl overflow-hidden"
    />
  );
};

export default ThreeAvatar;