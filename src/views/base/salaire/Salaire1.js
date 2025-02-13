

//Nex 
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'

import './Salaire.css';
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd } from '@coreui/icons';
import { getEmployees, getSalaryEmployees, addSalaireEmployee, updateSalaireEmployee, deleteSalaireEmployee } from '../../../services/salaireService';

function App() {
  const startYear = 2024; // Année de départ
  const currentYear = new Date().getFullYear(); // Année actuelle
  const years = Array.from({ length: 4 }, (_, i) => startYear + i);

  const [employees, setEmployees] = useState([]);
  const [salaryEmployees, setSalaryEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [employeeId, setEmployeeId] = useState('');
  // const [monthlySalaries, setMonthlySalaries] = useState('');
  // const [selectedMonth, setSelectedMonth] = useState("");
  // const [year, setYear] = useState(currentYear);
  const [formData, setFormData] = useState({ employeeId: '', monthlySalaries: '', selectedMonth: '', year: currentYear });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [  
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, salaryData] = await Promise.all([getEmployees(), getSalaryEmployees()]);
        setEmployees(employeeData);
        setSalaryEmployees(salaryData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddEmployeeSalary = async (e) => {
    e.preventDefault();


    if (!employeeId || !year || !monthlySalaries) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Préparez les données du salaire à envoyer
    const salaryData = {
      employeeId,
      monthlySalaries: { [selectedMonth]: parseInt(monthlySalaries) }, // Convertir le texte en objet
      year: parseInt(year)
    };

    try {
      const createdSalary = await addSalaireEmployee(salaryData); // Appel à l'API pour créer le salaire

      setSalaryEmployees(prevSalaries => {
        const existingIndex = prevSalaries.findIndex((sal) => sal.employeeId._id === createdSalary.salary.employeeId._id);

        if (existingIndex !== -1) {
          return prevSalaries.map((sal) => {
            if (sal.employeeId._id === createdSalary.salary.employeeId._id) {
              if (sal.year === createdSalary.salary.year) {
                // Si l'année correspond, on fusionne les salaires
                const updatedSalaries = {
                  ...sal.monthlySalaries,
                  ...createdSalary.salary.monthlySalaries,
                };

                return { ...sal, monthlySalaries: updatedSalaries };
              }
            }
            return sal;
          }).concat(
            // Vérifie si l'année et l'employeeId n'existent pas déjà, alors ajoute un nouvel enregistrement
            prevSalaries.some(
              (sal) => sal.employeeId._id === createdSalary.salary.employeeId._id && sal.year === createdSalary.salary.year
            )
              ? [] // Ne rien ajouter
              : [createdSalary.salary] // Ajouter la nouvelle entrée
          );

        } else {
          // L'ID n'existe pas, ajouter un nouvel élément
          return [...prevSalaries, createdSalary.salary];
        }
      }); // Mettre à jour la liste des salaires

      console.log("createdSalary", createdSalary.salary);

    } catch (error) {
      setError("Failed to create salary");
    }


  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await deleteSalaireEmployee(id);
        setSalaryEmployees(prevSalaries => prevSalaries.filter(sal => sal.employeeId._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  /** Mettre à jour un salaire */
  const handleSalaryUpdate = useCallback(async (id, month, year, newSalary) => {
    console.log("id == ", id, month,  year, newSalary);
    
    // setEmployeeId(id)
    // setMonthlySalaries(newSalary)
    // setSelectedMonth(month)
    // setYear(year)
    
    let employeeId = id;
    let monthlySalaries = newSalary;
    let selectedMonth = month;
    console.log("====", employeeId, monthlySalaries, selectedMonth, year);
    // Préparez les données du salaire à envoyer
    const salaryData = {
      employeeId,
      monthlySalaries: { [selectedMonth]: parseInt(monthlySalaries) }, // Convertir le texte en objet
      year: parseInt(year)
    };

    try {
      const createdSalary = await addSalaireEmployee(salaryData); // Appel à l'API pour créer le salaire

      console.log("createdSalary", createdSalary);
      
      setSalaryEmployees(prevSalaries => {
        const existingIndex = prevSalaries.findIndex((sal) => sal.employeeId._id === createdSalary.salary.employeeId._id);

        if (existingIndex !== -1) {
          return prevSalaries.map((sal) => {
            if (sal.employeeId._id === createdSalary.salary.employeeId._id) {
              if (sal.year === createdSalary.salary.year) {
                // Si l'année correspond, on fusionne les salaires
                const updatedSalaries = {
                  ...sal.monthlySalaries,
                  ...createdSalary.salary.monthlySalaries,
                };

                return { ...sal, monthlySalaries: updatedSalaries };
              }
            }
            return sal;
          }).concat(
            // Vérifie si l'année et l'employeeId n'existent pas déjà, alors ajoute un nouvel enregistrement
            prevSalaries.some(
              (sal) => sal.employeeId._id === createdSalary.salary.employeeId._id && sal.year === createdSalary.salary.year
            )
              ? [] // Ne rien ajouter
              : [createdSalary.salary] // Ajouter la nouvelle entrée
          );

        } else {
          // L'ID n'existe pas, ajouter un nouvel élément
          return [...prevSalaries, createdSalary.salary];
        }
      }); // Mettre à jour la liste des salaires

      console.log("createdSalary", createdSalary.salary);

    } catch (error) {
      setError("Failed to create salary");
    }
  });

  // Regrouper les salaires par employé et fusionner les années
  const mergedSalaries = salaryEmployees.reduce((acc, sal) => {
    console.log("sal", sal);
    
    const empId = sal.employeeId._id;

    if (!acc[empId]) {
      acc[empId] = {
        ...sal,
        monthlySalaries: {}, // On initialise un objet vide pour les salaires
        employeeId: sal.employeeId,
      };
    }

    // Ajouter les salaires au bon mois et à la bonne année
    Object.keys(sal.monthlySalaries).forEach(month => {
      acc[empId].monthlySalaries[`${month}-${sal.year}`] = sal.monthlySalaries[month];
    });

    return acc;
  }, {});

  console.log("merg", mergedSalaries);


  // Convertir en tableau
  const mergedSalaryList = Object.values(mergedSalaries);

  const filteredEmployees = mergedSalaryList.filter(employee =>
    employee.employeeId.m_code.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  const availableYears = [...new Set(salaryEmployees.map(emp => emp.year))].sort();

  // Générer les colonnes mois/année dans l'ordre souhaité
  const sortedColumns = [];
  availableYears.forEach((year, index) => {
    if (index > 0 && !sortedColumns.some(col => col.month === "Décembre" && col.year === year - 1)) {
      sortedColumns.push({ month: "Décembre", year: year - 1 });
    }

    months.forEach((month) => {
      sortedColumns.push({ month, year });
    });
  });

  console.log("sortedColumns", sortedColumns);


  return (
    <div className="salary-manager">
      <h1>Gestion des Salaires</h1>

      <form onSubmit={handleAddEmployeeSalary} className="add-employee-form">
        <CFormSelect aria-label="Sélectionner un employée"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className='select-employee'
        >
          <option>Sélectionner un employé</option>
          {employees.map((employee, index) => (
            <option key={index} value={employee._id}>{employee.m_code} ({employee.usuel})</option>
          ))}
        </CFormSelect>
        <CFormInput
          type="text"  // Changer en "text" pour bien afficher les espaces
          placeholder="Salaire de base"
          className="select-employee"
          value={Number(monthlySalaries).toLocaleString('fr-FR')} // Affichage formaté
          onChange={(e) => {
            let rawValue = e.target.value.replace(/\s+/g, ''); // Supprime les espaces
            setMonthlySalaries(rawValue); // Stocke la valeur brute
          }}
          style={{
            textAlign: 'right',
            padding: '5px',
            fontSize: '16px',
            // fontWeight: 'bold'
          }}
        />

        <CFormSelect
          aria-label="Sélectionner un mois"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className='select-month'
        >
          <option value="">Sélectionner un mois</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </CFormSelect>
        <CFormSelect
          aria-label="Sélectionner une année"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className='select-year'
        >
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </CFormSelect>

        <CButton className='add-employee' type="submit">
          <CIcon icon={cilLibraryAdd} />
        </CButton>
      </form>

      <div className="search-bar">
        <CFormInput
          type="text"
          placeholder="Rechercher un employé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
        />
      </div>
      <div className="salary-list-container">
        <table className="salary-list-table">
          <thead>
            <tr>
              <th>Employé</th>
              {sortedColumns.map(({ month, year }, index) => (
                <th key={index}>{month} {year}</th>
              ))}
              <th>Total Annuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => {
              let totalAnnuel = sortedColumns.reduce((total, { month, year }) => {
                let key = `${months.indexOf(month) + 1}-${year}`;
                return total + (employee.monthlySalaries[key] || 0);
              }, 0).toLocaleString('fr-FR');

              return (
                <tr key={employee.employeeId._id}>
                  <td>{employee.employeeId.m_code}</td>
                  {sortedColumns.map(({ month, year }, index) => {
                    let key = `${months.indexOf(month) + 1}-${year}`;
                    // Trouver le bon mois dans les salaires de l'employé
                    let salaryValue = employee.monthlySalaries[key] || 0;

                    return (
                      <td key={index}>
                        <input
                          type="text"
                          value={salaryValue ? salaryValue.toLocaleString('fr-FR') : ''}
                          onChange={(e) => {
                            let rawValue = e.target.value.replace(/\s+/g, '');
                            handleSalaryUpdate(employee.employeeId._id, months.indexOf(month) + 1, year, rawValue);
                          }}
                          style={{
                            textAlign: 'right',
                            padding: '5px',
                            fontSize: '16px',
                          }}
                        />
                      </td>
                    );
                  })}
                  <td className='total'>{totalAnnuel} €</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEmployee(employee.employeeId._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>

              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;

















//Nex 
// import { useEffect, useState, useCallback, useMemo } from 'react';
// import {
//   CFormInput,
//   CFormSelect,
//   CButton,
// } from '@coreui/react'

// import './Salaire.css';
// import CIcon from '@coreui/icons-react';
// import { cilLibraryAdd } from '@coreui/icons';
// import { getEmployees, getSalaryEmployees, addSalaireEmployee, updateSalaireEmployee, deleteSalaireEmployee } from '../../../services/salaireService';

// function App() {
//   const startYear = 2024; // Année de départ
//   const currentYear = new Date().getFullYear(); // Année actuelle
//   const years = Array.from({ length: 4 }, (_, i) => startYear + i);

//   const [employees, setEmployees] = useState([]);
//   const [salaryEmployees, setSalaryEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [monthlySalaries, setMonthlySalaries] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [year, setYear] = useState(currentYear);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const months = [
//     'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
//     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
//   ];


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [employeeData, salaryData] = await Promise.all([getEmployees(), getSalaryEmployees()]);
//         setEmployees(employeeData);
//         setSalaryEmployees(salaryData);
//       } catch (err) {
//         setError('Erreur lors du chargement des données');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   const handleAddEmployeeSalary = async (e) => {
//     e.preventDefault();


//     if (!employeeId || !year || !monthlySalaries) {
//       alert('Veuillez remplir tous les champs');
//       return;
//     }

//     // Préparez les données du salaire à envoyer
//     const salaryData = {
//       employeeId,
//       monthlySalaries: { [selectedMonth]: parseInt(monthlySalaries) }, // Convertir le texte en objet
//       year: parseInt(year)
//     };

//     try {
//       const createdSalary = await addSalaireEmployee(salaryData); // Appel à l'API pour créer le salaire

//       setSalaryEmployees(prevSalaries => {
//         const existingIndex = prevSalaries.findIndex((sal) => sal.employeeId._id === createdSalary.salary.employeeId._id);

//         if (existingIndex !== -1) {
//           // L'ID existe déjà, mettre à jour uniquement le mois
//           // const updatedSalaries = prevSalaries.map((sal, index) =>
//           //   index === existingIndex
//           //     ? {
//           //       ...sal,
//           //       monthlySalaries: {
//           //         ...sal.monthlySalaries,
//           //         ...createdSalary.salary.monthlySalaries
//           //       }
//           //     }
//           //     : sal
//           // );
//           // return updatedSalaries;
//           return prevSalaries.map((sal) => {
//             if (sal.employeeId._id === createdSalary.salary.employeeId._id) {
//               // Si l'employé existe déjà, on fusionne correctement ses `monthlySalaries`
//               const updatedSalaries = {
//                 ...sal.monthlySalaries,
//                 ...createdSalary.salary.monthlySalaries,
//               };
    
//               return { ...sal, monthlySalaries: updatedSalaries };
//             }
//             return sal;
//           });
//         } else {
//           // L'ID n'existe pas, ajouter un nouvel élément
//           return [...prevSalaries, createdSalary.salary];
//         }
//       }); // Mettre à jour la liste des salaires

//       console.log("createdSalary", createdSalary.salary);
      
//     } catch (error) {
//       setError("Failed to create salary");
//     }


//   };

//   const handleDeleteEmployee = async (id) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
//       try {
//         await deleteSalaireEmployee(id);
//         setSalaryEmployees(prevSalaries => prevSalaries.filter(sal => sal._id !== id));
//         console.log("delete success");

//       } catch (error) {
//         console.error("Erreur lors de la suppression", error);
//       }
//     }
//   };

//   /** Mettre à jour un salaire */
//   const handleSalaryUpdate = useCallback(async (id, month, newSalary) => {
//     try {
//       // Création de l'objet de mise à jour
//       let newMonthlySalaries = { [month]: parseInt(newSalary) };

//       console.log("newMonthlySalaries", id, newMonthlySalaries);
      
      
//       // ⚡ Mettre à jour immédiatement l'état local pour éviter d'attendre l'API
//       setSalaryEmployees(prevSalaries =>
//         prevSalaries.map(sal =>
//           sal._id === id
//             ? {
//               ...sal,
//               monthlySalaries: {
//                 ...sal.monthlySalaries,
//                 ...newMonthlySalaries  // On met à jour directement avec la nouvelle valeur
//               }
//             }
//             : sal
//         )
//       );

//       // ⚡ Ensuite, appeler l'API (et ne pas dépendre d'elle pour la mise à jour immédiate)
//       const updatedSalary = await updateSalaireEmployee(id, { monthlySalaries: newMonthlySalaries });


//     } catch (error) {
//       console.error("Erreur lors de la mise à jour du salaire", error);
//     }
//   });

// // Regrouper les salaires par employé et fusionner les années
// const mergedSalaries = salaryEmployees.reduce((acc, sal) => {
//   const empId = sal.employeeId._id;

//   if (!acc[empId]) {
//     acc[empId] = {
//       ...sal,
//       monthlySalaries: {}, // On initialise un objet vide pour les salaires
//       employeeId: sal.employeeId,
//     };
//   }

//   // Ajouter les salaires au bon mois et à la bonne année
//   Object.keys(sal.monthlySalaries).forEach(month => {
//     acc[empId].monthlySalaries[`${month}-${sal.year}`] = sal.monthlySalaries[month];
//   });

//   return acc;
// }, {});

// console.log("merg", mergedSalaries);


// // Convertir en tableau
// const mergedSalaryList = Object.values(mergedSalaries);

//   const filteredEmployees = mergedSalaryList.filter(employee =>
//     employee.employeeId.m_code.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  

//   if (loading) return <p>Chargement des données...</p>;
//   if (error) return <p>{error}</p>;

//   const availableYears = [...new Set(salaryEmployees.map(emp => emp.year))].sort();

//   // Générer les colonnes mois/année dans l'ordre souhaité
//   const sortedColumns = [];
//   availableYears.forEach((year, index) => {
//     months.forEach((month, monthIndex) => {
//       // Si ce n'est pas la première année, mettre Décembre avant Janvier
//       if (index > 0 && monthIndex === 0) {
//         sortedColumns.push({ month: "Décembre", year: year - 1 }); // Ajoute Décembre de l'année précédente
//       }
//       sortedColumns.push({ month, year }); // Ajoute le mois de l'année actuelle
//     });
//   });


//   return (
//     <div className="salary-manager">
//       <h1>Gestion des Salaires</h1>

//       <form onSubmit={handleAddEmployeeSalary} className="add-employee-form">
//         <CFormSelect aria-label="Sélectionner un employée"
//           value={employeeId}
//           onChange={(e) => setEmployeeId(e.target.value)}
//           className='select-employee'
//         >
//           <option>Sélectionner un employé</option>
//           {employees.map((employee, index) => (
//             <option key={index} value={employee._id}>{employee.m_code} ({employee.usuel})</option>
//           ))}
//         </CFormSelect>
//         <CFormInput
//           type="text"  // Changer en "text" pour bien afficher les espaces
//           placeholder="Salaire de base"
//           className="select-employee"
//           value={Number(monthlySalaries).toLocaleString('fr-FR')} // Affichage formaté
//           onChange={(e) => {
//             let rawValue = e.target.value.replace(/\s+/g, ''); // Supprime les espaces
//             setMonthlySalaries(rawValue); // Stocke la valeur brute
//           }}
//           style={{
//             textAlign: 'right',
//             padding: '5px',
//             fontSize: '16px',
//             // fontWeight: 'bold'
//           }}
//         />

//         <CFormSelect
//           aria-label="Sélectionner un mois"
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className='select-month'
//         >
//           <option value="">Sélectionner un mois</option>
//           {months.map((month, index) => (
//             <option key={index} value={index + 1}>{month}</option>
//           ))}
//         </CFormSelect>
//         <CFormSelect
//           aria-label="Sélectionner une année"
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className='select-year'
//         >
//           {years.map((year, index) => (
//             <option key={index} value={year}>{year}</option>
//           ))}
//         </CFormSelect>

//         <CButton className='add-employee' type="submit">
//           <CIcon icon={cilLibraryAdd} />
//         </CButton>
//       </form>

//       <div className="search-bar">
//         <CFormInput
//           type="text"
//           placeholder="Rechercher un employé..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
//         />
//       </div>
//       <div className="salary-list-container">
//         <table className="salary-list-table">
//           <thead>
//             <tr>
//               <th>Employé</th>
//               {sortedColumns.map(({ month, year }, index) => (
//                 <th key={index}>{month} {year}</th>
//               ))}
//               <th>Total Annuel</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map(employee => {
//               let totalAnnuel = sortedColumns.reduce((total, { month, year }) => {
//                 let key = `${months.indexOf(month) + 1}-${year}`;
//                 return total + (employee.monthlySalaries[key] || 0);
//               }, 0).toLocaleString('fr-FR');
              
//               return (
//                 <tr key={employee.employeeId._id}>
//                   <td>{employee.employeeId.m_code}</td>
//                   {sortedColumns.map(({ month, year }, index) => {
//                   let key = `${months.indexOf(month) + 1}-${year}`;
//                     // Trouver le bon mois dans les salaires de l'employé
//                     let salaryValue = employee.monthlySalaries[key] || 0;

//                     return (
//                       <td key={index}>
//                         <input
//                           type="text"
//                           value={salaryValue ? salaryValue.toLocaleString('fr-FR') : ''}
//                           onChange={(e) => {
//                             let rawValue = e.target.value.replace(/\s+/g, '');
//                             handleSalaryUpdate(employee._id, months.indexOf(month) + 1, rawValue);
//                           }}
//                           style={{
//                             textAlign: 'right',
//                             padding: '5px',
//                             fontSize: '16px',
//                           }}
//                         />
//                       </td>
//                     );
//                   })}
//                   <td className='total'>{totalAnnuel} €</td>

//                   <td>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDeleteEmployee(employee._id)}
//                     >
//                       Supprimer
//                     </button>
//                   </td>
//                 </tr>

//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }

// export default App;




