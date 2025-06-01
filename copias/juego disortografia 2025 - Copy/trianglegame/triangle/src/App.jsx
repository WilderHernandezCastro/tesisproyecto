
import './App.css'
import TriangleColoringGame from './components/TriangleColoringGame'

function App() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Juego de Colorear el Triángulo</h1>
      <TriangleColoringGame />
    </main>
  )
}

export default App
