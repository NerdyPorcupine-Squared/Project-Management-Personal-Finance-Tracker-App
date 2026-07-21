const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let server;

async function createWindow() {
  try {
    // The API serves the built React files when running as a desktop app.
    const projectFiles = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
    process.env.CLIENT_DIST = path.join(projectFiles, 'client', 'dist');
    const localDatabase = path.join(app.getPath('userData'), 'finance.db');
    const templateDatabase = path.join(projectFiles, 'server', 'prisma', 'finance.db');
    if (!fs.existsSync(localDatabase)) fs.copyFileSync(templateDatabase, localDatabase);
    process.env.DATABASE_URL = `file:${localDatabase.replace(/\\/g, '/')}`;
    // This concept app runs entirely on one computer, so no external secret setup is needed.
    process.env.JWT_SECRET ||= 'local-finance-tracker-secret';
    const { startServer } = await import(path.join(projectFiles, 'server', 'src', 'app.js'));
    server = startServer(5000);

    const window = new BrowserWindow({
      width: 1100,
      height: 750,
      minWidth: 700,
      minHeight: 500,
      webPreferences: { contextIsolation: true, nodeIntegration: false }
    });
    window.loadURL('http://localhost:5000');
  } catch (error) {
    dialog.showErrorBox('Unable to start Personal Finance Tracker', error.message);
    app.quit();
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', () => server?.close());
