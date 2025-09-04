import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import GlobalLayout from "./components/GlobalLayout";
import FileLayout from "./components/FileLayout";
import Home from "./pages/Home";
import Chat from "./pages/Chat/Chat";
import SocialMedia from "./pages/SocialMedia/SocialMedia";
import Files from "./pages/file/Files";
import Images from "./pages/file/Images";
import Share from "./pages/file/Share";
import ShareMe from "./pages/file/ShareMe";
import Login from "./pages/LoginTsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignCode from "./pages/file/SignCode";
import Users from "./pages/file/Users";
import SingleFile from "./pages/file/SingleFile";
import ChatRoom from "./components/Chat/ChatRoom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./components/Profile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./components/Chat/chatFonction";
import { setUser } from "./features/user/user";


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const getData = async () => {
      const allUser = await fetchUser();
      if (allUser) {
        dispatch(setUser(allUser))
      }
    }
    getData()
  }, [])
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><GlobalLayout /></ProtectedRoute>}>
            <Route element={<FileLayout />}>
              <Route index element={<Home />} />
              <Route path="/file" element={<Files />} />
              <Route path="/file/:id/:folder" element={<SingleFile />} />
              <Route path="/image" element={<Images />} />
              <Route path="/share" element={<Share />} />
              <Route path="/share-with-me" element={<ShareMe />} />
              <Route path="/sign-code" element={<SignCode />} />
              <Route path="/users" element={<Users />} />
            </Route>
            <Route path="/chat/*" element={<Chat />}>
              <Route path=":conversationId" element={<ChatRoom />} />
            </Route>
            <Route path="/prodile" element={<ProfilePage user={currentUser}></ProfilePage>}></Route>
            <Route path="/social-media" element={<SocialMedia />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          bodyClassName="bg-primary text-white"
        />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
