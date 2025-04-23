import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios"; 
import { Button, IconButton, Alert, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function ListEventos() {
  const [eventos, setEventos] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const navigate = useNavigate();

  // Função para exibir alertas
  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  // Função para fechar alertas
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  async function getEventos() {
    try {
      const response = await api.getEventos();
      setEventos(response.data.eventos); 
    } catch (error) {
      console.error("Erro ao buscar eventos", error);
      showAlert("error", "Erro ao buscar eventos");
    }
  }

  // Função para deletar evento
  async function deleteEvento(id) {
    try {
      await api.deleteEvento(id);
      await getEventos(); 
      showAlert("success", "Evento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar evento", error);
      showAlert("error", error.response.data.error);
    }
  }

  // Função de logout
  function logout() {
    localStorage.removeItem("authenticated");
    navigate("/"); // Redireciona para a página de login
  }

  // Mapeando os eventos para exibição na tabela
  const listEventos = eventos.map((evento) => (
    <TableRow key={evento.id_evento}>
      <TableCell align="center">{evento.nome}</TableCell>
      <TableCell align="center">{evento.descricao}</TableCell>
      <TableCell align="center">{evento.data_hora}</TableCell>
      <TableCell align="center">{evento.local}</TableCell>
      <TableCell align="center">
        <IconButton onClick={() => deleteEvento(evento.id_evento)}>
          <DeleteIcon color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  ));

  // Hook para carregar os eventos na inicialização
  useEffect(() => {
    getEventos();
  }, []);

  return (
    <div>
      {/* Exibe um alerta usando o Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Condicionalmente exibe "Carregando..." ou a lista de eventos */}
      {eventos.length === 0 ? (
        <h1>Carregando eventos...</h1>
      ) : (
        <div>
          <h5>Lista de Eventos</h5>

          {/* Botão para redirecionar para a lista de usuários */}
          <Button
            variant="outlined"
            color="primary"
            style={{ marginBottom: "10px" }}
            onClick={() => navigate("/users")} // Redireciona para a lista de usuários
          >
            Ir para Lista de Usuários
          </Button>

          {/* Tabela de Eventos */}
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead style={{ backgroundColor: "brown", borderStyle: "solid" }}>
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center">Data e Hora</TableCell>
                  <TableCell align="center">Local</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listEventos}</TableBody>
            </Table>
          </TableContainer>

          {/* Botão para logout */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "15px" }}
            onClick={logout}
          >
            SAIR
          </Button>
        </div>
      )}
    </div>
  );
}

export default ListEventos;