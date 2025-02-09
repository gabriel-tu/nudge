import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import * as yup from "yup";
import { app } from "../services/config";

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const updatePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("An email is required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      validateOnBlur={false}
      onSubmit={(values, errors) => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            const user = userCredential.user;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            errors.setFieldError("password", errorMessage);
          });
      }}
    >
      {({
        errors,
        touched,
        values,
        handleChange,
        handleSubmit,
        setFieldTouched,
      }) => (
        <View style={styles.container}>
          <Text variant="displayLarge" style={styles.title} testID="loginTitle">
            Login
          </Text>
          <View>
            <TextInput
              id="email"
              mode="outlined"
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              error={touched.email && !!errors.email}
              onBlur={() => setFieldTouched("email", true)}
              style={styles.textField}
              testID="emailField"
            />
            <HelperText
              type="error"
              visible={touched.email && errors.email ? true : false}
              testID="emailErrorText"
            >
              {touched.email ? errors.email : undefined}
            </HelperText>
            <TextInput
              id="password"
              mode="outlined"
              label="Password"
              secureTextEntry={!passwordVisible}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={updatePasswordVisibility}
                  testID="showPasswordButton"
                />
              }
              value={values.password}
              onChangeText={handleChange("password")}
              error={touched.password && !!errors.password}
              onBlur={() => setFieldTouched("password", true)}
              style={styles.textField}
              testID="passwordField"
            />
            <HelperText
              type="error"
              visible={touched.password && errors.password ? true : false}
              testID="passwordErrorText"
            >
              {touched.password ? errors.password : undefined}
            </HelperText>
          </View>
          <Button
            id="loginbutton"
            mode="contained"
            disabled={!!errors.email || values.password.length === 0}
            onPress={() => handleSubmit()}
            style={styles.buttonContainer}
            testID="loginButton"
          >
            Login
          </Button>
          <Button
            id="signupbutton"
            mode="outlined"
            style={styles.buttonContainer}
            testID="signupButton"
          >
            Signup
          </Button>
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
  textField: {
    width: 300,
  },
  textFieldContainer: {
    padding: 24,
  },
  buttonContainer: {
    width: 100,
    marginBottom: 8,
  },
});
