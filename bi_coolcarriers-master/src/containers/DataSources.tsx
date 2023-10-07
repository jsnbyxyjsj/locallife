import { useEffect, useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { API, Storage } from "aws-amplify";
import { useQuery, gql } from "@apollo/client";
import readXlsxFile from "read-excel-file";
import { formatWithSeparators } from "../libs/functions";
import { permission_update_asoex } from "../libs/permissions";

// === Components ===
import { Row, Col } from "react-bootstrap";
import Modal from "react-modal";
import { Calendar } from "primereact/calendar";
import { ColorRing } from "react-loader-spinner";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");
export default function DataSources() {
  const { navBarOpened, userData } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asoexDocumentId, setAsoexDocumentId] = useState("");
  const [validAsoexDocument, setValidAsoexDocument] = useState(true);
  const [dates, setDates] = useState(null);
  const [asoexFile, setAsoexFile] = useState<File | null>(null);
  const [showModalComparative, setShowModalComparative] = useState(false);
  const [comparativeData, setComparativeData] = useState<any | null>(null);
  const [showModalConfirmation, setShowModalConfirmation] = useState(false);

  const {
    // loading: loadingLastDocument,
    // error: errorLastDocument,
    data: dataLastDocument,
  } = useQuery(
    gql`
      query list_asoex_documents {
        list_asoex_documents(
          order: "[{'column':'created_at','order':'DESC'}]"
          limit: 1
        ) {
          asoex_documents_id
          created_at
          uploaded_by
        }
      }
    `
  );

  const {
    // loading: loadingLastUpdate,
    // error: errorLastUpdate,
    data: dataLastUpdate,
  } = useQuery(
    gql`
      query list_scsdoc_updates {
        list_scsdoc_updates(
          order: "[{'column':'created_at','order':'DESC'}]"
          limit: 1
        ) {
          scsdoc_updates_id
          updated_by
          created_at
        }
      }
    `
  );

  async function uploadAsoexFile() {
    if (asoexFile) {
      let blob;
      let file_;
      let file_id;
      function blobToFile(theBlob: any, fileName: string) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
      }
      // Upload file to S3
      file_id = asoexDocumentId + ".xlsx";
      let file_key = "ASOEX/db_documents/" + file_id;
      blob = new Blob([asoexFile]);
      file_ = blobToFile(blob, asoexFile.name);
      try {
        await Storage.put(file_key, file_);
        return file_key;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }

  const asoexSubmit = async () => {
    setLoading(true);
    let file_key = await uploadAsoexFile();
    if (file_key && dates) {
      const asoexFilling = /* GraphQL */ `
        query asoexFilling($data: AWSJSON) {
          asoexFilling(data: $data)
        }
      `;
      API.graphql({
        query: asoexFilling,
        variables: {
          data: JSON.stringify({
            key: file_key,
            start_date: dates[0],
            end_date: dates[1],
            asoex_document_name: asoexDocumentId,
            uploaded_by: userData?.email,
          }),
        },
      });
      setLoading(false);
      setShowModal(false);
      alert("Data updated successfully");
    }
  };

  const loadFile = (e: any) => {
    let file = e.target.files[0];
    setAsoexFile(file);
  };

  const convertDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const convertedDate = `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;
    return convertedDate;
  };

  const scsdocSubmit = async () => {
    let user_email = userData?.email;
    const scsdocFilling = /* GraphQL */ `
      query scsdocFilling($data: AWSJSON) {
        scsdocFilling(data: $data)
      }
    `;
    API.graphql({
      query: scsdocFilling,
      variables: {
        data: JSON.stringify({
          task: "migrate",
          updated_by: user_email,
        }),
      },
    });
    alert("The update process has started, it may take a few minutes.");
    setShowModalConfirmation(false);
  };

  const viewComparative = async () => {
    if (comparativeData === null) {
      const scsdocFilling = /* GraphQL */ `
        query scsdocFilling($data: AWSJSON) {
          scsdocFilling(data: $data)
        }
      `;
      let response: any = await API.graphql({
        query: scsdocFilling,
        variables: {
          data: JSON.stringify({
            task: "comparate",
          }),
        },
      });
      try {
        setComparativeData(JSON.parse(response.data.scsdocFilling));
      } catch (e) {
        console.log(e);
        setComparativeData({
          error: { scsdoc_platform_rows: 0, statistic_platform_rows: 0 },
        });
      }
    }
  };

  const cleanInputs = () => {
    setAsoexFile(null);
    setDates(null);
    setAsoexDocumentId("");
    setValidAsoexDocument(true);
    setShowModal(false);
  };

  useEffect(() => {
    if (asoexFile) {
      readXlsxFile(asoexFile).then((rows) => {
        let condition_0 = rows[0][1] === "Expordata";
        let condition_1 =
          rows[1][0].toString().includes("Fecha inicio") &&
          rows[1][1].toString().includes("Fecha final");
        let condition_2 =
          JSON.stringify(rows[2]) ===
          JSON.stringify([
            "Especie",
            "Variedad",
            "Cajas",
            "Kg.",
            "Exportador",
            "Región Destino",
            "Puerto Destino",
            "País Destino",
            "Recibidor",
            "Nave",
            "Tipo Nave",
            "Nro. Semana",
            "Fecha",
            "Puerto Embarque",
            "Fecha Arribo",
            "Cod.Reg.Origen",
            "Condición",
          ]);
        if (condition_0 && condition_1 && condition_2) {
          setValidAsoexDocument(true);
        } else {
          setValidAsoexDocument(false);
        }
      });
    }
  }, [asoexFile]);

  return (
    <div
      className={
        "DataSources " +
        (navBarOpened ? "DataSources__navBarOpen" : "DataSources__navBarClose")
      }
    >
      <div className="DataSources__card">
        <h2>ASOEX</h2>
        {dataLastDocument?.list_asoex_documents[0] ? (
          <Row className="justify-content-center">
            <Col style={{ textAlign: "center" }}>
              <h3>Last updated</h3>
              <p>
                {new Date(
                  dataLastDocument.list_asoex_documents[0].created_at
                ).toString()}
              </p>
              <p>By {dataLastDocument.list_asoex_documents[0].uploaded_by}</p>
              <p>
                ID:{" "}
                {dataLastDocument.list_asoex_documents[0].asoex_documents_id}
              </p>
              <button
                onClick={() => {
                  setShowModal(!showModal);
                }}
                disabled={
                  !permission_update_asoex.includes(userData?.email || "")
                }
              >
                Upload new document
              </button>
            </Col>
          </Row>
        ) : (
          <Row>
            <ColorRing
              visible={true}
              height="60"
              width="60"
              ariaLabel="blocks-loading"
              wrapperStyle={{ marginTop: "30px" }}
              wrapperClass="blocks-wrapper"
              colors={["#1D8CEA", "#3154A1", "#80CAEE", "#1D8CEA", "#1D8CEA"]}
            />
          </Row>
        )}
      </div>
      <div className="DataSources__card">
        <h2>SCSDOC</h2>
        {dataLastUpdate?.list_scsdoc_updates[0] ? (
          <Row className="justify-content-center">
            <Col style={{ textAlign: "center" }}>
              <h3>Last updated</h3>
              <p>
                {new Date(
                  dataLastUpdate?.list_scsdoc_updates[0].created_at
                ).toString()}
              </p>
              <p>By {dataLastUpdate?.list_scsdoc_updates[0].updated_by}</p>
              <button
                onClick={() => {
                  setShowModalComparative(true);
                  viewComparative();
                }}
              >
                View comparative
              </button>
              <button onClick={() => setShowModalConfirmation(true)}>
                Update data
              </button>
            </Col>
          </Row>
        ) : (
          <Row>
            <ColorRing
              visible={true}
              height="60"
              width="60"
              ariaLabel="blocks-loading"
              wrapperStyle={{ marginTop: "30px" }}
              wrapperClass="blocks-wrapper"
              colors={["#1D8CEA", "#3154A1", "#80CAEE", "#1D8CEA", "#1D8CEA"]}
            />
          </Row>
        )}
      </div>
      <Modal isOpen={showModal} style={customStyles}>
        <div className="DataSources__Modal">
          <h2>Upload new document</h2>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="DataSources__Modal-upload-button">
              <label htmlFor="files">
                {!asoexFile && (
                  <i
                    className="pi pi-file-excel"
                    style={{
                      color: "#ffffff",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                )}
                <span>{asoexFile ? asoexFile.name : "Select file"}</span>
                <input
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  id="files"
                  type="file"
                  name="images"
                  style={{ display: "none" }}
                  onChange={loadFile}
                  // disabled={!viewSelection}
                />
              </label>
              {asoexFile && (
                <i
                  className="pi pi-trash"
                  onClick={() => {
                    setValidAsoexDocument(true);
                    setAsoexFile(null);
                  }}
                  style={{ color: "#ffffff", marginLeft: "10px" }}
                ></i>
              )}
            </div>
            {!validAsoexDocument && (
              <p className="DataSources__Modal-warning">
                The document does not conform to the format of the data source
              </p>
            )}
          </div>
          <div>
            <label>Select date range</label>
            <div style={{ marginBottom: "20px" }}>
              <Calendar
                value={dates}
                onChange={(e: any) => {
                  setDates(e.value);
                  if (e.value[1]) {
                    setAsoexDocumentId(
                      "ASOEX_" +
                        convertDate(e.value[0]) +
                        "_" +
                        convertDate(e.value[1])
                    );
                  }
                }}
                selectionMode="range"
                readOnlyInput
                className="DataSources__calendar"
              />
            </div>
          </div>
          <div>
            <label>Enter source id</label>
            <div
              className="DataSources__asoexDocumentId"
              style={{ marginBottom: "20px" }}
            >
              <input
                type="text"
                value={asoexDocumentId}
                onChange={(e) => setAsoexDocumentId(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
          {!loading ? (
            <Row>
              <Col style={{ textAlign: "center" }}>
                <button onClick={cleanInputs}>Cancel</button>
              </Col>
              <Col style={{ textAlign: "center" }}>
                <button
                  disabled={
                    !(
                      asoexFile &&
                      dates &&
                      asoexDocumentId &&
                      validAsoexDocument
                    )
                  }
                  onClick={asoexSubmit}
                >
                  Accept
                </button>
              </Col>
            </Row>
          ) : (
            <Row>
              <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="blocks-loading"
                wrapperStyle={{ marginTop: "30px" }}
                wrapperClass="blocks-wrapper"
                colors={["#1D8CEA", "#3154A1", "#80CAEE", "#1D8CEA", "#1D8CEA"]}
              />
            </Row>
          )}
        </div>
      </Modal>
      <Modal isOpen={showModalComparative} style={customStyles}>
        <div className="DataSources__Modal">
          <h2>SCSDOC tables</h2>
          {comparativeData !== null ? (
            <div className="DataSources__Modal-comparative">
              <Row key={"header-comparative"}>
                <Col xs={4} lg={4}>
                  <label>Table name</label>
                </Col>
                <Col xs={4} lg={4} style={{ textAlign: "center" }}>
                  <label>SCSDOC DB rows</label>
                </Col>
                <Col xs={4} lg={4} style={{ textAlign: "center" }}>
                  <label>Statistics DB rows</label>
                </Col>
              </Row>
              {Object.keys(comparativeData)
                .sort()
                .map(function (table: string) {
                  return (
                    <Row key={table + "-comparative"}>
                      <Col xs={4} lg={4}>
                        {table}
                      </Col>
                      <Col xs={4} lg={4} style={{ textAlign: "center" }}>
                        {formatWithSeparators(
                          comparativeData[table]?.scsdoc_platform_rows
                        ) || "0"}
                      </Col>
                      <Col xs={4} lg={4} style={{ textAlign: "center" }}>
                        {formatWithSeparators(
                          comparativeData[table]?.statistic_platform_rows
                        ) || "0"}
                      </Col>
                    </Row>
                  );
                })}
            </div>
          ) : (
            <Row>
              <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="blocks-loading"
                wrapperStyle={{ marginTop: "30px" }}
                wrapperClass="blocks-wrapper"
                colors={["#1D8CEA", "#3154A1", "#80CAEE", "#1D8CEA", "#1D8CEA"]}
              />
            </Row>
          )}
          <Row className="justify-content-center">
            <button
              style={{ width: "80px", marginTop: "30px" }}
              onClick={() => {
                setShowModalComparative(false);
              }}
            >
              Close
            </button>
          </Row>
        </div>
      </Modal>
      <Modal isOpen={showModalConfirmation} style={customStyles}>
        <div className="DataSources__Modal">
          <h2>Update SCSDOC data</h2>
          <label style={{ marginTop: "20px" }}>
            Are you sure of update SCSDOC database?
          </label>
          <Row className="justify-content-around" style={{ marginTop: "30px" }}>
            <Col style={{ textAlign: "center" }}>
              <button onClick={() => setShowModalConfirmation(false)}>
                Cancel
              </button>
            </Col>
            <Col style={{ textAlign: "center" }}>
              <button onClick={scsdocSubmit}>Confirm</button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}
