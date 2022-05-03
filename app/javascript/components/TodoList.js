import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { AiFillEdit } from 'react-icons/ai';

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 0 30px;
`;

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`;

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`;

const TodoName = styled.span`
  font-size: 27px;
  flex-grow: 1;
  padding: 0 10px;
  ${({ is_completed }) => is_completed && `opacity: 0.4;`}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: c
  margin: 7px auto;
  padding: 10px 0;
  font-size: 25px;
`;

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`;

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`;

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`;

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    axios
      .get('/api/v1/todos.json')
      .then((resp) => {
        console.log(resp.data);
        setTodos(resp.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const removeAllTodos = () => {
    const sure = window.confirm('Are you sure?');
    if (sure) {
      axios
        .delete('/api/v1/todos/destroy_all')
        .then((resp) => {
          setTodos([]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const updateIsCompleted = (index, val) => {
    const data = {
      name: val.name,
      is_completed: !val.is_completed,
    };
    axios.patch(`/api/v1/todos/${val.id}`, data).then((resp) => {
      const newTodos = [...todos];
      newTodos[index].is_completed = resp.data.is_completed;
      setTodos(newTodos);
    });
  };

  return (
    <>
      <SearchAndButton>
        <SearchForm
          type='text'
          placeholder='Search todo...'
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
        />
        <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
      </SearchAndButton>

      <div>
        {todos
          .filter((val) => {
            if (searchName === '') {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchName.toLowerCase())
            ) {
              return val;
            }
          })
          .map((val, key) => {
            return (
              <Row key={key}>
                {val.is_completed ? (
                  <CheckedBox>
                    <ImCheckboxChecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </CheckedBox>
                ) : (
                  <UncheckedBox>
                    <ImCheckboxUnchecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </UncheckedBox>
                )}
                <TodoName is_completed={val.is_completed}>{val.name}</TodoName>
                <Link to={'/todos/' + val.id + '/edit'}>
                  <EditButton>
                    <AiFillEdit />
                  </EditButton>
                </Link>
              </Row>
            );
          })}
      </div>
    </>
  );
}

export default TodoList;
