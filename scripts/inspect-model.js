import fs from 'fs';

const modelPath = process.argv[2] || 'public/models/shoe-draco.glb';
const buf = fs.readFileSync(modelPath);
const chunk0Length = buf.readUInt32LE(12);
const jsonText = buf.toString('utf8', 20, 20 + chunk0Length);
const gltf = JSON.parse(jsonText);

console.log('--- GLB INSPECTION REPORT ---');
console.log('Meshes:', JSON.stringify(gltf.meshes?.map((m, i) => ({
  index: i,
  name: m.name,
  primitives: m.primitives?.map(p => ({
    materialIndex: p.material,
    materialName: gltf.materials?.[p.material]?.name,
    extensions: p.extensions
  }))
})), null, 2));

console.log('Materials:', JSON.stringify(gltf.materials?.map((m, i) => ({
  index: i,
  name: m.name,
  pbrMetallicRoughness: m.pbrMetallicRoughness
})), null, 2));

console.log('Nodes:', JSON.stringify(gltf.nodes?.map((n, i) => ({
  index: i,
  name: n.name,
  meshIndex: n.mesh
})), null, 2));

if (gltf.extensions?.KHR_materials_variants) {
  console.log('KHR_materials_variants:', JSON.stringify(gltf.extensions.KHR_materials_variants, null, 2));
}
