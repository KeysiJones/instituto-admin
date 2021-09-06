import "./App.css";
import { useEffect, useState } from "react";

const BASE_URL = "https://backend-instituto.herokuapp.com";
// const BASE_URL = "http://192.168.0.13:3001";
const AULAS_URL = `${BASE_URL}/aulas/6128177affc6504f682dbb81`;
const LOGIN_URL = `${BASE_URL}/login`;
const verifyLogged = (isValid) => {
  let username, password;

  const token = localStorage.getItem("authToken") || "";

  if (isValid) {
    while (!username && !token) {
      username = prompt("Por favor, digite o seu usuário abaixo:");
    }

    while (!password && !token) {
      password = prompt("Agora digite a sua senha:");
    }

    if (username && password) {
      login(username, password);
    }
  } else {
    while (!username) {
      username = prompt("Por favor, digite o seu usuário abaixo:");
    }

    while (!password) {
      password = prompt("Agora digite a sua senha:");
    }

    if (username && password) {
      login(username, password);
    }
  }
};

const login = (username, password) => {
  fetch(LOGIN_URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((resposta) => {
      if (resposta.status === 200 && resposta.token) {
        localStorage.setItem("authToken", resposta.token);
        alert("Login realizado com sucesso");
        return;
      }

      alert(resposta.message);
    });
};

function App() {
  const [aulasTerca, setAulasTerca] = useState([]);
  const [aulasQuarta, setAulasQuarta] = useState([]);
  const [aulasQuinta, setAulasQuinta] = useState([]);
  const [aulasSabado, setAulasSabado] = useState([]);

  useEffect(() => {
    verifyLogged(true);

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
    setValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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
  const dia = {
    terca: "terça",
    quarta: "quarta",
    quinta: "quinta",
    sabado: "sábado",
  };

  return (
    <div>
      <p className="my-12 text-3xl">Aulas de {dia[diaSemana]}</p>
      <div
        className="border-4 border-white m-12 rounded-lg"
        style={{ textAlignLast: "center" }}
      >
        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Horário</th>
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
                      <p>
                        {value[`${diaSemana}-nome-${curso.id}`] ?? curso.nome}
                      </p>
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
                      <p>
                        {value[`${diaSemana}-horario-${curso.id}`] ??
                          curso.horario}
                      </p>
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
                      <a
                        href={
                          value[`${diaSemana}-link-${curso.id}`] ?? curso.link
                        }
                      >
                        {value[`${diaSemana}-link-${curso.id}`] ?? curso.link}
                      </a>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={(e) => {
                        setEdit(!edit);
                        setEditableRow(`${diaSemana}-${curso.id}`);
                        if (e.target.innerText === "Salvar") {
                          if (
                            // eslint-disable-next-line no-restricted-globals
                            confirm("Deseja salvar as alterações realizadas ?")
                          ) {
                            let novasAulas = {
                              id: curso.id,
                              link: value[`${diaSemana}-link-${curso.id}`],
                              nome: value[`${diaSemana}-nome-${curso.id}`],
                              horario:
                                value[`${diaSemana}-horario-${curso.id}`],
                            };

                            let updatedData = {
                              diaSemana: diaSemana,
                              novasAulas: novasAulas,
                            };

                            const authToken =
                              localStorage.getItem("authToken") || "";

                            fetch(AULAS_URL, {
                              headers: {
                                "Content-Type": "application/json",
                                "x-access-token": authToken,
                              },
                              method: "PUT",
                              body: JSON.stringify(updatedData),
                            })
                              .then((res) => {
                                if (res.status === 403 || res.status === 401) {
                                  alert(
                                    "Você precisa estar logado para editar registros, por favor digite o seu usuário e senha."
                                  );
                                  verifyLogged(false);
                                }

                                if (res.status === 200) {
                                  alert("Registro atualizado com sucesso");
                                }
                              })
                              .then((res) => {
                                if (res.ok === 1) {
                                  alert("Registro atualizado com sucesso");
                                }
                                alert("Erro ao atualizar registro");
                              })
                              .catch((err) => console.log(err));
                          }
                        }
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
