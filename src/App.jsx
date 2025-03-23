import { Toaster } from "sonner"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/common/AuthProvider"
import { PrivateRoute } from "./components/common/PrivateRoute"

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
import Trips from "@/pages/trips"
import TripDetail from "@/pages/TripDetail"
import LandlordDashboard from "./pages/ LandlordDashboard"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster /> {/* 这里添加 Toaster 组件 */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/search" element={<Search />} />
            {/* 使用 PrivateRoute 来保护以下路由 */}
            <Route path="/booking/:listingId" element={<PrivateRoute element={<Booking />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
            <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
            <Route path="/trips" element={<PrivateRoute element={<Trips />} />} />
            <Route path="/trips/:tripId" element={<PrivateRoute element={<TripDetail />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/landlord" element={<PrivateRoute element={<LandlordDashboard />} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
    
  );
}

export default App
