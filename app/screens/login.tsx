import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import * as yup from "yup";
import { app } from "../services/config";

const LoginScreen = () => {
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
        handleChange,
        handleSubmit,
        handleBlur,
        values,
      }) => (
        <View style={styles.container}>
          <Text variant="displayLarge" style={styles.title} testID="loginTitle">
            Login
          </Text>
          <Form>
            <Field
              as={TextInput}
              id="email"
              mode="outlined"
              label="Email"
              type="email"
              name="email"
              value={values.email}
              onChangeText={handleChange("email")}
              error={touched.email === true && errors.email ? errors.email : ""}
              style={styles.textField}
              testID="emailField"
            />
            <HelperText
              type="error"
              visible={touched.email === true && errors.email ? true : false}
              testID="emailErrorText"
            >
              {errors.email}
            </HelperText>
            <Field
              as={TextInput}
              id="password"
              mode="outlined"
              label="Password"
              type="password"
              name="password"
              secureTextEntry={true}
              values={values.password}
              onChangeText={handleChange("password")}
              error={
                touched.password === true && errors.password
                  ? errors.password
                  : ""
              }
              style={styles.textField}
              testID="passwordField"
            />
            <HelperText
              type="error"
              visible={
                touched.password === true && errors.password ? true : false
              }
              testID="passwordErrorText"
            >
              {errors.password}
            </HelperText>
            <Field
              as={Button}
              id="loginbutton"
              mode="contained"
              type="submit"
              name="login"
              disabled={errors.email || values.password.length === 0}
              onPress={() => {
                handleSubmit();
              }}
              onBlur={handleBlur("login")}
              style={styles.buttonContainer}
              testID="loginButton"
            >
              Login
            </Field>
            <Field
              as={Button}
              id="signupbutton"
              mode="outlined"
              name="signup"
              onBlur={handleBlur("signup")}
              style={styles.buttonContainer}
              testID="signupButton"
            >
              Signup
            </Field>
          </Form>
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
    marginBottom: 8,
  },
});
