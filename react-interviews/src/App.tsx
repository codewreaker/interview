import useLocalStorage, {} from './hooks/useLocalStorage'
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
  const [uName, setUname] = useLocalStorage<string>('username', 'Israel');
  const updateName=(e:React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const newUserName = (new FormData(e.currentTarget)).get('user') as string | null;
    newUserName && setUname(newUserName);

  }
  return (
    <div className="app">
      <div className="logo-container">
        <img src={logo} alt="Bun Logo" className="logo bun-logo" />
        <img src={reactLogo} alt="React Logo" className="logo react-logo" />
      </div>

      <h1>Bun + React</h1>
      <p>
        Welcome <code>{uName}</code>
      </p>
      <form onSubmit={updateName}>
        <input placeholder={uName} name='user'/>
      </form>
    </div>
  );
}

export default App;
