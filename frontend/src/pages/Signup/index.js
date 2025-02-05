import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import usePlans from '../../hooks/usePlans';
import { i18n } from "../../translate/i18n";
import { FormControl } from "@material-ui/core";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BusinessIcon from "@material-ui/icons/Business";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import PhoneIcon from "@material-ui/icons/Phone";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const UserSchema = Yup.object().shape({
  name: Yup.string().min(2, "Muito curto!").max(50, "Muito longo!").required("Obrigatório"),
  companyName: Yup.string().min(2, "Muito curto!").max(50, "Muito longo!").required("Obrigatório"),
  password: Yup.string().min(5, "Muito curto!").max(50, "Muito longo!"),
  email: Yup.string().email("E-mail inválido").required("Obrigatório"),
  phone: Yup.string().required("Obrigatório"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  imageSide: {
    flex: 1,
    background: `url('https://i.ibb.co/0JfX4b6/Navy-Blue-and-Pink-Modern-Tips-for-Financial-Success-Instagram-Post.png') no-repeat center center`,
    backgroundSize: "cover",
    height: "100%",
  },
  formSide: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    [theme.breakpoints.down("sm")]: {
      padding: "20px",
    },
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "30px",
  },
  logoImg: {
    display: "block",
    margin: "0 auto 20px",
    maxWidth: "150px",
    height: "auto",
  },
  submitBtn: {
    marginTop: "20px",
    backgroundColor: "#350A64",  // Cor alterada para #350A64
    color: "#fff",
    borderRadius: "8px",
    padding: "12px",
    fontWeight: "bold",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#31095a",  // Cor de hover ajustada para uma tonalidade mais escura
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
    "&:disabled": {
      backgroundColor: "#ddd",
      cursor: "not-allowed",
    },
  },
  loginBtn: {
    marginTop: "10px",
    backgroundColor: "#4F0F96",  // Cor alterada para #4F0F96
    color: "#fff",  // Cor do texto ajustada para branco
    borderRadius: "8px",
    padding: "12px",
    fontWeight: "normal", // Fonte mais leve
    width: "100%", // O mesmo tamanho do botão "Cadastrar"
    cursor: "pointer",
    border: "2px solid transparent", // Borda invisível
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(79, 15, 150, 0.8)", // Cor de hover ajustada para um tom mais claro
      color: "#fff", // Mantém a cor branca no hover
      borderColor: "#4F0F96", // Cor da borda ajustada
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
    textDecoration: "none", // Remover o sublinhado
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const { getPlanList } = usePlans();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let companyId = null;
  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { name: "", email: "", password: "", phone: "", companyId, companyName: "", planId: "" };
  const [user] = useState(initialState);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const planList = await getPlanList({ listPublic: "false" });
      setPlans(planList);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSignUp = async (values) => {
    try {
      await openApi.post("/auth/signup", values);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.imageSide}></div>
      <div className={classes.formSide}>
        <form className={classes.formContainer} onSubmit={handleSignUp}>
          <img src="/logo.png" alt="Logo" className={classes.logoImg} />
          <Formik
            initialValues={user}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSignUp(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="companyName"
                      label="Nome da Empresa"
                      error={touched.companyName && Boolean(errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                      name="companyName"
                      autoComplete="companyName"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      autoComplete="name"
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      fullWidth
                      id="name"
                      label="Nome"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="E-mail"
                      name="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                      inputProps={{ style: { textTransform: 'lowercase' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      name="password"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      label="Senha"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="phone"
                      label="Telefone"
                      name="phone"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      autoComplete="phone"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="plan">Plano</InputLabel>
                      <Field
                        as={Select}
                        labelId="plan"
                        id="plan"
                        name="planId"
                        label="Plano"
                      >
                        {plans.map((plan) => (
                          <MenuItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      className={classes.submitBtn}
                    >
                      {isSubmitting ? "Enviando..." : "Cadastrar"}
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        className={classes.loginBtn}
                      >
                        Já tem uma conta? Faça o login
                      </Button>
                    </RouterLink>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
