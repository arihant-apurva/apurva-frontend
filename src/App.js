import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from './Admin/admin';
import Web from './web/web';
import Add from './Admin/content-type/Add';
import List from './Admin/content-type/List';
import View from './Admin/content-type/View';
import Update from './Admin/content-type/Update';
// import CountryState from './Country-state/Country-state'; // Import CountryState
import CountryState from './Country-state/Country-state';
import CategoryForm from './Admin/category/CategoryForm';
import CategoryList from './Admin/category/CategoryList';
import CategoryView from './Admin/category/CategoryView';
import CategoryUpdate from './Admin/category/CategoryUpdate';
import NewsForm from './Admin/news/NewsForm';
import NewsList from './Admin/news/NewsList';
import NewsView from './Admin/news/NewsView';
import VideoList from './Admin/Uploads/Videouploadlist';
import Addvideo from './Admin/Uploads/Videoaddupload';
import Updatevideo from './Admin/Uploads/Videoupdatepage';
import Viewvideo from './Admin/Uploads/Videoview';
import ApurvaHorizon from './Admin/pages/ApurvaHorizon';
import RegionAdd from './Admin/regional/RegionAdd'
import RegionList from './Admin/regional/RegionList';
import RegionView from './Admin/regional/RegionView';
import RegionUpdate from './Admin/regional/RegionUpdate';
import SensorshipList from './Admin/sensorship/SensorshipList';
import SensorshipView from './Admin/sensorship/SensorshipView';
import ReadyQueueList from './Admin/ready-queue/ReadyQueueList';
import SensorshipRegionalList from './Admin/sensorship/SensorshipRegionalList';
import SensorshipPanel from './Admin/sensorship/SensorshipPanel';
import SensorshipRegionalView from './Admin/sensorship/SensorshipRegionalView';
import IndexingPanel from './Admin/indexing/IndexingPanel';
import IndexingNews from './Admin/indexing/IndexingNews';
import FileUpload from './Admin/FileUpload';
import NewsListHindi from './Admin/news/NewsListHindi';
import NewsListTelugu from './Admin/news/NewsListTelugu';
import NewsListTamil from './Admin/news/NewsListTamil';
import NewsListMalyalam from './Admin/news/NewsListMalyalam';
import NewsListKannada from './Admin/news/NewsListKannada';
import NewsListBengali from './Admin/news/NewsListBengali';
import NewsListOdia from './Admin/news/NewsListOdia';
import NewsListMarathi from './Admin/news/NewsListMarathi';
import NewsListGujarati from './Admin/news/NewsListGujarati';
import NewsUpdate from './Admin/news/NewsUpdate';
import UpdateLanguageNews from './Admin/news/UpdateLanguageNews';
import TagInputField from './Modules/Testing';
import LoginPage from './Admin/pages/LoginPage';
// import { ToastContainer } from 'react-toastify';
import { useAuth } from './Admin/context/AuthContext';
import { ToastContainer } from 'react-toastify';


function App() {

  const {loggedIn} = useAuth();

  return (
    <div>
    {/* <ToastContainer /> */}
      <Router>
        <Routes>
          <Route path="/" element={<Web />} />
          <Route path="/admin" element={loggedIn === true ? <Admin /> : <LoginPage />} >
            <Route path="country-state" element={<CountryState />} />
            <Route path="content-type" element={<List />} />
            <Route path="apurva-horizon" element={<ApurvaHorizon />} />
            <Route path="news/add" element={<NewsForm />} />
            <Route path="news/list" element={<NewsList />} />
            <Route path="news/:languageCollection/view/:id" element={<NewsView />} />
            <Route path="content-type/add" element={<Add />} />
            <Route path="content-type/view/:id" element={<View />} />
            <Route path="content-type/update/:id" element={<Update />} />
            <Route path="category-type/add" element={<CategoryForm />} />
            <Route path="category-type/list" element={<CategoryList />} />
            <Route path="category-type/view/:id" element={<CategoryView />} />
            <Route path="category-type/update/:id" element={<CategoryUpdate />} />
            <Route path="upload" element={<FileUpload />} />
            <Route path="video-upload/list" element={<VideoList />} />
            <Route path="video-upload/addvideo" element={<Addvideo />} />
            <Route path="video-upload/update/:id" element={<Updatevideo />} />
            <Route path="video-upload/view/:id" element={<Viewvideo />} />
            <Route path="regional-news/add" element={<RegionAdd />} />
            <Route path="regional-news/list" element={<RegionList />} />
            <Route path="regional-news/view/:id" element={<RegionView />} />
            <Route path="regional-news/update/:id" element={<RegionUpdate />} />
            <Route path="sensorship-news/panel" element={<SensorshipPanel />} />
            <Route path="sensorship-news/list" element={<SensorshipList />} />
            <Route path="sensorship-news/view/:id" element={<SensorshipView />} />
            <Route path="sensorship-regional-news/view/:id" element={<SensorshipRegionalView />} />
            <Route path="sensorship-regional-news/list" element={<SensorshipRegionalList />} />
            <Route path="ready-queue/list" element={<ReadyQueueList />} />
            <Route path="indexing/panel" element={<IndexingPanel />} />
            <Route path="indexing/news/list" element={<IndexingNews />} />
            <Route path="indexing/regional-news/list" element={<IndexingNews />} />
            {/* routes for languages news listing */}
            <Route path="news/news_hi/list" element={<NewsListHindi />} />
            <Route path="news/news_te/list" element={<NewsListTelugu />} />
            <Route path="news/news_ta/list" element={<NewsListTamil />} />
            <Route path="news/news_ml/list" element={<NewsListMalyalam />} />
            <Route path="news/news_kn/list" element={<NewsListKannada />} />
            <Route path="news/news_bn/list" element={<NewsListBengali />} />
            <Route path="news/news_or/list" element={<NewsListOdia />} />
            <Route path="news/news_gu/list" element={<NewsListGujarati />} />
            <Route path="news/news_mr/list" element={<NewsListMarathi />} />
            {/* route for news update in any language */}
            <Route path="news/update/:id" element={<NewsUpdate />} />
            <Route path="news/update/:target_language/:id" element={<UpdateLanguageNews />} />
            {/* testing things out route */}
            <Route path="testing" element={<TagInputField />} />
            {/* admin login page */}
            {/* <Route path="login" element={<LoginPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
