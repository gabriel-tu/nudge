import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
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
          <Text variant="displayLarge" style={styles.title} testID="loginTitle">
            Login
          </Text>
          <Form>
            <Field
              type="email"
              name="email"
              value={values.email}
              testid="emailField"
            >
              {({}) => (
                <div>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    style={styles.textField}
                  />
                </div>
              )}
            </Field>
            <Field type="password" name="password" testID="passwordField">
              {({}) => (
                <div>
                  <TextInput
                    mode="outlined"
                    label="Password"
                    secureTextEntry={true}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    style={styles.textField}
                  />
                </div>
              )}
            </Field>
            <Field type="submit">
              {({}) => (
                <div>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleSubmit();
                    }}
                    style={styles.buttonContainer}
                  >
                    Login
                  </Button>
                </div>
              )}
            </Field>
            <Field>
              {({}) => (
                <div>
                  <Button mode="outlined" style={styles.buttonContainer}>
                    Signup
                  </Button>
                </div>
              )}
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
    marginBottom: 8,
    width: 300,
  },
  textFieldContainer: {
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 8,
  },
});
