import { useEffect, useState } from 'react'
import Layout from '../components/Layout'


const IndexPage = () => {
  useEffect(() => {
    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', (_event, args) => {
      alert(args)
    })
  }, [])
  const [files, setFiles] = useState();

  const handleUploadFile = (event:any) => {
    setFiles(event.target.files);
  }
  const handleProcessFile = () => {
    var fileText = ''
    if(files !== undefined){
      // @ts-ignore
      for(var i = 0; i < files.length; i++){
        var file = new FileReader();
        file.onload = async (e) => {
          // @ts-ignore
          const text = (e.target.result)
          //console.log(text)
          fileText = `${fileText+text}`
          var b = fileText.split('');
          var x = b.map( value => {
            if(value.charCodeAt(0)>122){
              return `'||chr(${value.charCodeAt(0)})||'`
            }else{
              return value;
            }
          })
          var textOut = x.join('');
          const outFile = new Blob([textOut], {type: 'text/plain'});
          const element = document.createElement("a");
          element.href = URL.createObjectURL(outFile);
          // @ts-ignore
          element.download = `${files[0].name.replace('.sql', '')}-converted.sql`;
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        }
        // @ts-ignore
        file.readAsText(files[i])
      }
    }


  }

  return (
    <Layout title={""}>
      <h1>Olá Bem vindo</h1>
        <div style={{display: "flex", flexGrow: 1,justifyContent:"center", alignItems: "center", height:"200px"}}>
            <input type={'file'} onChange={ (event) => handleUploadFile(event)}/>
            <button onClick={handleProcessFile}>Process</button>
        </div>
    </Layout>
  )
}

export default IndexPage
