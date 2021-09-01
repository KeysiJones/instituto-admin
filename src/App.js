import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const AULAS_URL =
    "https://backend-instituto.herokuapp.com/aulas/6128177affc6504f682dbb81";

  const [aulasTerca, setAulasTerca] = useState([]);
  const [aulasQuarta, setAulasQuarta] = useState([]);
  const [aulasQuinta, setAulasQuinta] = useState([]);
  const [aulasSabado, setAulasSabado] = useState([]);

  useEffect(() => {
    fetch(AULAS_URL)
      .then((res) => res.json())
      .then((cursos) => {
        setAulasTerca(cursos.terca);
        setAulasQuarta(cursos.quarta);
        setAulasQuinta(cursos.quinta);
        setAulasSabado(cursos.sabado);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {aulasTerca[0] ? (
          <div>
            <AulasSemana aulas={aulasTerca} diaSemana="terca" />
            <AulasSemana aulas={aulasQuarta} diaSemana="quarta" />
            <AulasSemana aulas={aulasQuinta} diaSemana="quinta" />
            <AulasSemana aulas={aulasSabado} diaSemana="sabado" />
          </div>
        ) : (
          "Carregando cursos..."
        )}
      </header>
    </div>
  );
}

const AulasSemana = ({ aulas, diaSemana }) => {
  const [value, setValue] = useState({});
  const [editableRow, setEditableRow] = useState(0);
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    setValue({ [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const cursoArray = [];

    aulas.forEach((curso) => {
      cursoArray[`${diaSemana}-horario-${curso.id}`] = curso.horario;
      cursoArray[`${diaSemana}-link-${curso.id}`] = curso.link;
      cursoArray[`${diaSemana}-nome-${curso.id}`] = curso.nome;
    });

    setValue(cursoArray);
  }, [aulas]);

  return (
    <div>
      <p className="my-12">Aulas de {diaSemana}</p>
      <div
        className="border-2 border-blue-500 m-12 rounded-lg"
        style={{ textAlignLast: "center" }}
      >
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Horario</th>
              <th>Link</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {aulas.map((curso) => {
              return (
                <tr key={curso.id}>
                  <td id={`${diaSemana}-${curso.id}`} className="p-2">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        placeholder="digite o novo nome do curso"
                        name={`${diaSemana}-nome-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-nome-${curso.id}`]}
                        className="text-black rounded-md p-2"
                      />
                    ) : (
                      <p>{curso.nome}</p>
                    )}
                  </td>
                  <td id={`horario-${diaSemana}-${curso.id}`} className="p-2">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        id={`input-${diaSemana}-${curso.id}`}
                        placeholder="digite o novo horário do curso"
                        name={`${diaSemana}-horario-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-horario-${curso.id}`] ?? ""}
                        className="text-black rounded-md p-2 w-32"
                      />
                    ) : (
                      <p>{curso.horario}</p>
                    )}
                  </td>
                  <td id={`link-${diaSemana}-${curso.id}`} className="p-2">
                    {editableRow === `${diaSemana}-${curso.id}` && edit ? (
                      <input
                        placeholder="novo link"
                        name={`${diaSemana}-link-${curso.id}`}
                        type="text"
                        onChange={handleChange}
                        value={value[`${diaSemana}-link-${curso.id}`] ?? ""}
                        className="text-black rounded-md p-2 w-full"
                      />
                    ) : (
                      <p>{curso.link}</p>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={(e) => {
                        setEdit(!edit);
                        setEditableRow(`${diaSemana}-${curso.id}`);
                      }}
                      className="p-4 bg-blue-400 rounded-2xl m-2"
                    >
                      {edit && editableRow === `${diaSemana}-${curso.id}`
                        ? "Salvar"
                        : "Editar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
