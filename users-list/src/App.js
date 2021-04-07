import { useState } from "react"
import "./App.css"
import UserList from "./Components/UserList"

function App() {
	const [showData, setShowData] = useState(false)
	return (
		<div className='App'>
			{showData ? (
				<UserList />
			) : (
				<button onClick={() => setShowData(true)}>Get Users</button>
			)}
		</div>
	)
}
export default App
