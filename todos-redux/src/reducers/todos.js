const todos =(state=[],action)=>{

  switch (action.type) {
    case 'ADD TODO':
      return [
        ...state,
        {
          id:action.id,
          text:action.text,
          complete:false
        }
      ]

    case 'TOGGLE_TODO':
      return state.map(todo=>{
        (todo.id === action.id)
        ? {...todo,complete:!todo.complete}
        : todo
      })
      default:
      return false
  }
}

export default todos