import React, { useState, useEffect, useCallback } from 'react';
import "./App.css";

interface ApiProps {
  id: string;
  html_url: string;
  name: string;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  language: string;
}

interface FilterInputProps {
  name: string;
  value: string;
  label: string;
  hook: string;
}

export default function App() {
  const [repos, setRepos] = useState([]);
  const [form, setForm] = useState({
    type: 'all',
    sort: 'created',
    direction: 'desc',
    page: 1
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [noData, setNoData] = useState(false);

  const handleFetchRepos = useCallback(async () => {
    const { type, sort, direction, page } = form;

    const hostname = `https://api.github.com`;
    const path = '/orgs/dcard/repos';
    let params = `?type=${type}&sort=${sort}&direction=${direction}&per_page=12&page=${page}`;

    const config = {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${process.env.REACT_APP_GITHUB_PERSONAL}`
      }
    };

    try {
      const res = await fetch(hostname + path + params, config);
      const json = await res.json();

      if (json.length === 0) {
        setNoData(true);
      }

      if (noData) {
        setIsLoading(false);
        return;
      }

      if (page === 1) {
        setRepos(json);
      } else {
        setRepos((prevState) => (prevState ? [...prevState, ...json] : json));
      }

      setIsFetching(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }, [form, noData]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
      page: 1
    }));
  };

  const handlePageBottom = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (isFetching) return;
    if (noData) return;

    setForm((prevState) => ({
      ...prevState,
      page: prevState.page + 1
    }));

    setIsFetching(true);
  }, [isFetching, noData]);

  const handleTimeFormat = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    handleFetchRepos();
  }, [form, handleFetchRepos]);

  useEffect(() => {
    window.addEventListener('scroll', handlePageBottom);
    return () => window.removeEventListener('scroll', handlePageBottom);
  }, [handlePageBottom]);

  const filters = [{
    legend: 'Repos Type',
    name: 'type',
    hook: form.type,
    items: [{
        value: 'all',
        label: 'All'
      }, {
        value: 'forks',
        label: 'Forks'
      }
    ]
  }, {
    legend: 'Sort',
    name: 'sort',
    hook: form.sort,
    items: [{
        value: 'created',
        label: 'Created Time'
      }, {
        value: 'updated',
        label: 'Updated Time'
      }, {
        value: 'pushed',
        label: 'Pushed Time'
      }, {
        value: 'full_name',
        label: 'Full Name'
      }
    ]
  }, {
    legend: 'Direction',
    name: 'direction',
    hook: form.direction,
    items: [{
        value: 'desc',
        label: 'Descend'
      }, {
        value: 'asc',
        label: 'Ascend'
      }
    ]
  }];

  const FilterInput = ({name, value, label, hook}: FilterInputProps) => {
    return(
      <>
        <input
          id={`${name}_${value}`}
          type="radio"
          name={name}
          value={value}
          checked={hook === value}
          onChange={handleOnChange}
        />
        <label className="filterName" htmlFor={`${name}_${value}`}>
          {label}
        </label>
      </>
    );
  }

  return (
    <div className="App">
      <header className="filter">
        {filters.map(({legend, name, items, hook}) => (
          <fieldset key={name}>
            <legend>{legend}</legend>
            {items.map(({value, label}) => (
              <FilterInput name={name} value={value} label={label} hook={hook} key={value} />
            ))}
          </fieldset>
          )
        )}
      </header>
      {repos && (
        <ul className="filterList">
          {repos.map(({ id, html_url, name, updated_at, pushed_at, created_at, language }: ApiProps) => (
              <li className="filterItem" key={id}>
                <a href={html_url}>{name}</a>
                <dl>
                  <dt>Updated on</dt>
                  <dd>{handleTimeFormat(updated_at)}</dd>
                  <dt>Latest Push on</dt>
                  <dd>{handleTimeFormat(pushed_at)}</dd>
                  <dt>Created on</dt>
                  <dd>{handleTimeFormat(created_at)}</dd>
                  {language &&
                    <>
                      <dt>Language</dt>
                      <dd>{language}</dd>
                    </>
                  }
                </dl>
              </li>
            )
          )}
        </ul>
      )}
      {(isLoading || isFetching) &&
        <div className="stateDescription">
          {isLoading && 'Loading Repos...'}
          {isFetching && 'Loading More Repos...'}
        </div>
      }
    </div>
  );
}
