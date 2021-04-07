import React, { useEffect } from "react"
import useLoader from "../CustomHooks/useLoader"

const requestURL = "https://jsonplaceholder.typicode.com/users"
const requestMethod = "GET"
const doSomethingWithResponse = (response) => {
	console.log(
		"Hello from onSuccess()!!" +
			"\nHere you can also dispatch custom action objects using the returned response of the request" +
			`\n\nresponse:\n${JSON.stringify(response.data)}`
	)
}
const doSomethingWithError = (error) => {
	console.log(
		"Hello from onFailure()!!" +
			"\nHere you can also dispatch custom action objects using the returned error of the request" +
			`\n\nerror:\n${JSON.stringify(error.message)}`
	)
}

function UserList() {
	/* USE Of useLoader() hook */
	const [loading, response, error, getUsers] = useLoader({
		requestMethod,
		requestURL,
		onSuccess: doSomethingWithResponse,
		onFailure: doSomethingWithError
	})

	useEffect(() => {
		getUsers()
	}, [])

	const userData = response && response.data
	const errorMsg = error && error.message

	return (
		<div>
			<h1>This is UserList</h1>
			{loading ? (
				<h2>Loading...</h2>
			) : errorMsg ? (
				<h2>{JSON.stringify(errorMsg)}</h2>
			) : (
				<div>
					{userData &&
						userData.map((user, index) => (
							<p key={index}>{user.name}</p>
						))}
				</div>
			)}
		</div>
	)
}
export default UserList
