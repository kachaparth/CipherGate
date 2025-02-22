import { useState } from 'react'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFile = () => {
    if (!selectedFile) {
      console.error("No file selected!")
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    fetch('http://localhost:8000/uploadFile', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => console.log('Success:', data))
      .catch((error) => console.error("Upload failed:", error))
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={() => window.electron.ipcRenderer.send('ping')}>
            Send IPC
          </a>
        </div>
        <div className="action">
          <input type="file" id="fileInput" onChange={handleFileChange} />
          <button onClick={uploadFile}>Upload</button>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
