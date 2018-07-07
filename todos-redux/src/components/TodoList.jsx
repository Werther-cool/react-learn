import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({todos,toggleTodo}) =>{
  return (
  <ul>
    123
    {todos}23
    {console.log(todos)}
    
       {/* {todos.map(todo =>
          <Todo
            key={todo.id}
            {...todo}
            onClick={() => toggleTodo(todo.id)}
          />
        )}  */}
  </ul>
  )
}

TodoList.prototypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  toggleTodo: PropTypes.func.isRequired
}

export default TodoList