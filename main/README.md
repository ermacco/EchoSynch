Here's an example of how to load and display a .glb model using Three.js:

1. Place your `.glb` file in the same directory as your HTML file (or adjust the path in `loader.load()`)
2. Serve the files through a local web server (important for model loading to work properly)
3. Open in a web browser

Key features included:
- Basic Three.js scene setup
- Ambient and directional lighting
- GLB model loading
- Window resize handling
- Animation loop
- Error handling and loading progress

You might need to adjust:
- Camera position (`camera.position.z` and `camera.position.y`)
- Model scale (uncomment and modify `model.scale.set()`)
- Lighting intensity and position
- Model rotation in the animation loop

For best results:
- Use models that are properly scaled (1 unit = 1 meter in most 3D apps)
- Optimize your 3D model for web display
- Consider adding loading indicators for larger models
- Add OrbitControls for interactive camera controls (see three.js examples)
