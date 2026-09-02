import express from 'express';
import * as archiverModule from 'archiver';
import path from 'path';
import fs from 'fs';

// Handle archiver function across ESM and CJS
const archiver = ((archiverModule as any).default || archiverModule) as any;



export function setupDownloadRoute(app: express.Express) {
  // Metadata endpoint to let frontend verify file size and readiness
  app.get('/api/export/info', (req, res) => {
    try {
      const rootDir = process.cwd();
      const backupPath = path.join(rootDir, 'project_backup.zip');
      
      let sizeBytes = 0;
      if (fs.existsSync(backupPath)) {
        sizeBytes = fs.statSync(backupPath).size;
      }

      res.json({
        ready: true,
        filename: 'healthnet-clinical-ai-v1.zip',
        sizeBytes,
        sizeMB: (sizeBytes / (1024 * 1024)).toFixed(1),
        status: 'READY'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Streaming ZIP Download Endpoint
  app.get('/api/export/zip', async (req, res) => {
    try {
      const rootDir = process.cwd();
      const backupPath = path.join(rootDir, 'project_backup.zip');
      const zipFileName = 'healthnet-clinical-ai-v1.zip';

      // Fast path: If pre-generated archive exists on disk, stream it immediately
      if (fs.existsSync(backupPath)) {
        const stat = fs.statSync(backupPath);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Cache-Control', 'no-cache');
        
        const stream = fs.createReadStream(backupPath);
        stream.pipe(res);
        return;
      }

      // Dynamic stream fallback via archiver
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      res.setHeader('Cache-Control', 'no-cache');

      const archive = archiver('zip', {
        zlib: { level: 4 } // Fast zlib compression
      });

      archive.on('error', (err) => {
        console.error('Archiver error:', err);
        if (!res.headersSent) {
          res.status(500).send({ error: err.message });
        }
      });

      archive.pipe(res);

      // Append files ignoring node_modules, .git, dist, etc.
      archive.glob('**/*', {
        cwd: rootDir,
        ignore: [
          'node_modules/**',
          '.git/**',
          'dist/**',
          '.cache/**',
          '.upm/**',
          '.temp/**',
          'project_backup.zip'
        ],
        dot: true
      });

      await archive.finalize();
    } catch (error: any) {
      console.error('Export zip error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to package repository', message: error?.message });
      }
    }
  });
}

