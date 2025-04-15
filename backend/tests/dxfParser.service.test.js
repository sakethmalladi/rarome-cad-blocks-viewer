const DxfParserService = require('../services/dxfParser.service');
const fs = require('fs');
const path = require('path');

describe('DxfParserService', () => {
  describe('parseDxfFile', () => {
    it('should parse a simple DXF file', async () => {
      const testFilePath = path.join(__dirname, 'test.dxf');
      // Create a minimal DXF file for testing
      const dxfContent = `
        0
        SECTION
        2
        BLOCKS
        0
        BLOCK
        8
        0
        2
        TEST_BLOCK
        0
        LINE
        8
        0
        10
        1.0
        20
        2.0
        30
        3.0
        11
        4.0
        21
        5.0
        31
        6.0
        0
        ENDBLK
        0
        ENDSEC
        0
        EOF
      `;
      
      fs.writeFileSync(testFilePath, dxfContent);
      
      const result = await DxfParserService.parseDxfFile(testFilePath);
      
      expect(result).toBeDefined();
      expect(result.blocks).toBeDefined();
      expect(result.blocks.TEST_BLOCK).toBeDefined();
      
      // Clean up
      fs.unlinkSync(testFilePath);
    });

    it('should throw an error for invalid DXF file', async () => {
      const testFilePath = path.join(__dirname, 'invalid.dxf');
      fs.writeFileSync(testFilePath, 'invalid content');
      
      await expect(DxfParserService.parseDxfFile(testFilePath))
        .rejects
        .toThrow();
      
      // Clean up
      fs.unlinkSync(testFilePath);
    });
  });

  describe('extractBlocks', () => {
    it('should extract blocks from DXF data', () => {
      const dxfData = {
        blocks: {
          TEST_BLOCK: {
            type: 'BLOCK',
            layer: '0',
            entities: [
              {
                type: 'LINE',
                vertices: [
                  { x: 1, y: 2, z: 3 },
                  { x: 4, y: 5, z: 6 },
                ],
              },
            ],
          },
        },
      };
      
      const blocks = DxfParserService.extractBlocks(dxfData);
      
      expect(blocks).toHaveLength(1);
      expect(blocks[0].name).toBe('TEST_BLOCK');
      expect(blocks[0].x).toBe(1);
      expect(blocks[0].y).toBe(2);
      expect(blocks[0].z).toBe(3);
    });

    it('should return empty array for DXF data without blocks', () => {
      const dxfData = {};
      const blocks = DxfParserService.extractBlocks(dxfData);
      expect(blocks).toHaveLength(0);
    });
  });
});