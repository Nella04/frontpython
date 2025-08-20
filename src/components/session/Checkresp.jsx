import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, Slide } from "@mui/material";

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

export default function CheckResp() {
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackColor, setSnackColor] = useState("error");

  useEffect(() => {
    const userlocal = localStorage.getItem("userlocal");

    if (!userlocal) {
      setSnackMessage("Utilisateur non connecté !");
      setSnackColor("error");
      setOpenSnack(true);
      setTimeout(() => navigate("/responsable/connexion"), 2500);
      return;
    }

    try {
      const userParsed = JSON.parse(userlocal);
      if (userParsed.rolelocal !== "responsable") {
        setSnackMessage("Accès réservé aux responsables !");
        setSnackColor("warning");
        setOpenSnack(true);
        setTimeout(() => navigate("/responsable/connexion"), 2500);
      }
    } catch (error) {
      console.error("Erreur de parsing localStorage :", error);
      setSnackMessage("veillez connecter en tant que responsable !");
      setSnackColor("error");
      setOpenSnack(true);
      setTimeout(() => navigate("/responsable/connexion"), 2500);
    }
  }, [navigate]);

  return (
    <Snackbar
      open={openSnack}
      autoHideDuration={2500}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={snackColor}
        variant="filled"
        sx={{
          bgcolor:
            snackColor === "error"
              ? "red"
              : snackColor === "warning"
              ? "#FFD700"
              : "#FFF8DC",
          color: snackColor === "warning" ? "#28a4d9ff" : "white",
          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
        }}
      >
        {snackMessage}
      </Alert>
    </Snackbar>
  );
}
