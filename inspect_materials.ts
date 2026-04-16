import fs from 'fs';

function inspect(file: string) {
  const content = fs.readFileSync(file, 'utf8');
  // This is a binary file, so reading as utf8 might be messy, but we can look for JSON chunks.
  // The GLB format has a JSON chunk at the beginning.
  const buffer = fs.readFileSync(file);
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546C67) return; // 'glTF'
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.readUInt32LE(16);
  if (chunkType !== 0x4E4F534A) return; // 'JSON'
  
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonStr);
  
  console.log(`\n--- ${file} ---`);
  console.log('Materials:');
  json.materials?.forEach((m: any, i: number) => console.log(`  [${i}] ${m.name}`));
  console.log('Meshes:');
  json.meshes?.forEach((m: any, i: number) => {
    console.log(`  [${i}] ${m.name}`);
    m.primitives?.forEach((p: any) => {
      console.log(`    Material: ${p.material !== undefined ? json.materials[p.material].name : 'none'}`);
    });
  });
}

inspect('public/Cristiano_Ronaldo.glb');
inspect('public/Kobe.glb');
inspect('public/Lamin_Yamal.glb');
