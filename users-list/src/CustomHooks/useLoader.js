import axios from "axios"
import { useEffect, useState } from "react"
import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"

// Action types ---------------------------------------------------------------
const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST"
const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS"
const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE"
// ----------------------------------------------------------------------------

// Action Creators ------------------------------------------------------------
const fetchDataRequest = () => {
	return {
		type: FETCH_DATA_REQUEST
	}
}

const fetchDataSuccess = (response) => {
	return {
		type: FETCH_DATA_SUCCESS,
		payload: response
	}
}

const fetchDataFailure = (error) => {
	return {
		type: FETCH_DATA_FAILURE,
		payload: error
	}
}

const fetchData = (
	requestURL = "",
	requestMethod = "GET",
	requestPayload = null,
	onSuccess,
	onFailure
) => (dispatch) => {
	dispatch(fetchDataRequest())
	switch (requestMethod) {
		case "GET":
			axios
				.get(requestURL)
				.then((response) => {
					let fetchSuccessAction = fetchDataSuccess(response)
					onSuccess && onSuccess(response)
					dispatch(fetchSuccessAction)
				})
				.catch((error) => {
					let fetchFailureAction = fetchDataFailure(error)
					onFailure && onFailure(error)
					dispatch(fetchFailureAction)
				})
			break
		case "POST":
			axios
				.post(requestURL, requestPayload)
				.then((response) => {
					let fetchSuccessAction = fetchDataSuccess(response)
					onSuccess && onSuccess(response)
					dispatch(fetchSuccessAction)
				})
				.catch((error) => {
					let fetchFailureAction = fetchDataFailure(error)
					onFailure && onFailure(error)
					dispatch(fetchFailureAction)
				})
			break
		default:
			throw new Error("Invalid Request Method!!")
	}
}
// ----------------------------------------------------------------------------

// Intial State ---------------------------------------------------------------
const intialState = {
	loading: false,
	response: null,
	error: null
}
// ----------------------------------------------------------------------------

// Reducer --------------------------------------------------------------------
const LoaderReducer = (state = intialState, action) => {
	switch (action.type) {
		case FETCH_DATA_REQUEST:
			return {
				...state,
				loading: true,
				response: null,
				error: null
			}
		case FETCH_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				response: action.payload,
				error: null
			}
		case FETCH_DATA_FAILURE:
			return {
				...state,
				loading: false,
				response: null,
				error: action.payload
			}
		default:
			return state
	}
}
// ----------------------------------------------------------------------------

// Store ----------------------------------------------------------------------
const localStore = createStore(LoaderReducer, applyMiddleware(logger, thunk))
// ----------------------------------------------------------------------------

// useLoader Hook------------------------------------------------------
const useLoader = (args) => {
	const dispatch = localStore.dispatch
	const [loader, setLoader] = useState(localStore.getState())
	const unsubscribe = localStore.subscribe(() =>
		setLoader(localStore.getState())
	)

	useEffect(() => {
		return () => {
			unsubscribe()
		}
	}, [])

	const {
		requestURL,
		requestMethod,
		requestPayload,
		onSuccess,
		onFailure
	} = args

	const getData = () =>
		dispatch(
			fetchData(
				requestURL,
				requestMethod,
				requestPayload,
				onSuccess,
				onFailure
			)
		)
	return [loader.loading, loader.response, loader.error, getData]
}
// ----------------------------------------------------------------------------

export default useLoader
