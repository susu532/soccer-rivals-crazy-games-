import fs from 'fs';

function inspect(file: string) {
  const buffer = fs.readFileSync(file);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonStr);
  
  console.log(`\n--- ${file} ---`);
  json.materials?.forEach((m: any, i: number) => {
    const color = m.pbrMetallicRoughness?.baseColorFactor;
    const texture = m.pbrMetallicRoughness?.baseColorTexture;
    console.log(`  Material [${i}] ${m.name}: color=${color}, texture=${texture ? 'yes' : 'no'}`);
  });
  json.meshes?.forEach((m: any, i: number) => {
    console.log(`  Mesh [${i}] ${m.name}: material=${m.primitives?.[0]?.material}`);
  });
}

inspect('public/Cristiano_Ronaldo.glb');
inspect('public/Lamin_Yamal.glb');
