import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import 'antd/dist/reset.css'
import { WithApollo } from './app/providers/ApolloProvider'
import { ZustandProvider } from './app/providers/ZustandProvider'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <ZustandProvider>

      <WithApollo>
        <App />
      </WithApollo>
    </ZustandProvider>
  </StrictMode>,
)
