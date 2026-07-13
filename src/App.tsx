
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Socials from "./components/Socials";
import AppRouter from "./router/AppRouter";
import NotificationBanner from "./components/NotificationBanner";
import "./styles/global.css";

function App() {
  return (
    <div className="container">
      <Navbar />
      <AppRouter />
      <Socials />
      <Footer />
      <NotificationBanner />
    </div>
  );
}

export default App;


