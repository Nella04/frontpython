// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './TestHistoryViewer.css';

// interface Test {
//   id_test: number;
//   date_test: string;
//   id_responsable: number;
//   responsable_nom: string;
//   responsable_prenom: string;
// }

// interface Poste {
//   id_poste: number;
//   nom_poste: string;
//   nom_domaine: string;
// }

// interface CompetenceResultat {
//   id_competence: number;
//   nom_competence: string;
//   niveau_evalue: number;
//   coefficient: number;
// }

// const TestHistoryViewer: React.FC<{ id_candidat: number }> = ({ id_candidat }) => {
//   const [tests, setTests] = useState<Test[]>([]);
//   const [selectedTest, setSelectedTest] = useState<number | null>(null);
//   const [postes, setPostes] = useState<Poste[]>([]);
//   const [competences, setCompetences] = useState<CompetenceResultat[]>([]);
//   const [searchParams, setSearchParams] = useState({
//     dateDebut: '',
//     dateFin: '',
//     responsable: '',
//     poste: '',
//     competence: ''
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTests();
//   }, [id_candidat]);

//   const fetchTests = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests`, {
//         params: { id_candidat }
//       });
//       setTests(response.data.sort((a: Test, b: Test) => 
//         new Date(b.date_test).getTime() - new Date(a.date_test).getTime()
//       ));
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching tests:', error);
//       setLoading(false);
//     }
//   };

//   const fetchTestDetails = async (id_test: number) => {
//     try {
//       const [postesResponse, competencesResponse] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACK_URL}/api/test/postes`, { params: { id_test } }),
//         axios.get(`${process.env.REACT_APP_BACK_URL}/api/test/competences`, { params: { id_test } })
//       ]);
      
//       setPostes(postesResponse.data);
//       setCompetences(competencesResponse.data);
//       setSelectedTest(id_test);
//     } catch (error) {
//       console.error('Error fetching test details:', error);
//     }
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests/search`, {
//         params: {
//           id_candidat,
//           ...searchParams
//         }
//       });
//       setTests(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error searching tests:', error);
//       setLoading(false);
//     }
//   };

//   const resetSearch = () => {
//     setSearchParams({
//       dateDebut: '',
//       dateFin: '',
//       responsable: '',
//       poste: '',
//       competence: ''
//     });
//     fetchTests();
//   };

//   return (
//     <div className="test-history-container">

//     </div>
//   );
// };

// export default TestHistoryViewer;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestHistoryViewer.css';

const TestHistoryViewer1 = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [searchParams, setSearchParams] = useState({
    dateDebut: '',
    dateFin: '',
    responsable: '',
    poste: '',
    competence: ''
  });
  const [loading, setLoading] = useState(true);
    const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
    const id_candidat = userLocalapi?.idpersonnelocal;

  useEffect(() => {
    fetchTests();
  }, [id_candidat]);
const fetchTests = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests`);
    
    // Filtrer les tests pour ne garder que ceux du candidat actuel
    const filteredTests = response.data.filter(test => test.candidat === id_candidat);
    
    // Trier les tests filtrés par date
    setTests(filteredTests.sort((a, b) => 
      new Date(b.date_test).getTime() - new Date(a.date_test).getTime()
    ));
    
    console.log('Tests filtrés:', filteredTests);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching tests:', error);
    setLoading(false);
  }
};

  const fetchTestDetails = async (id_test) => {
    try {
      const [postesResponse, competencesResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests/postes/?id_test=${ id_test  }`),
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/test/competences/?id_test=${ id_test  }`)
      ]);
    
      
      setPostes(postesResponse.data);
      setCompetences(competencesResponse.data);
      setSelectedTest(id_test);
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests/search`, {
        params: {
          id_candidat,
          ...searchParams
        }
      });
      setTests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching tests:', error);
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchParams({
      dateDebut: '',
      dateFin: '',
      responsable: '',
      poste: '',
      competence: ''
    });
    fetchTests();
  };

  return (
    <div className="test-history-container">
      {/* bbbbbbbbb */}
            <div className="sidebar">
        <div className="search-panel">
          <h3>Recherche</h3>
          <div className="search-group">
            <label>Entre deux dates:</label>
            <div className="date-range">
              <input 
                type="date" 
                value={searchParams.dateDebut}
                onChange={(e) => setSearchParams({...searchParams, dateDebut: e.target.value})}
              />
              <span>à</span>
              <input 
                type="date" 
                value={searchParams.dateFin}
                onChange={(e) => setSearchParams({...searchParams, dateFin: e.target.value})}
              />
            </div>
          </div>
          
          <div className="search-group">
            <label>Par responsable:</label>
            <input 
              type="text" 
              placeholder="Nom du responsable"
              value={searchParams.responsable}
              onChange={(e) => setSearchParams({...searchParams, responsable: e.target.value})}
            />
          </div>
          
          <div className="search-group">
            <label>Par poste:</label>
            <input 
              type="text" 
              placeholder="Nom du poste"
              value={searchParams.poste}
              onChange={(e) => setSearchParams({...searchParams, poste: e.target.value})}
            />
          </div>
          
          <div className="search-group">
            <label>Par compétence:</label>
            <input 
              type="text" 
              placeholder="Nom de la compétence"
              value={searchParams.competence}
              onChange={(e) => setSearchParams({...searchParams, competence: e.target.value})}
            />
          </div>
          
          <div className="button-group">
            <button className="search-button" onClick={handleSearch}>
              Rechercher
            </button>
            <button className="reset-button" onClick={resetSearch}>
              Réinitialiser
            </button>
          </div>
        </div>
        
        <div className="test-list">
          <h3>Historique des Tests</h3>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : tests.length === 0 ? (
            <p className="no-results">Aucun test trouvé</p>
          ) : (
            <ul>
              {tests.map((test) => (
                <li 
                  key={test.id_test}
                  className={`test-item ${selectedTest === test.idt ? 'active' : ''}`}
                  onClick={() => fetchTestDetails(test.id)}
                >
                  <div className="test-date">
                    {new Date(test.date_test).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="test-responsable">
                    {test.responsable_nom} {test.responsable_prenom}
                  </div>
                  <div className="test-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="main-content">
        {selectedTest ? (
          <>
            <div className="test-header">
              <h2>Résultats du test du {new Date(tests.find(t => t.id_test === selectedTest)?.date_test || '').toLocaleDateString('fr-FR')}</h2>
              <p>Effectué par: {tests.find(t => t.id_test === selectedTest)?.responsable_nom} {tests.find(t => t.id_test === selectedTest)?.responsable_prenom}</p>
            </div>
            
            <div className="postes-section">
              <h3>Postes concernés</h3>
              <div className="postes-grid">
                {postes.map(poste => (
                  <div key={poste.id_poste} className="poste-card">
                    <div className="poste-title">{poste.nom_poste}</div>
                    <div className="poste-domaine">{poste.nom_domaine}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="competences-section">
              <h3>Compétences évaluées</h3>
              <div className="competences-table-container">
                <table className="competences-table">
                  <thead>
                    <tr>
                      <th>Compétence</th>
                      <th>Niveau évalué</th>
                      <th>Coefficient</th>
                      <th>Score pondéré</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competences.map(comp => (
                      <tr key={comp.id_competence}>
                        <td>{comp.nom_competence}</td>
                        <td>
                          <div className="level-bar">
                            <div 
                              className="level-fill"
                              style={{ width: `${comp.niveau_evalue * 10}%` }}
                            ></div>
                            <span>{comp.niveau_evalue}/10</span>
                          </div>
                        </td>
                        <td>{comp.coefficient}</td>
                        <td>{(comp.niveau_evalue * comp.coefficient).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h3>Sélectionnez un test</h3>
            <p>Choisissez un test dans la liste à gauche pour afficher les détails</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistoryViewer1;