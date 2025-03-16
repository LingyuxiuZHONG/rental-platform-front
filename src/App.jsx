import { Toaster } from "sonner"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout/Layout"
import Home from "@/pages/Home"
import ListingDetail from "@/pages/ListingDetail"
import Search from "@/pages/Search"
import Booking from "@/pages/Booking"
import Profile from "@/pages/Profile"
import Favorites from "@/pages/Favorites"
import Messages from "@/pages/Messages"
import Login from "@/pages/Login"
import Register from "@/pages/Register"

function App() {
  return (
    <Router>
      <Toaster /> {/* 这里添加 Toaster 组件 */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/booking/:listingId" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
