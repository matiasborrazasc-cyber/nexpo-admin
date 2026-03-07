import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Blog from "./pages/blog/blog";
import CreateArticle from "./pages/blog/createArticle/createArticle";
import EditArticle from "./pages/blog/editArticle/editArticle";
import Clients from "./pages/clients/clients"; 
import Influencers from "./pages/influencers/influencers";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateLayout from "./PrivateRoute";
import Login from "./pages/login/login";
import Stands from "./pages/stands/stands";
import Cupons from "./pages/cupons/cupons";
import Speakers from "./pages/speakers/speakers";
import Sponsors from "./pages/sponsors/sponsors";
import CreateInfluencers from "./pages/influencers/createInfluencers/createInfluencers";
import EditInfluencers from "./pages/influencers/editInfluencers/editInfluencers";
import ViewInfluencers from "./pages/influencers/viewInfluencers/viewInfluencers";
import CreateStands from "./pages/stands/createStands";
import EditStands from "./pages/stands/editStands";
import StandDetail from "./pages/stands/standDetail";
import CreateSpeakers from "./pages/speakers/createSpeakers";
import EditSpeakers from "./pages/speakers/editSpeakers";
import CreateSponsors from "./pages/sponsors/createSponsors";
import EditSponsors from "./pages/sponsors/editSponsors";
import CreateCupon from "./pages/cupons/createCupon";
import EditCupon from "./pages/cupons/editCupon";
import Giveaways from "./pages/giveaways/giveaways";
import CreateGiveaways from "./pages/giveaways/createGiveaways";
import EditGiveaways from "./pages/giveaways/editGiveaways";
import Banner from "./pages/banner/banner";
import CreateBanner from "./pages/banner/createBanner";
import EditBanner from "./pages/banner/editBanner";
import Events from "./pages/events/events";
import CreateEvents from "./pages/events/createEvents";
import EditEvents from "./pages/events/editEvents";
import Settings from "./pages/settings/settings";
import Support from "./pages/support/support";

function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/soporte" element={<Support />} />
        <Route path="/support" element={<Support />} />

        <Route
          element={
            <PrivateLayout />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/edit-article/:uuid" element={<EditArticle />} />
          <Route path="/influencers" element={<Influencers />} />
          <Route path="/cupons" element={<Cupons />} />
          <Route path="/stands/:uuid" element={<StandDetail />} />
          <Route path="/stands" element={<Stands />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path='/banners' element={<Banner />} />
          <Route path='/events' element={<Events />} />
          <Route path="/create-influencers" element={<CreateInfluencers />} />
          <Route path="/view-influencers/:uuid" element={<ViewInfluencers />} />
          <Route path="/edit-influencers/:uuid" element={<EditInfluencers />} />
          <Route path="/create-stands" element={<CreateStands />} />
          <Route path="/edit-stands/:uuid" element={<EditStands />} />
          <Route path="/create-speakers" element={<CreateSpeakers />} />
          <Route path="/edit-speakers/:uuid" element={<EditSpeakers />} />
          <Route path="/create-sponsors" element={<CreateSponsors />} />
          <Route path="/edit-sponsors/:uuid" element={<EditSponsors />} />
          <Route path="/create-cupons" element={<CreateCupon />} />
          <Route path="/edit-cupons/:uuid" element={<EditCupon />} />
          <Route path="/giveaway" element={<Giveaways />} />
          <Route path="/create-giveaways" element={<CreateGiveaways />} />
          <Route path="/edit-giveaways/:uuid" element={<EditGiveaways />} />
          <Route path="/create-banners" element={<CreateBanner />} />
          <Route path="/edit-banners/:uuid" element={<EditBanner />} />
          <Route path="/create-events" element={<CreateEvents />} />
          <Route path="/edit-events/:uuid" element={<EditEvents />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
