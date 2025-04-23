import { useState, useEffect } from "react";
// Imports para criação de tabela
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
// TableHead é onde colocamos os títulos
import TableHead from "@mui/material/TableHead";
// TableBody é onde colocamos o conteúdo
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios";
import { Button, IconButton, Alert, Snackbar } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";

function listEventos() {
  const [eventos, setEventos] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const navigate = useNavigate();

  async function getEventos() {
    try {
      const response = await api.getEventos();
      console.log(response.data.eventos);
      setEventos(response.data.eventos);
    } catch (error) {
      console.log("Erro ", error);
    }
  }

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

  const listEventos = eventos.map((evento) => {
    return (
      <TableRow key={evento.id_organizador}>
        <TableCell align="center">{evento.nome}</TableCell>
        <TableCell align="center">{evento.descricao}</TableCell>
        <TableCell align="center">{evento.data_hora}</TableCell>
        <TableCell align="center">{evento.local}</TableCell>
        <TableCell align="center">
          <IconButton onClick={() => deleteEvento(evento.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  function logout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  useEffect(() => {
    getEventos();
  }, []);

  return (
    <div>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      {eventos.length === 0 ? (
        <p>Carregando eventos</p>
      ) : (
        <div>
          <h5>Lista de Eventos</h5>
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead style={{ backgroundColor: "green", borderStyle: "solid" }}>
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center">Data/Hora</TableCell>
                  <TableCell align="center">Local</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listEventos}</TableBody>
            </Table>
          </TableContainer>
          <Button fullWidth variant="contained" onClick={logout}>
            SAIR
          </Button>
        </div>
      )}
    </div>
  );
}

export default listEventos;
