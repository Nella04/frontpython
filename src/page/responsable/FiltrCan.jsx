import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidatManager = () => {
  // États pour stocker les données
  const [domaines, setDomaines] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la hiérarchie complète domaine-poste-compétence
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        setDomaines(response.data);
        
        // Récupérer toutes les compétences
        const competencesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
        setCompetences(competencesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Charger les candidats pour un poste sélectionné
  useEffect(() => {
    if (selectedPoste) {
      const fetchCandidats = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`);
          const filteredCandidats = response.data.filter(cp => cp.poste_id === selectedPoste.id.toString());
          
          // Pour chaque candidat, calculer la moyenne des compétences pour ce poste
          const candidatsWithScores = await Promise.all(
            filteredCandidats.map(async (candidatPoste) => {
              // Récupérer les compétences du candidat
              const competencesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${candidatPoste.candidat_id}/`);
              const candidatData = competencesResponse.data;
              
              // Récupérer les compétences requises pour ce poste
              const posteCompetences = selectedPoste.competences;
              
              // Calculer la moyenne pondérée
              let sommePonderee = 0;
              let sommeCoefficients = 0;
              let competencesDetails = [];
              
              for (const pc of posteCompetences) {
                // Trouver le niveau de compétence du candidat
                const ccResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${candidatPoste.candidat_id}/competences/`);
                const candidatCompetences = ccResponse.data;
                
                const competenceCandidat = candidatCompetences.find(cc => cc.id_competence === pc.id_comp);
                const niveau = competenceCandidat ? competenceCandidat.niveau : 0;
                
                sommePonderee += niveau * pc.coefficient;
                sommeCoefficients += pc.coefficient;
                
                competencesDetails.push({
                  id: pc.id_comp,
                  nom: pc.competence_nom,
                  niveau,
                  coefficient: pc.coefficient
                });
              }
              
              const moyennePonderee = sommeCoefficients > 0 ? sommePonderee / sommeCoefficients : 0;
              
              // Calculer la moyenne simple pour les compétences sélectionnées (si filtre actif)
              let moyenneFiltre = 0;
              if (selectedCompetences.length > 0) {
                let sommeNiveaux = 0;
                let count = 0;
                
                for (const sc of selectedCompetences) {
                  const competenceCandidat = competencesDetails.find(cd => cd.id === sc.id);
                  if (competenceCandidat) {
                    sommeNiveaux += competenceCandidat.niveau;
                    count++;
                  }
                }
                
                moyenneFiltre = count > 0 ? sommeNiveaux / count : 0;
              }
              
              return {
                ...candidatPoste,
                moyennePonderee,
                moyenneFiltre,
                competencesDetails,
                candidatData
              };
            })
          );
          
          // Trier les candidats par moyenne décroissante
          candidatsWithScores.sort((a, b) => b.moyennePonderee - a.moyennePonderee);
          setCandidats(candidatsWithScores);
        } catch (err) {
          setError(err.message);
        }
      };
      
      fetchCandidats();
    }
  }, [selectedPoste, selectedCompetences]);

  // Gestion des sélections
  const handleDomaineSelect = (domaine) => {
    setSelectedDomaine(domaine);
    setSelectedPoste(null);
  };

  const handlePosteSelect = (poste) => {
    setSelectedPoste(poste);
  };

  const handleCompetenceToggle = (competence) => {
    setSelectedCompetences(prev => {
      const exists = prev.find(c => c.id === competence.id);
      if (exists) {
        return prev.filter(c => c.id !== competence.id);
      } else {
        return [...prev, competence];
      }
    });
  };

  // Filtrer les candidats si des compétences sont sélectionnées
  const filteredCandidats = selectedCompetences.length > 0
    ? candidats.filter(c => c.moyenneFiltre > 0)
    : candidats;

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Colonne de navigation - Domaines */}
        <div className="col-md-3 border-end">
          <h4>Domaines</h4>
          <ul className="list-group">
            {domaines.map(domaine => (
              <li 
                key={domaine.id}
                className={`list-group-item ${selectedDomaine?.id === domaine.id ? 'active' : ''}`}
                onClick={() => handleDomaineSelect(domaine)}
                style={{ cursor: 'pointer' }}
              >
                {domaine.nom_domaine}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Colonne centrale - Postes */}
        <div className="col-md-3 border-end">
          {selectedDomaine ? (
            <>
              <h4>Postes ({selectedDomaine.nom_domaine})</h4>
              <ul className="list-group">
                {selectedDomaine.postes.map(poste => (
                  <li 
                    key={poste.id}
                    className={`list-group-item ${selectedPoste?.id === poste.id ? 'active' : ''}`}
                    onClick={() => handlePosteSelect(poste)}
                    style={{ cursor: 'pointer' }}
                  >
                    {poste.nom_poste}
                    <span className="badge bg-secondary float-end">
                      {poste.competences.length} compétences
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="alert alert-info">Sélectionnez un domaine</div>
          )}
        </div>
        
        {/* Colonne de droite - Candidats et filtres */}
        <div className="col-md-6">
          {selectedPoste ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                  Candidats pour {selectedPoste.nom_poste}
                  <span className="badge bg-primary ms-2">{filteredCandidats.length}</span>
                </h4>
                
                {/* Filtre par compétences */}
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    Filtre par compétences
                    {selectedCompetences.length > 0 && (
                      <span className="badge bg-danger ms-1">{selectedCompetences.length}</span>
                    )}
                  </button>
                  <ul className="dropdown-menu p-3" style={{ width: '300px' }}>
                    {selectedPoste.competences.map(pc => (
                      <li key={pc.id_comp} className="mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedCompetences.some(c => c.id === pc.id_comp)}
                            onChange={() => handleCompetenceToggle({
                              id: pc.id_comp,
                              nom: pc.competence_nom
                            })}
                            id={`comp-${pc.id_comp}`}
                          />
                          <label className="form-check-label" htmlFor={`comp-${pc.id_comp}`}>
                            {pc.competence_nom} (coeff. {pc.coefficient})
                          </label>
                        </div>
                      </li>
                    ))}
                    {selectedCompetences.length > 0 && (
                      <li>
                        <button 
                          className="btn btn-sm btn-outline-danger mt-2"
                          onClick={() => setSelectedCompetences([])}
                        >
                          Effacer le filtre
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Liste des candidats */}
              {filteredCandidats.length > 0 ? (
                <div className="list-group">
                  {filteredCandidats.map(candidat => (
                    <div key={candidat.id} className="list-group-item mb-3">
                      <div className="d-flex justify-content-between">
                        <h5>
                          {candidat.candidat_nom} {candidat.candidat_prenom}
                          {candidat.tester && (
                            <span className="badge bg-success ms-2">Testé</span>
                          )}
                        </h5>
                        <div>
                          <span className="badge bg-primary me-2">
                            Moyenne: {candidat.moyennePonderee.toFixed(2)}
                          </span>
                          {selectedCompetences.length > 0 && (
                            <span className="badge bg-info">
                              Filtre: {candidat.moyenneFiltre.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h6>Compétences:</h6>
                        <div className="row">
                          {candidat.competencesDetails.map(cd => (
                            <div key={cd.id} className="col-md-6 mb-2">
                              <div className="d-flex justify-content-between">
                                <span>
                                  {cd.nom} 
                                  <span className="text-muted ms-1">(coeff. {cd.coefficient})</span>
                                </span>
                                <span className={`badge ${cd.niveau >= 7 ? 'bg-success' : cd.niveau >= 4 ? 'bg-warning' : 'bg-danger'}`}>
                                  Niveau: {cd.niveau}
                                </span>
                              </div>
                              <div className="progress" style={{ height: '5px' }}>
                                <div 
                                  className={`progress-bar ${cd.niveau >= 7 ? 'bg-success' : cd.niveau >= 4 ? 'bg-warning' : 'bg-danger'}`} 
                                  role="progressbar" 
                                  style={{ width: `${cd.niveau * 10}%` }}
                                  aria-valuenow={cd.niveau}
                                  aria-valuemin="0"
                                  aria-valuemax="10"
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          Voir détails
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          Contacter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  {selectedCompetences.length > 0
                    ? "Aucun candidat ne correspond aux compétences sélectionnées"
                    : "Aucun candidat pour ce poste"}
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">Sélectionnez un poste</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatManager;