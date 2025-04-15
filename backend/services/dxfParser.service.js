const DxfParser = require('dxf-parser');
const fs = require('fs');

class DxfParserService {
  static async parseDxfFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        const parser = new DxfParser();
        try {
          const dxf = parser.parseSync(data);
          resolve(dxf);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }

  static extractBlocks(dxfData) {
    if (!dxfData || !dxfData.blocks) return [];

    return Object.entries(dxfData.blocks).map(([name, block]) => {
      // Get the first entity's position as block position (simplified)
      let x = 0, y = 0, z = 0;
      if (block.entities && block.entities.length > 0) {
        const firstEntity = block.entities[0];
        if (firstEntity.vertices && firstEntity.vertices.length > 0) {
          x = firstEntity.vertices[0].x;
          y = firstEntity.vertices[0].y;
          z = firstEntity.vertices[0].z || 0;
        } else if (firstEntity.position) {
          x = firstEntity.position.x;
          y = firstEntity.position.y;
          z = firstEntity.position.z || 0;
        }
      }

      return {
        name,
        type: block.type || 'BLOCK',
        layer: block.layer || '0',
        x,
        y,
        z,
        properties: {
          entitiesCount: block.entities ? block.entities.length : 0,
        },
      };
    });
  }
}

module.exports = DxfParserService;