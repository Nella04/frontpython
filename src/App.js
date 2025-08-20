import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import HomePage from "./page/Home";

//candidat
import SignupPage from "./page/Logincandidat"; 
import LoginPage from "./page/Connexioncandidat";
import DomainesPostesCompetences from "./page/candidat/DomPosCom";
import DomaineExplorer from "./page/candidat/D2";
//import CompetenceView from "./page/candidat/Compcan";
import CompetenceDashboard from "./page/candidat/Compcan";
import CompetenceVisualisation from "./page/candidat/Cancomp2";
import TestHistoryView from "./page/candidat/Test1";
import TestsHistory from "./page/candidat/Testcan";
import TestHistoryViewer1 from "./page/candidat/T1";
import HistoriqueTests from "./page/candidat/HistoriqueTest";
import TestHistoryViewer from "./page/candidat/H1";

//responsable
import LoginPageresp from "./page/responsable/Connexionresp";
import D1 from "./page/responsable/D1";
import DomaineList from "./page/Domaine";
import DomainesManager from "./page/responsable/DomainePosteComp";
import GestionCompetences from "./page/responsable/Tous";
import CandidatsList from "./page/responsable/Candidatliste";
import CanL from "./page/responsable/CanL";
import CandidateDashboard from "./page/responsable/FiltrCan";
import CandidatManager from "./page/responsable/FiltrCan";
import Can from "./page/responsable/Can";
import CandidatManagement2 from "./page/responsable/CanManag";
import CompetenceFilterView from "./page/responsable/Competencefiltre";
import CompetenceCandidatesView from "./page/responsable/Cancomp2";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>

        {/* tous */}
        <Route path="/" element={<HomePage />} />
        
        <Route path="/a" element={<Navbar />} />
        
        
        <Route path="/domaine" element={<DomaineList />} />
        <Route path="/responsable/Can" element={<CandidatsList />} />
        <Route path="/c" element={<DomainesManager />} />
        <Route path="/b" element={<GestionCompetences />} />
        {/* responsable */}
        <Route path="/responsable/connexion" element={<LoginPageresp />} />
        <Route path="/responsable/Domaine" element={<D1 />} />
        <Route path="/responsable/test/candidat" element={<CanL />} />
        <Route path="/responsable/candidat" element={<CandidatManager />} />
        <Route path="/w" element={<Can />} />
        <Route path="/cr" element={<CandidatManagement2 />} />
        <Route path="/cc" element={<CompetenceFilterView />} />
        <Route path="/ccc" element={<CompetenceCandidatesView/>} />




        <Route path="/candidat/d2" element={<DomaineExplorer />} />
        <Route path="/candidat/t" element={<TestHistoryView />} />
        <Route path="/candidat/c" element={<CompetenceDashboard />} />
        {/* candidat */}
        <Route path="/candidat/login" element={<SignupPage />} />
        <Route path="/candidat/connexion" element={<LoginPage />} />
        <Route path="/candidat/domaine" element={<DomainesPostesCompetences />} />
        <Route path="/candidat/competence" element={<CompetenceVisualisation />} />
        <Route path="/candidat/t1" element={<TestsHistory/>} />
        <Route path="/candidat/t2" element={<TestHistoryViewer1/>} />
        <Route path="/candidat/h2" element={<HistoriqueTests/>} />
        <Route path="/candidat/historique" element={<TestHistoryViewer/>} />


        
        
      </Routes>

    </div>
    </Router>
  );
}

export default App;
