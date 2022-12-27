import React from 'react'
import './App.css';
import { useAppContext } from './context';

function App() {
  const { name, message, setName, setMessage, coffees, buyCoffee, withdrawAllTips } = useAppContext();

  const handleClick = e => {
    e.preventDefault();
    buyCoffee();
  }


  const handleRecieve = e => {
       withdrawAllTips();
  }

  return (
    <div className="App">
      <button onClick={handleRecieve}>Recieve</button>
        <form>
          <label htmlFor='name'>Name</label>
          <input 
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor='message'>Message</label>
          <input
          name="message"
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           />
          <button onClick={handleClick}>Send</button>
        </form>
        <div className='coffees'>
          <div className='coffees_center'>
          {
            coffees.map(coffee => {
                const { from, timestamp, name, message } = coffee;
                // console.log(from,timestamp._hex, name, message)
                return <div key={timestamp} className="coffee">
                  <p><span>From : </span>{from}</p>
                  <p><span>Name : </span>{name}</p>
                  <p><span>Message : </span>{message}</p>
                </div>
            })
          }
          </div>
        </div>
    </div>
  );
}

export default App;
