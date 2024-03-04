import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; //// importo el io 

//// CONECTO EL IO DE BACK Y LO LLAMO SOCKET
const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [valueName, setValueName] = useState('');

  useEffect(() => {
    socket.on('chat message', message => { //// RECIBO EL MENSAJE DEL SERVIDOR Y LO SETEO EN SETMENSAGES, LO AGREGO.  (TIPO PUSH)
      setMessages([...messages, message]); //// le agrega a los mensajes el mensaje 
    });
  }, [messages]); //// ESTE USEEFFECT SE EJECUTA CUANDO ESCUCHA CHAT MESSAGE (lo emite en sendMessage) - y no cuando cambia mensaje por set


  const sendMessage = () => {
    const objMsj = { user: user, mensaje: inputValue } //// FORMATEO EL MENSAJE, CREANDOLO COMO OBJETO
    socket.emit('chat message', objMsj); //// ENVIO ESE OBJETO AL SERVIDOR 
    setInputValue(''); //// REINICIA EL VALOR DEL INPUT EN " "
  };

  const setName = () => {
    setUser(valueName);
  };


  return (
    <div style={{ margin: "2% 0% 0% 2%" }}>
      <p style={{ fontWeight: 800 }}>BIENVENIDO AL CHAT</p>
      {user === "" ? (
        <>
          <p>COLOCA TU NOMBRE</p>
          <input
            type="text"
            placeholder='nombre'
            value={valueName}
            onChange={e => setValueName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setName();
              }
            }}
          />
          <button onClick={setName}>Nombre</button>
        </>
      ) : (
        <div>
          <p>MENSAJE A ENVIAR</p>
          <textarea
            style={{ width: '400px', height: '50px' }}
            placeholder='mensaje'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button style={{ margin: "1% 1% 0% 2%" }} onClick={sendMessage}>Enviar</button>

          <div style={{ margin: "5% 0% 0% 2%" }}>
            {messages.length !== 0 ? (
              messages.map((message, index) => (
                <div key={index}>
                  <div style={{ fontWeight: 600, display: "contents" }}> {message.user}</div>: {message.mensaje}
                </div>
              ))
            ) : (
              <p style={{ color: 'gray' }} >CHAT VACIO</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;