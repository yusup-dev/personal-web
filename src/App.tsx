
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Socials from "./components/Socials";
import AppRouter from "./router/AppRouter";
import "./styles/global.css";

function App() {
  return (
    <div className="container">
      <Navbar />
      < AppRouter />
      <Socials />
      <Footer />
    </div>
  );
}

export default App;


