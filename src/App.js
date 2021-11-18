import "./App.css";
import { useEffect, useState } from "react";

const BASE_URL = "https://backend-instituto.herokuapp.com";
// const BASE_URL = "http://192.168.0.13:3001";
const AULAS_URL = `${BASE_URL}/aulas/6128177affc6504f682dbb81`;
const ADICIONAR_AULAS_URL = `${BASE_URL}/novasAulas/6128177affc6504f682dbb81`;
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
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh, setRefresh]);

  return (
    <div className="App">
      <header className="App-header">
        {aulasTerca[0] ? (
          <div>
            <AulasSemana
              aulas={aulasTerca}
              diaSemana="terca"
              setRefresh={setRefresh}
            />
            <AulasSemana
              aulas={aulasQuarta}
              diaSemana="quarta"
              setRefresh={setRefresh}
            />
            <AulasSemana
              aulas={aulasQuinta}
              diaSemana="quinta"
              setRefresh={setRefresh}
            />
            <AulasSemana
              aulas={aulasSabado}
              diaSemana="sabado"
              setRefresh={setRefresh}
            />
          </div>
        ) : (
          "Carregando cursos..."
        )}
      </header>
    </div>
  );
}

const AulasSemana = ({ aulas, diaSemana, setRefresh }) => {
  const [value, setValue] = useState({});
  const [inserting, setInserting] = useState(false);
  const [editableRow, setEditableRow] = useState(0);
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    setValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInsertion = () => {
    setInserting(!inserting);
  };

  useEffect(() => {
    const cursoArray = [];
    aulas.forEach((curso) => {
      cursoArray[`${diaSemana}-horario-${curso.id}`] = curso.horario;
      cursoArray[`${diaSemana}-link-${curso.id}`] = curso.link;
      cursoArray[`${diaSemana}-nome-${curso.id}`] = curso.nome;
    });

    setValue(cursoArray);
  }, [aulas, diaSemana]);
  const dia = {
    terca: "terça",
    quarta: "quarta",
    quinta: "quinta",
    sabado: "sábado",
  };

  return (
    <div>
      <p className="my-12 text-5xl text-blue-400">Aulas de {dia[diaSemana]}</p>
      <button
        onClick={() => handleInsertion()}
        className="bg-blue-200 p-2 text-gray-700 rounded-t-xl outline-none"
      >
        Adicionar nova aula de {dia[diaSemana]}
      </button>
      <div
        className="border-8 border-blue-200 mx-12 mb-12 rounded-lg"
        style={{ textAlignLast: "center" }}
      >
        <table style={{ backgroundColor: "steelblue" }} className="w-full">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Horário</th>
              <th>Link</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inserting ? (
              <tr>
                <td className="p-2">
                  <input
                    name="nome-novo-curso"
                    placeholder="Ex: Doutrina e Convênios"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-2"
                  />
                </td>
                <td className="p-2">
                  <input
                    name="horario-novo-curso"
                    placeholder="Ex: 09h30"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-2 w-32"
                  />
                </td>
                <td className="p-2">
                  <input
                    name="link-novo-curso"
                    placeholder="Ex: https://zoom.us/j/95927244033?"
                    type="text"
                    onChange={handleChange}
                    className="text-black rounded-md p-2 w-full"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={(e) => {
                      if (
                        // eslint-disable-next-line no-restricted-globals
                        confirm("Deseja salvar as alterações realizadas ?")
                      ) {
                        setInserting(!inserting);
                        let payload = {
                          diaSemana: diaSemana,
                          novaAula: {
                            link: value["link-novo-curso"],
                            nome: value["nome-novo-curso"],
                            horario: value["horario-novo-curso"],
                          },
                        };

                        const authToken =
                          localStorage.getItem("authToken") || "";
                        fetch(ADICIONAR_AULAS_URL, {
                          headers: {
                            "Content-Type": "application/json",
                            "x-access-token": authToken,
                          },
                          method: "POST",
                          body: JSON.stringify(payload),
                        })
                          .then((res) => {
                            if (res.status === 403 || res.status === 401) {
                              alert(
                                "Você precisa estar logado para cadastrar novos cursos, por favor digite o seu usuário e senha."
                              );
                              verifyLogged(false);
                            }
                            if (res.status === 200) {
                              alert("Aula cadastrada com sucesso");
                              window.location.reload();
                            }
                          })
                          .then((res) => {
                            if (res.ok === 1) {
                              alert("Aula cadastrada com sucesso");
                            }
                            alert("Erro ao cadastrar aula");
                          })
                          .catch((err) => console.log(err));
                      }
                    }}
                    className="p-4 bg-blue-400 rounded-2xl m-2"
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            ) : null}
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
                        className="underline"
                        href={
                          value[`${diaSemana}-link-${curso.id}`] ?? curso.link
                        }
                      >
                        Assistir aula
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
                          setRefresh((prevState) => !prevState);
                        }
                      }}
                      className="p-4 bg-blue-400 rounded-2xl m-2"
                    >
                      {edit && editableRow === `${diaSemana}-${curso.id}`
                        ? "Salvar"
                        : "Editar"}
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        if (
                          // eslint-disable-next-line no-restricted-globals
                          confirm(
                            `Tem certeza que deseja deletar o curso ${curso.nome} ?`
                          )
                        ) {
                          let updatedData = {
                            diaSemana: diaSemana,
                            aula: { id: curso.id },
                          };

                          const authToken =
                            localStorage.getItem("authToken") || "";

                          fetch(ADICIONAR_AULAS_URL, {
                            headers: {
                              "Content-Type": "application/json",
                              "x-access-token": authToken,
                            },
                            method: "DELETE",
                            body: JSON.stringify(updatedData),
                          })
                            .then((res) => {
                              if (res.status === 403 || res.status === 401) {
                                alert(
                                  "Você precisa estar logado para deletar cursos, por favor digite o seu usuário e senha."
                                );
                                verifyLogged(false);
                              }

                              if (res.status === 200) {
                                alert("Registro deletado com sucesso");
                                window.location.reload();
                              }
                            })
                            .then((res) => {
                              if (res.ok === 1) {
                                alert("Registro deletado com sucesso");
                              }
                              alert("Erro ao atualizar registro");
                            })
                            .catch((err) => console.log(err));
                        }
                      }}
                      className="p-4 bg-red-500 rounded-2xl m-2"
                    >
                      Deletar
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
