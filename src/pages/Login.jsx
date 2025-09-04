/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import bg from "../assets/images/bg-login.jpeg";
import logo from "../assets/images/logo - pmbcloud.png";
import { Button, Modal } from "../components/Utils";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../features/user/user";
import {API_BASE_URL} from "../api"

const Login = () => {
  const { userInfo, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [ok, setOk] = useState(true);
  const navigate = useNavigate();
  const localStoreUser = localStorage.getItem('userInfo') || null;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (localStoreUser) {
      dispatch(setCurrentUser(JSON.parse(localStoreUser)));
      navigate('/');
    } else {
      console.log(userInfo);
    }
  }, [localStoreUser, userInfo, dispatch, navigate]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault(); // éviter le rechargement de page
    loginClient(username, password);
  };

  const loginClient = async (userName, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { userName, password }, {
        withCredentials: true
      });
      console.log('reponse data :', response.data.user);
      localStorage.setItem('token', response.data.token);
      const infoLogin = response.data.user;
      localStorage.setItem('user', JSON.stringify(infoLogin));
      await login(infoLogin);
      dispatch(setCurrentUser(infoLogin));
      navigate('/');
    } catch (error) {
      setOk(false);
      setTimeout(() => setOk(true), 3000);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    !localStoreUser ? (
      <div
        className="h-[100vh] w-[100vw] flex items-center justify-end px-4 text-black"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <Modal open={modalOpen} title="Veillez entrer votre code d'inscription" handleClose={closeModal}>
          <input type="text" className="w-full mb-2 border rounded-md py-1 px-2" />
        </Modal>

        <div className="login-box h-[80vh] bg-white/80 w-[560px] py-3 px-10 flex flex-col justify-center items-center rounded-xl">
          <div className="logo">
            <img src={logo} style={{ width: "250px" }} alt="Logo promabio" />
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mt-3">
              <label className="block" htmlFor="username">Identifiant</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-2 py-1 rounded-md w-full mt-2 bg-slate-400"
                name="username"
                autoComplete="username"
              />
            </div>
            <div className="mt-3">
              <label className="block" htmlFor="password">Mot de passe</label>
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="px-2 py-1 rounded-md w-full mt-2 bg-slate-400"
                name="password"
                autoComplete="current-password"
              />
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {!ok && (
                <div>
                  <p className="px-2 py-1 bg-red-300 rounded-md">
                    Identifiant ou mot de passe incorrecte
                  </p>
                </div>
              )}
              <div className="text-center">
                <Button handleSubmit={handleSubmit} title="Se connecter" type="success" />
              </div>
              <Button title="S'inscrire" handleSubmit={openModal} />
            </div>
          </form>
        </div>
      </div>
    ) : <>Chargement</>
  );
};

export default Login;
