import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Home, Services, About, Events, Blogs, Contact, Products, Appointment } from "./pages";
import Header from "./components/shared/Headers"; // old header
import NavBar from "./components/shared/NavBar"; // new navbar
import { BookingProvider } from "./context/BookingContext";

/* A layout draws a header, then the page that matches the URL (<Outlet />) */

const NavBarLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

const HeaderLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

function App() {
  return (
    <BookingProvider>
    <Router>
      <Routes>
        {/* Home draws its own old <Header /> inside its page card, so no layout here */}
        {/* Pages with the NEW NavBar */}
        <Route element={<NavBarLayout />}>
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/appointments" element={<Appointment />} />
        </Route>

        {/* Pages with the OLD Header */}
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
        </Route>

      </Routes>
    </Router>
    </BookingProvider>
  );
}

export default App;