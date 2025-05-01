import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import HomePage from './HomePage';
import LandingPage from './LandingPage';
import HomePage_Profile from './HomePage_Profile';
import HomePage_AddCre from './HomePage_AddCre';
import WalletPage from './WalletPage';
import WalletPage_CreDetails from './WalletPage_CreDetails';
import SettingPage from './SettingPage';
import SharePage from './SharePage';
import VerificationResult from './VerificationResult';
import VerificationHome from './VerificationHome';
import LoginPage_issuer from './LoginPage_Issuer';
import RegisterPage_issuer from './RegisterPage_issuer';
import DashboardPage_Issuer from './DashboardPage_Issuer';
import Issuer_new from './Issuer_new';
import Issuer_Revoke from './Issuer_Revoke';

// 👇 Set the same tab name for all pages
document.title = "DecentralD";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/homepage_profile" element={<HomePage_Profile />} />
      <Route path="/homepage_addcre" element={<HomePage_AddCre />} />
      <Route path="/walletpage" element={<WalletPage />} />
      {/* <Route path="/walletpage/credetails/:id" element={<WalletPage_CreDetails />} /> */}
      <Route path="/walletpage/credetails/:id" element={<WalletPage_CreDetails />} />
      <Route path="settingpage" element={<SettingPage />} />
      <Route path="sharepage" element={<SharePage />} />
      <Route path="/verificationresult/:id" element={<VerificationResult />} />
      <Route path="verificationhome" element={<VerificationHome />} />
      <Route path="issuerlogin" element={<LoginPage_issuer />} />
      <Route path="registerpageissuer" element={<RegisterPage_issuer />} />
      <Route path="issuerdashboard" element={<DashboardPage_Issuer />} />
      <Route path="issuernew" element={<Issuer_new />} />
      <Route path="issuerrevoke" element={<Issuer_Revoke />} />
    </Routes>
  </BrowserRouter>
);