import { useState } from 'react'
//import './App.css'

import PaginatedResults from './components/search/listed_korean/PaginatedResults.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PaginatedResults />
    </>
  )
}

export default App
