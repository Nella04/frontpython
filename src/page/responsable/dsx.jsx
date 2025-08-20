import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfileCompetences = () => {
  const { candidatId } = useParams();
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les postes du candidat
        const postesResponse = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${candidatId}`
        );
        setPostes(postesResponse.data);

        // Récupérer les compétences du candidat avec leurs niveaux
        const competencesResponse = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${candidatId}`
        );
        
        // Pour chaque compétence, récupérer le nom de la compétence
        const competencesWithDetails = await Promise.all(
          competencesResponse.data.map(async (cc) => {
            const competenceResponse = await axios.get(
              `${process.env.REACT_APP_BACK_URL}/api/competences/${cc.competence}/`
            );
            return {
              id: cc.id,
              competenceId: cc.competence,
              nom: competenceResponse.data.nom_competence,
              niveau: cc.niveau
            };
          })
        );
        
        setCompetences(competencesWithDetails);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [candidatId]);

  const filteredCompetences = competences.filter(comp =>
    comp.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mes Compétences</h1>
      
      {/* Section Postes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Postes occupés</h2>
        {postes.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postes.map(poste => (
              <li key={poste.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium">{poste.nom_poste}</h3>
                <p className="text-sm text-gray-600">
                  {poste.tester ? "Testé" : "Non testé"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun poste trouvé</p>
        )}
      </div>

      {/* Section Compétences */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes Compétences</h2>
          <input
            type="text"
            placeholder="Rechercher une compétence..."
            className="px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCompetences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Compétence</th>
                  <th className="py-3 px-4 text-left">Niveau</th>
                  <th className="py-3 px-4 text-left">Progression</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetences.map(comp => (
                  <tr key={comp.id} className="border-t">
                    <td className="py-3 px-4">{comp.nom}</td>
                    <td className="py-3 px-4">{comp.niveau}/10</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${comp.niveau * 10}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucune compétence trouvée{searchTerm && ` pour "${searchTerm}"`}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompetences;