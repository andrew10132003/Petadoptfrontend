import { FavoritesProvider } from "./context/FavoritesContext";
import AppRoutes from "./routes/Approutes";

function App() {
  return (
    <FavoritesProvider>
      <AppRoutes />
    </FavoritesProvider>
  );
}

export default App;