import { Button, Text, TextInput } from "@react-native-material/core";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";
import { app } from "../services/config";

const LoginScreen = () => {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("An email is required"),
    password: yup
      .string()
      // .min(6, ({ min }) => "Password must be at least ${min} characters")
      .required("Please enter a password"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => {
        console.log("on submit");
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }} // TODO: display error logic to user
    >
      {({ handleChange, handleSubmit, values }) => (
        <View style={styles.container}>
          <Text variant="h1" style={styles.title} testID="loginTitle">
            Login
          </Text>
          <Form style={styles.textFieldContainer}>
            <Field
              type="email"
              name="email"
              value={values.email}
              testid="emailField"
            >
              {({}) => (
                <div>
                  <TextInput
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    onChangeText={handleChange("email")}
                  />
                </div>
              )}
            </Field>
            <Field
              type="password"
              name="password"
              testid="passwordField"
              style={styles.textField}
            >
              {({}) => (
                <div>
                  <TextInput
                    label="Password"
                    variant="outlined"
                    secureTextEntry={true}
                    value={values.password}
                    onChangeText={handleChange("password")}
                  />
                </div>
              )}
            </Field>
            <Field type="submit">
              {({}) => (
                <div>
                  <Button
                    title="Login"
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </div>
              )}
            </Field>
            <Field>
              {({}) => (
                <div>
                  <Button title="Signup"></Button>
                </div>
              )}
            </Field>
          </Form>
          <View style={styles.buttonContainer}></View>
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    width: 300,
  },
  textFieldContainer: {
    padding: 24,
  },
  buttonContainer: {
    padding: 24,
  },
});
