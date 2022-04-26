import { useState, useEffect } from 'react';
import './App.css';

interface FetchProps {
  (type: string): void;
}
interface Data {
  id: string;
  html_url: string;
  name: string;
}

function App() {
  const [repos, setRepos] = useState({
    data: [],
    loading: true
  });

  const handleFetchData: FetchProps = async(type) => {
    let url = `https://api.github.com/orgs/vercel/repos?type=${type}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      setRepos({data: json, loading: false});
    } catch (error) {
      console.log('error', error);
    }
}

  useEffect(() => {
    handleFetchData('forks');
  }, [setRepos]);

  return (
    <div className="App">
      <ul>
        {
          repos.loading? '' : repos.data.map(({id, html_url, name}: Data) => (
          <li key={id}>
            <a href={html_url}>{name}</a>
          </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
