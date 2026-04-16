import fs from 'fs';

function inspect(file: string) {
  const buffer = fs.readFileSync(file);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonStr);
  
  console.log(`\n--- ${file} ---`);
  json.images?.forEach((img: any, i: number) => {
    console.log(`  Image [${i}] ${img.name || img.uri}`);
  });
  json.textures?.forEach((tex: any, i: number) => {
    console.log(`  Texture [${i}] source=${tex.source}`);
  });
  json.materials?.forEach((m: any, i: number) => {
    const texIndex = m.pbrMetallicRoughness?.baseColorTexture?.index;
    const source = texIndex !== undefined ? json.textures[texIndex]?.source : undefined;
    const imgName = source !== undefined ? json.images[source]?.name : undefined;
    console.log(`  Material [${i}] ${m.name}: image=${imgName}`);
  });
}

inspect('public/Cristiano_Ronaldo.glb');
inspect('public/Lamin_Yamal.glb');
