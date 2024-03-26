import {Route, Routes} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import SignUp from './pages/Auth/SignUp';
import SignIn from './pages/Auth/SignIn';
import Chat from './pages/Chat/Chat';
import './App.css'
import "./styles/font.css";
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import ProfileInfo from './pages/Profile/ProfileInfo';
import ProfileDelete from './pages/Profile/ProfileDelete';
import { Study } from './pages/Study/Study';
import AddBoard from "./pages/AddBoard/AddBoard";
import BoardList from "./pages/BoardList/BoardList";
import Board from "./pages/Board/Board";
import { Post } from './pages/Study/Post';
import { PostView } from './pages/Study/PostView';


function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:nickname" element={<Profile />} />
            <Route path="/accounts/edit" element={<ProfileEdit />} />
            <Route path="/accounts/personal-info" element={<ProfileInfo />} />
            <Route path="/accounts/delete" element={<ProfileDelete />} />
            <Route path="/chat" element={<Chat />} />
            <Route path='/study' element={<Study/>} />
            <Route path='/post/new' element={<Post />}/>
            <Route path='/post' element={<PostView />} />
            <Route path="/add-board" element={<AddBoard/>} />
            <Route path="/board-list" element={<BoardList/>} />
            <Route path="/board/:board_id" element={<Board/>} />
          </Routes>
        </BrowserRouter>
      </>

  );
}

export default App;
