import fs from 'fs';

function inspect(file: string) {
  const buffer = fs.readFileSync(file);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonStr);
  
  console.log(`\n--- ${file} ---`);
  json.meshes?.forEach((m: any, i: number) => {
    const matIdx = m.primitives?.[0]?.material;
    const mat = json.materials?.[matIdx];
    const texIdx = mat?.pbrMetallicRoughness?.baseColorTexture?.index;
    const sourceIdx = texIdx !== undefined ? json.textures?.[texIdx]?.source : undefined;
    const imgName = sourceIdx !== undefined ? json.images?.[sourceIdx]?.name || json.images?.[sourceIdx]?.uri : undefined;
    console.log(`  Mesh ${m.name}: Material ${mat?.name}, Image ${imgName}`);
  });
}

inspect('public/Cristiano_Ronaldo.glb');
