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

      setRepos({
        data: json,
        loading: false
      });
    } catch (error) {
      console.log('error', error);
    }
}

  useEffect(() => {
    handleFetchData('forks');
  }, [setRepos]);

  return (
    <div className="App">
      <header className="filter">
        <fieldset>
          <legend>Repos Type</legend>
          <input id="type_all" type="radio" name="type" value="all" checked />
          <label htmlFor="type_all">All</label>
          <input id="type_forks" type="radio" name="type" value="forks" />
          <label htmlFor="type_forks">Forks</label>
        </fieldset>
        <fieldset>
          <legend>Sort</legend>
          <input id="sort_created" type="radio" name="sort" value="created" checked />
          <label htmlFor="sort_created">Created</label>
          <input id="sort_updated" type="radio" name="sort" value="updated" />
          <label htmlFor="sort_updated">Updated</label>
          <input id="sort_pushed" type="radio" name="sort" value="pushed" />
          <label htmlFor="sort_pushed">Pushed</label>
          <input id="sort_full_name" type="radio" name="sort" value="full_name" />
          <label htmlFor="sort_full_name">Full Name</label>
        </fieldset>
      </header>
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
