import { Formik } from "formik";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import * as yup from "yup";

const LoginScreen = () => {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("An email is required"),
    password: yup
      .string()
      .min(6, ({ min }) => "Password must be at least ${min} characters")
      .required("Please enter a password"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => console.log(values)} // TODO: replace with login logic
    >
      {({ handleChange, handleSubmit, values }) => (
        <View style={styles.container}>
          <Text variant="displayLarge" style={styles.title} testID="loginTitle">
            Login
          </Text>
          <View style={styles.textFieldContainer}>
            <TextInput
              label="Email"
              testID="emailField"
              onChangeText={handleChange("email")}
              value={values.email}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Password"
              testID="passwordField"
              onChangeText={handleChange("password")}
              value={values.password}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit;
              }}
              style={{ marginBottom: 16, width: 300 }}
            >
              Login
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                /* TODO: navigate to signup screen*/
              }}
            >
              Signup
            </Button>
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
    padding: 24,
  },
  buttonContainer: {
    padding: 24,
  },
});
