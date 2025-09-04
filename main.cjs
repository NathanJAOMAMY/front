// main.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');
// const startServer = require('./server/src');


// userDataPath = app.getPath('userData')


// Ouvrir la userData - là où serait stocker tous les fichiers
// const { shell } = require('electron');
// shell.openPath(userDataPath);



// Dossier contenant les images uploadées



// === FENÊTRE ELECTRON ===
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // Charge l'app React buildée
  win.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}`);

  // Pour debug (optionnel)
  // win.webContents.openDevTools();
}

app.whenReady().then(()=>{  
  
  // const uploadDir = path.join(app.getPath('userData'));
  // // Démarre le serveur Express en mode Electron
  // startServer({
  //   port: 3001,
  //   uploadPath: uploadDir,
  //   allowedOrigin: '*' // ou 'file://', à ajuster si besoin
  // });

  // Appel de la fonction createWindow
  createWindow()
});
