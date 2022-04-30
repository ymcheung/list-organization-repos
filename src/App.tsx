import { useState, useEffect, useCallback } from 'react';
import './App.css';

interface FetchProps {(
  type: string,
  sort: string,
  direction: string,
  page: number
  ): void;
}

interface Data {
  id: string;
  html_url: string;
  name: string;
  updated_at: string;
  pushed_at: string;
  created_at: string;
}

function App() {
  const [repos, setRepos] = useState([]);
  const [repoType, setRepoType] = useState('all');
  const [repoSort, setRepoSort] = useState('created');
  const [repoDirection, setRepoDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const handleUpdateRepoType = (type: string) => {
    setRepoType(type);
    handleFetchData(repoType, repoSort, repoDirection, pageNumber);
  }

  const handleUpdateRepoSort = (sort: string) => {
    setRepoSort(sort);
    handleFetchData(repoType, repoSort, repoDirection, pageNumber);
  }

  const handleUpdateRepoDirection = (direction: string) => {
    setRepoDirection(direction);
    handleFetchData(repoType, repoSort, repoDirection, pageNumber);
  }

  // const filters = [{
  //   name: 'type',
  //   legend: 'Repos Type',
  //   hook: repoType,
  //   items: [{
  //     value: 'all',
  //     label: 'All'
  //   }, {
  //     value: 'forks',
  //     label: 'Forks'
  //   }]
  // }, {
  //   name: 'sort',
  //   legend: 'Sort',
  //   hook: repoSort,
  //   items: [{
  //     value: 'created',
  //     label: 'Created Time'
  //   }, {
  //     value: 'updated',
  //     label: 'Updated Time'
  //   }, {
  //     value: 'pushed',
  //     label: 'Pushed Time'
  //   }, {
  //     value: 'full_name',
  //     label: 'Full Name'
  //   }]
  // }, {
  //   name: 'direction',
  //   legend: 'Direction',
  //   hook: repoDirection,
  //   items: [{
  //     value: 'desc',
  //     label: 'Descending'
  //   }, {
  //     value: 'asc',
  //     label: 'Ascending'
  //   }]
  // }];

  const handleFetchData: FetchProps = async(type, sort, direction, page) => {
    let url = `https://api.github.com/orgs/vercel/repos?type=${type}&sort=${sort}&direction=${direction}&per_page=12&page=${page}`;
    const config = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    try {
      setIsLoading(true);
      const res = await fetch(url, config);
      const json = await res.json();

      setRepos(json);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTimeFormat = (time: string) => {
    const date = new Date(time);

    return date.toLocaleDateString();
  }

  const handlePageBottom = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (isLoading) return;

    setPageNumber(current => current + 1);
  }, [isLoading]);

  useEffect(() => {
    handleFetchData(repoType, repoSort, repoDirection, pageNumber);

  }, [repoDirection, repoSort, repoType, pageNumber]);

  useEffect(() => {
    window.addEventListener('scroll', handlePageBottom);
    return () => window.removeEventListener('scroll', handlePageBottom);
  },[handlePageBottom]);

  useEffect(() => {
    if (!isLoading) return;
    // setTimeout(() => {
      const currentRepos = repos;
      handleFetchData(repoType, repoSort, repoDirection, pageNumber);

      setRepos([...currentRepos, ...repos]);

      setIsLoading(false);
    // }, 3500);
  },[repoType, repoSort, repoDirection, pageNumber, repos, isLoading]);

  // const filterControl = (name, value, label, hook) => {
  //   return(
  //     <>
  //       <input id={`${name}_${value}`} type="radio" name={name} value={value} checked={hook === value} onChange={({ target }) => handleUpdateRepoType(target.value)} />
  //       <label className="filterName" htmlFor={`${name}_${value}`}>{label}</label>
  //     </>
  //   )
  // }

  return (
    <div className="App">
      <header className="filter">
        {/* {filters.map(({name, legend, hook, items}) =>
          <fieldset>
            <legend>{legend}</legend>
            {items.map(({value, label}) =>
              filterControl(name, value, label, hook)
            )}
          </fieldset>
        )} */}
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
      {repos &&
        <ul className="filterList">
          {
            repos.map(({id, html_url, name, updated_at, pushed_at, created_at}: Data, index: number) => (
            <li className="filterItem" key={`${id}-${index}`}>
              <a href={html_url}>{name}</a>
              <dl>
                <dt>Updated on</dt>
                <dd>{handleTimeFormat(updated_at)}</dd>
                <dt>Latest Push on</dt>
                <dd>{handleTimeFormat(pushed_at)}</dd>
                <dt>Created on</dt>
                <dd>{handleTimeFormat(created_at)}</dd>
              </dl>
              N.O. {index + 1}
            </li>
            ))
          }
        </ul>
      }
      {isLoading && 'Fetching Repos'}
    </div>
  );
}

export default App;
