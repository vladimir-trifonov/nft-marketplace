import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider, createTheme } from "@mui/material"
import { toast, ToastContainer } from "react-toastify"
import { common } from "@mui/material/colors"

import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "react-toastify/dist/ReactToastify.css"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: common.white
    },
    background: {
      default: "rgba(26,2,52,1)",
    }
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
      <ToastContainer icon={false} style={{ width: "700px" }} position={toast.POSITION.TOP_CENTER} />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
