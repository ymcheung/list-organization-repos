import { useState, useEffect } from 'react';
import './App.css';

interface FetchProps {(
  type: string,
  sort: string,
  direction: string
  ): void;
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

  const [repoType, setRepoType] = useState('all');
  const [repoSort, setRepoSort] = useState('created');
  const [repoDirection, setRepoDirection] = useState('desc');

  const handleFetchData: FetchProps = async(type, sort, direction) => {
    console.log({type, sort, direction})
    let url = `https://api.github.com/orgs/vercel/repos?type=${type}&sort=${sort}&direction=${direction}`;

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

  const handleUpdateRepoType = (type: string) => {
    setRepoType(type);
    handleFetchData(repoType, repoSort, repoDirection);
  }

  const handleUpdateRepoSort = (sort: string) => {
    setRepoSort(sort);
    handleFetchData(repoType, repoSort, repoDirection);
  }


  const handleUpdateRepoDirection = (direction: string) => {
    setRepoDirection(direction);
    handleFetchData(repoType, repoSort, repoDirection);
  }

  useEffect(() => {
    handleFetchData(repoType, repoSort, repoDirection);
  }, [setRepos]);

  return (
    <div className="App">
      <header className="filter">
        <fieldset>
          <legend>Repos Type</legend>
          <input id="type_all" type="radio" name="type" value="all" checked={repoType === 'all'} onChange={({ target }) => handleUpdateRepoType(target.value)} />
          <label className="filterName" htmlFor="type_all">All</label>
          <input id="type_forks" type="radio" name="type" value="forks" checked={repoType === 'forks'} onChange={({ target }) => handleUpdateRepoType(target.value)} />
          <label className="filterName" htmlFor="type_forks">Forks</label>
        </fieldset>
        <fieldset>
          <legend>Sort</legend>
          <input id="sort_created" type="radio" name="sort" value="created" checked={repoSort === 'created'} onChange={({ target }) => handleUpdateRepoSort(target.value)}  />
          <label className="filterName" htmlFor="sort_created">Created Time</label>
          <input id="sort_updated" type="radio" name="sort" value="updated" checked={repoSort === 'updated'} onChange={({ target }) => handleUpdateRepoSort(target.value)} />
          <label className="filterName" htmlFor="sort_updated">Updated Time</label>
          <input id="sort_pushed" type="radio" name="sort" value="pushed" checked={repoSort === 'pushed'} onChange={({ target }) => handleUpdateRepoSort(target.value)} />
          <label className="filterName" htmlFor="sort_pushed">Pushed Time</label>
          <input id="sort_full_name" type="radio" name="sort" value="full_name" checked={repoSort === 'full_name'} onChange={({ target }) => handleUpdateRepoSort(target.value)} />
          <label className="filterName" htmlFor="sort_full_name">Full Name</label>
        </fieldset>
        <fieldset>
          <legend>Direction</legend>
          <input id="direction_desc" type="radio" name="direction" value="desc" checked={repoDirection === 'desc'} onChange={({ target }) => handleUpdateRepoDirection(target.value)} />
          <label className="filterName" htmlFor="direction_desc">Desc</label>
          <input id="direction_asc" type="radio" name="direction" value="asc" checked={repoDirection === 'asc'} onChange={({ target}) => handleUpdateRepoDirection(target.value)} />
          <label className="filterName" htmlFor="direction_asc">Asc</label>
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
