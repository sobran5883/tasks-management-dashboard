import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// const API_URI = "http://localhost:5000"
const API_URI = "https://tasks-management-dashboard.onrender.com"

const baseQuery = fetchBaseQuery({ 
    baseUrl: API_URI + "/api",
    credentials: "include"
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: [],
    endpoints: (builder) => ({}),
})
