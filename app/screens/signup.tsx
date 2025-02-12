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
      {({
        errors,
        touched,
        handleChange,
        handleSubmit,
        handleBlur,
        values,
      }) => (
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={styles.titleImage}
              source={require("../../assets/images/nudge-title.png")}
            />
            <Text style={styles.titleSubText}>get nudging</Text>
          </View>
          <View style={styles.textFieldContainer}>
            <TextInput
              label="Email"
              mode="outlined"
              testID="emailField"
              onChangeText={handleChange("email")}
              value={values.email}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Username"
              mode="outlined"
              testID="usernameField"
              onChangeText={handleChange("username")}
              value={values.username}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Password"
              mode="outlined"
              testID="passwordField"
              onChangeText={handleChange("password")}
              value={values.password}
              style={{ marginBottom: 16, width: 300 }}
            />
            <TextInput
              label="Confirm Your Passwrd"
              mode="outlined"
              testID="confirmPasswordField"
              onChangeText={handleChange("confirmPassword")}
              value={values.confirmPassword}
              style={{ width: 300 }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit;
              }}
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
    margin: 24,
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
    height: 60, //TODO: have another value for smaller screens
    maxWidth: 300,
    resizeMode: "contain",
  },
  titleSubText: {
    marginBottom: 24,
    fontWeight: "bold",
    fontSize: 14,
  },
  alreadyHaveAnAccountText: {
    color: "#2E4961",
    fontSize: 14,
  },
});
