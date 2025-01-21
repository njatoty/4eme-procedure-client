import React, { useEffect, useMemo, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CBadge,
  CAlert,
  CTooltip,
} from "@coreui/react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Save,
  CheckCheck,
} from "lucide-react";
import IRSAService from "../../../services/fp-option-service";

const NumericInput = ({ value, onChange }) => {
  const val = useMemo(() => value || "", [value]);
  // const displayValue = useMemo(() => MGFormat(parseFloat(value ? +value : 0)), [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim().replace(/\s/g, "");

    // Allow only numbers and a single comma
    if (/^[0-9]*,?[0-9]*$/.test(inputValue)) {
      if (inputValue.startsWith("0")) {
        onChange?.(inputValue.slice(1));
      } else {
        onChange?.(inputValue);
      }
    }
  };

  return (
    <CFormInput
      type="text"
      inputMode="numeric"
      value={val}
      onChange={handleInputChange}
      placeholder="0,0" />
  );
};


const IRSADuForm = () => {
  const [minValue, setMinValue] = useState(3000);
  const [w10, setW10] = useState("0");
  const [x10, setX10] = useState("0");
  const [thresholds, setThresholds] = useState([]);
  const [copyButtonText, setCopyButtonText] = useState("Copier");
  const [isSaving, setIsSaving] = useState(false);
  const [internetError, setInternetError] = useState(true);
  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showMessageBox = (type, message) => {
    setMessageBox({ show: true, type, message });
    setTimeout(() => {
      setMessageBox({ show: false, type, message: "" });
    }, 5000);
  };

  // revenu et deduction
  const revenu = useMemo(() => parseFloat(w10.replace(",", ".")) || 0, [w10]);
  const deduction = useMemo(
    () => parseFloat(x10.replace(",", ".")) || 0,
    [x10],
  );

  async function fetchIRSAData() {
    try {
      setInternetError(false);
      const response = await IRSAService.getOption();
      const { tranches, valeurMinimum } = response;
      if (Array.isArray(tranches)) {
        setThresholds(tranches.map((t, index) => ({ ...t, id: index + 1 }))); // with id
      }
      /// set min value
      if (valeurMinimum) setMinValue(valeurMinimum);
    } catch (err) {
      setInternetError(true);
    }
  }

  // every the page renders, this should be triggered
  useEffect(() => {
    void fetchIRSAData();
  }, []);

  const handleAddThreshold = () => {
    const newId = thresholds.length
      ? Math.max(...thresholds.map((t) => t.id)) + 1
      : 1;
    setThresholds([
      ...thresholds,
      { id: newId, seuil: 0, plage: Infinity, taux: 0 },
    ]);
  };

  const handleRemoveThreshold = async (id) => {
    setThresholds(thresholds.filter((threshold) => threshold.id !== id));
  };

  const parseNumberInput = (value) => {
    // Remove all spaces and replace commas with dots
    const normalizedValue = value.replace(/\s/g, "").replace(",", ".");
    const parsedValue = parseFloat(normalizedValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const formatNumberInput = (value) => {
    if (value === Infinity) return "";
    return value ? value.toString().replace(".", ",") : "";
  };

  const handleChangeThreshold = (id, field, value) => {
    setThresholds(
      thresholds.map((threshold) => {
        if (threshold.id !== id) return threshold;

        let parsedValue;
        if (field === "plage" && value.trim() === "") {
          parsedValue = Infinity;
        } else {
          parsedValue = parseNumberInput(value);
        }

        return { ...threshold, [field]: parsedValue };
      }),
    );
  };

  const MGFormat = (value) =>
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    let total = 0;

    thresholds.forEach(({ seuil, plage, taux }) => {
      // Étape 1 : Calcul de la différence (revenu - seuil)
      const difference = Math.max(0, revenu - seuil);

      // Étape 2 : Gestion de la plage (plage définie ou Infinity)
      const effectivePlage =
        plage === Infinity || plage === null
          ? difference
          : Math.min(difference, plage);

      // Étape 3 : Appliquer le taux
      const part = effectivePlage * (taux / 100);

      // Ajouter la contribution
      total += part;
    });

    // Étape 4 : Appliquer les ajustements finaux
    const result = Math.max(minValue, total - deduction);

    return MGFormat(result);
  };

  const generateExcelFormula = (
    thresholds,
    w10Variable = "W10",
    x10Variable = "X10",
    minValue = 3000,
  ) => {
    const formulaParts = thresholds.map(({ seuil, plage, taux }) => {
      return plage === Infinity || plage === null
        ? `MAX(0;${w10Variable}-${seuil})*${taux}%`
        : `MIN(MAX(0;${w10Variable}-${seuil});${plage})*${taux}%`;
    });

    return `=MAX(${minValue};0+${formulaParts.join("+")}-${x10Variable})`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyButtonText("Copié !");
        setTimeout(() => setCopyButtonText("Copier"), 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const excelFormula = useMemo(
    () => generateExcelFormula(thresholds, "W10", "X10", minValue),
    [thresholds, w10, x10, minValue],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // first update valeur minimum
      await IRSAService.updateIRSA(minValue);
      // next delete all tranches
      await IRSAService.deleteAllTranches();
      // add the all tranches
      const response3 = await IRSAService.addManyTranches(
        thresholds.map((tranche) => {
          const { id, ...rest } = tranche; /// remove id
          return rest;
        }),
      );
      // change threshold
      const { tranches } = response3;
      if (Array.isArray(tranches)) {
        setThresholds(tranches.map((t, index) => ({ ...t, id: index + 1 }))); // with id
      }
      // Handle successful save
      showMessageBox("success", "Données enregistrées avec succès!");
    } catch (error) {
      // Handle save error
      console.error("Save failed:", error);
      showMessageBox("error", "Enregistrement échoué!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CCard className="overflow-hidden relative">
      {/* When there is error this should show */}
      {internetError && (
        <div className="position-absolute d-flex align-items-center justify-content-center w-100 h-100 z-index-50 bg-dark bg-opacity-40 backdrop-blur-sm">
          <div className="text-center d-flex flex-column gap-2">
            <h2 className="fw-bold fs-4 text-warning">Erreur de réseaux</h2>
            <p className="fs-6 mx-auto w-75 text-white">
              Nous ne pouvons pas se connecter à internet. Merci d&apos;actualiser votre page.
            </p>
            <CButton color="light" onClick={fetchIRSAData}>
              Actualiser
            </CButton>
          </div>
        </div>
      )}
      <CCardBody className="p-6">
        <fieldset disabled={internetError}>
          <legend className="visually-hidden">IRSA Dû</legend>
          <CForm>
            <CCard className="mb-4 border-0 shadow-sm">
              <CCardHeader className="border-bottom-0">
                <h6 className="m-0 d-flex align-items-center">
                  <span className="me-2">Paramètres généraux</span>
                  <hr className="flex-grow-1 border-secondary" />
                </h6>
              </CCardHeader>
              <CCardBody className="p-3">
                <CRow className="g-4">
                  <CCol md={4}>
                    <div className="position-relative">
                      <CFormLabel className="d-flex align-items-center gap-2 text-sm">
                        Valeur minimum
                        <CTooltip content="Valeur minimale garantie">
                          <HelpCircle size={16} className="h-4 w-4 text-secondary" />
                        </CTooltip>
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        value={formatNumberInput(minValue)}
                        onChange={(e) =>
                          setMinValue(parseNumberInput(e.target.value))
                        }
                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <CCard className="mb-4 border-0 shadow-sm">
              <CCardHeader className="border-bottom-0">
                <h6 className="m-0 d-flex align-items-center">
                  <span className="me-2">Tranches</span>
                  <hr className="flex-grow-1 border-secondary" />
                  <CButton
                    color="primary"
                    className="ms-2 px-3 py-2 bg-gradient border-0"
                    onClick={handleAddThreshold}
                  >
                    <Plus size={18} className="me-2" />
                    Ajouter un Tranche
                  </CButton>
                </h6>
              </CCardHeader>
              <CCardBody className="p-4 overflow-y-auto max-h-[650px]">
                {thresholds.length === 0 ? (
                  <CRow>
                    <CCol md={12}>
                      <p className="text-gray-400">Aucunes données</p>
                    </CCol>
                  </CRow>
                ) : (
                  thresholds.map(({ id, seuil, plage, taux }, index) => (
                    <CCard
                      key={id}
                      className="position-relative my-3"
                    >
                      <span className="position-absolute bg-primary text-white d-flex align-items-center justify-content-center rounded top-0 start-0 translate-middle small"
                        style={{ width: '1.25rem', height: '1.25rem', aspectRatio: '1' }}
                      >
                        {index + 1}
                      </span>
                      <CCardBody className="p-2 pb-3">
                        <CRow className="px-2">
                          <CCol md={4}>
                            <CFormLabel className="fs-6">
                              <span className="visually-hidden">Seuil</span>
                              <span className="fw-italic text-gray-700">
                                Limite de tranche
                              </span>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              value={formatNumberInput(seuil)}
                              onChange={(e) =>
                                handleChangeThreshold(
                                  id,
                                  "seuil",
                                  e.target.value,
                                )
                              }
                              className="rounded-md"
                            />
                          </CCol>
                          <CCol md={4}>
                            <CFormLabel className="fs-6">
                              <span className="visually-hidden">Plage</span>
                              <span className="italic text-gray-700">
                                Montant de tranche
                              </span>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              value={formatNumberInput(plage)}
                              placeholder="∞"
                              onChange={(e) =>
                                handleChangeThreshold(
                                  id,
                                  "plage",
                                  e.target.value,
                                )
                              }
                              className="rounded-md"
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel className="fs-6">
                              <span className="italic text-gray-700">
                                Taux (%)
                              </span>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              value={formatNumberInput(taux)}
                              onChange={(e) =>
                                handleChangeThreshold(
                                  id,
                                  "taux",
                                  e.target.value,
                                )
                              }
                              className="rounded-md"
                            />
                          </CCol>
                          <CCol md={2} className="d-flex align-items-center">
                            <CButton
                              color="danger"
                              variant="ghost"
                              className="w-auto mx-auto fs-6 d-flex align-items-center justify-content-center"
                              onClick={() => handleRemoveThreshold(id)}
                              title="Supprimer la tranche"
                            >
                              <Trash2 size={18} />
                            </CButton>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  ))
                )}
              </CCardBody>
            </CCard>

            <CCard className="border-0 shadow-sm mb-6">
              <CCardHeader className="border-bottom-0">
                <h6 className="m-0 d-flex align-items-center">
                  <span className="me-2">Exemple Excel Formula</span>
                  <hr className="flex-grow-1 border-secondary" />
                </h6>
              </CCardHeader>
              <CCardBody className="p-2">
                <CAlert
                  color="warning"
                  className="mb-0"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-base">{excelFormula}</span>
                    <CButton
                      color="light"
                      className="ml-2 px-2 py-1"
                      onClick={() => copyToClipboard(excelFormula)}
                    >
                      {copyButtonText}
                    </CButton>
                  </div>
                </CAlert>
              </CCardBody>
            </CCard>

            <CCard className="border-0 shadow-sm mb-6">
              <CCardHeader className="border-bottom-0">
                <h6 className="m-0 d-flex align-items-center">
                  <span className="me-2">Tester</span>
                  <hr className="flex-grow-1 border-secondary" />
                </h6>
              </CCardHeader>
              <CCardBody className="p-2">
                <CAlert
                  color="primary"
                  className="mb-0 border-2"
                >
                  <CRow className="g-4 mb-2">
                    <CCol md={4}>
                      <div className="position-relative">
                        <CFormLabel className="d-flex align-items-center gap-2 text-sm">
                          Revenu imposable
                          <CTooltip content="Salaire imposable dans le fichier de paie">
                            <HelpCircle size={16} className="text-secondary" />
                          </CTooltip>
                        </CFormLabel>
                        <NumericInput
                          value={formatNumberInput(w10)}
                          onChange={(val) => setW10(val)}
                        />
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <div className="position-relative">
                        <CFormLabel className="d-flex align-items-center gap-2 text-sm">
                          Déduction
                          <CTooltip content="Montant à déduire pour personne à charge">
                            <HelpCircle size={16} className="text-secondary" />
                          </CTooltip>
                        </CFormLabel>
                        <NumericInput
                          value={formatNumberInput(x10)}
                          onChange={(val) => setX10(val)}
                        />
                      </div>
                    </CCol>

                    <CCol md={4}>
                      <div className="position-relative">
                        <CFormLabel className="d-flex align-items-center gap-2 text-sm">
                          Résultat IRSA dû:
                          <CTooltip content="Résultat de l'IRSA dû">
                            <HelpCircle size={16} className="text-secondary" />
                          </CTooltip>
                        </CFormLabel>
                        <CFormInput
                          value={calculate() + " MGA"}
                          readOnly
                          className="w-100 bg-dark text-white fw-bold"
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CAlert>
              </CCardBody>
            </CCard>

            <CRow className="mt-2 py-2">
              <CCol md={6} className="mb-2">
                <CButton
                  color="success"
                  className="d-flex align-items-center gap-2 text-white"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span>Enregistrement en cours...</span>
                  ) : (
                    <>
                      <Save size={18} />
                      Enregistrer
                    </>
                  )}
                </CButton>
              </CCol>
              <CCol md={6} className="mb-2">
                {messageBox.show && (
                  <CAlert
                    color={messageBox.type}
                    className="d-flex align-items-center gap-2"
                  >
                    <CheckCheck size={18} /> {messageBox.message}
                  </CAlert>
                )}
              </CCol>
            </CRow>
          </CForm>
        </fieldset>
      </CCardBody>
    </CCard>
  );
};

export default IRSADuForm;
