import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,              // retry failed requests once
      staleTime: 1000 * 0,  // cache data for 10 seconds
      refetchOnWindowFocus: false, // don't refetch when tab is focused
    }
  }
})

function App() {
  return (
    <ErrorBoundary>    
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <Toaster position="top-right" />
              <AppRouter />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App