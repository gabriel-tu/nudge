import { connectAuthEmulator } from "firebase/auth";
import { Formik } from "formik";
import { View, StyleSheet, Image } from "react-native";
import { Button, TextInput, Text, useTheme, Divider } from "react-native-paper";
import * as yup from "yup";

const LoginScreen = () => {
  const theme = useTheme();

  const signUpValidationSchema = yup.object().shape({
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
      initialValues={{
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={(values) => console.log(values)} // TODO: replace with login logic
      validationSchema={signUpValidationSchema}
    >
      {({ handleChange, handleSubmit, values }) => (
        <View style={styles.container}>
          <Image
            style={styles.titleImage}
            source={require("../../assets/images/nudge-title.png")}
          />
          <View style={styles.textFieldContainer}>
            <TextInput
              label="Email"
              testID="emailField"
              onChangeText={handleChange("email")}
              value={values.email}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Username"
              testID="usernameField"
              onChangeText={handleChange("username")}
              value={values.username}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Password"
              testID="passwordField"
              onChangeText={handleChange("password")}
              value={values.password}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Confirm Your Passwrd"
              testID="confirmPasswordField"
              onChangeText={handleChange("confirmPassword")}
              value={values.confirmPassword}
              style={{ marginBottom: 16, width: 300 }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit;
              }}
              style={{ marginBottom: 8, width: 300 }}
            >
              Create Account
            </Button>
            <View style={styles.loginButtonContainer}>
              <Divider style={{ margin: 8, width: 288 }} />
              <Text>Already have an account?</Text>
              <Button
                mode="contained"
                style={{
                  width: 300,
                  marginTop: 8,
                  backgroundColor: theme.colors.secondary,
                }}
                onPress={() => {
                  /* TODO: navigate to login screen*/
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
    padding: 24,
  },
  buttonContainer: {
    padding: 24,
  },
  loginButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  titleImage: {
    marginBottom: 24,
    width: "40%",
    maxWidth: 300,
    resizeMode: "contain",
  },
});
