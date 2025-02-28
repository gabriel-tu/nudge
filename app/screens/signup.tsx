import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { app, auth } from "../services/config";
import { View, StyleSheet, Image } from "react-native";
import {
  Button,
  TextInput,
  Text,
  useTheme,
  Divider,
  HelperText,
} from "react-native-paper";
import * as yup from "yup";

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const theme = useTheme();

  const signUpValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("An email is required"),
    // TODO: Remove when username is connected to accounts
    // username: yup
    //   .string()
    //   .min(3, ({ min }) => `Username must be at least ${min} characters`),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Please enter a password")
      .test(
        "isValidPass",
        "Passowrd must be 6 char (One UpperCase & One Symbol)",
        (value: any, context: any) => {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasSymbole = /["!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]/.test(value);
          let validConditions = 0;
          const numberOfMustBeValidConditions = 3;
          const conditions = [hasUpperCase, hasLowerCase, hasSymbole];
          conditions.forEach((condition) =>
            condition ? validConditions++ : null
          );
          if (validConditions >= numberOfMustBeValidConditions) {
            return true;
          }
          return false;
        }
      ),
    confirmPassword: yup
      .string()
      .required("Please re-enter your password")
      .oneOf([yup.ref("password")], "Does not match password"),
  });
  // TODO: Move firebase functions into another file
  interface signupFirebaseProps {
    values: {
      email: string;
      username?: string;
      password: string;
      confirmPassword: string;
    };
    setFieldError: (field: string, message: string | undefined) => void;
  }

  const signupFirebase = (props: signupFirebaseProps) => {
    createUserWithEmailAndPassword(
      auth,
      props.values.email,
      props.values.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
        // Handle successful sign up + login
        router.push("/screens/welcome");
      })
      .catch((error) => {
        const errorMessage = error.message;
        props.setFieldError("password", errorMessage);
      });
  };

  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={(values, { setFieldError }) =>
        signupFirebase({ values, setFieldError })
      }
      validationSchema={signUpValidationSchema}
      validateOnBlur={false}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleSubmit,
        setFieldTouched,
      }) => (
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.titleImage}
              source={require("../../assets/images/nudge-title.png")}
            />
            <Text style={styles.titleSubText} testID="titleSubText">
              get nudging
            </Text>
          </View>
          <View style={styles.textFieldContainer}>
            <TextInput
              label="Email"
              mode="outlined"
              testID="emailField"
              onChangeText={handleChange("email")}
              error={touched.email && !!errors.email}
              value={values.email}
              style={styles.textFields}
              onBlur={() => setFieldTouched("email", true)}
            />
            <HelperText
              type="error"
              visible={touched.email && errors.email ? true : false}
              testID="emailErrorText"
            >
              {touched.email ? errors.email : undefined}
            </HelperText>
            <TextInput
              label="Username"
              mode="outlined"
              testID="usernameField"
              onChangeText={handleChange("username")}
              disabled={true} //TODO: Remove when username is connected to accounts
              error={touched.username && !!errors.username}
              value={values.username}
              style={styles.textFields}
              onBlur={() => setFieldTouched("username", true)}
            />
            <HelperText
              type="error"
              visible={touched.username && errors.username ? true : false}
              testID="emailErrorText"
            >
              {touched.email ? errors.email : undefined}
            </HelperText>
            <TextInput
              label="Password"
              mode="outlined"
              testID="passwordField"
              onChangeText={handleChange("password")}
              error={touched.password && !!errors.password}
              value={values.password}
              style={styles.textFields}
              secureTextEntry={!passwordVisible}
              onBlur={() => setFieldTouched("password", true)}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  testID="showPasswordButton"
                />
              }
            />
            <HelperText
              type="error"
              visible={touched.password && errors.password ? true : false}
              testID="emailErrorText"
            >
              {touched.password ? errors.password : undefined}
            </HelperText>
            <TextInput
              label="Confirm Your Password"
              mode="outlined"
              secureTextEntry={!passwordVisible}
              testID="confirmPasswordField"
              onChangeText={handleChange("confirmPassword")}
              onBlur={() => setFieldTouched("confirmPassword", true)}
              error={touched.confirmPassword && !!errors.confirmPassword}
              value={values.confirmPassword}
              style={{ width: 300 }}
            />
            <HelperText
              type="error"
              visible={
                touched.confirmPassword && errors.confirmPassword ? true : false
              }
              testID="emailErrorText"
            >
              {touched.confirmPassword ? errors.confirmPassword : undefined}
            </HelperText>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              testID="createAccountButton"
              disabled={
                !!errors.email ||
                !!errors.password ||
                !!errors.confirmPassword ||
                !!errors.username ||
                values.password.length === 0
              }
              onPress={() => handleSubmit()}
              style={{ width: 300 }}
            >
              Create Account
            </Button>
            <View style={styles.loginButtonContainer}>
              <Divider
                style={{ marginTop: 24, marginBottom: 24, width: 288 }}
              />
              <Text style={styles.alreadyHaveAnAccountText}>
                Already have an account?
              </Text>
              <Button
                mode="contained"
                testID="loginButton"
                style={{
                  width: 300,
                  marginTop: 8,
                  backgroundColor: theme.colors.secondary,
                }}
                onPress={() => {
                  router.push("/screens/login");
                }}
              >
                Login
              </Button>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // remove?
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 24,
  },
  textFieldContainer: {
    margin: 24,
  },
  textFields: {
    marginBottom: 16,
    width: 300,
  },
  buttonContainer: {
    marginBottom: 24,
    marginLeft: 24,
    marginRight: 24,
  },
  loginButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  titleImage: {
    height: 60,
    maxWidth: 300,
    resizeMode: "contain",
  },
  titleSubText: {
    marginBottom: 24,
    fontWeight: "bold",
    fontSize: 14,
    userSelect: "none",
  },
  alreadyHaveAnAccountText: {
    color: "#2E4961",
    fontSize: 14,
  },
});
