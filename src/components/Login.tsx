import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "../redux/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

const Login: React.FC = () => {
  const navigate = useNavigate(); // Navigate to different routes.
  const dispatch = useDispatch(); // Dispatch actions to Redux store.

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // Submit handler
  const handleSubmit = async (
    values: { username: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ username: string; password: string }>
  ) => {
    try {
      // Send a POST request to the backend API with form values
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }
      // Parse the JSON response to extract tokens
      const data = await response.json();
      // Dispatch the tokens to the Redux store
      dispatch(setTokens({ access: data.access, refresh: data.refresh }));
      toast.success("Login successful!");
      // Navigate to the dashboard route after successful login
      navigate("/dashboard");
      resetForm();
    } catch (err) {
      // Handle errors during login process
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      // Ensure the submitting state is reset regardless of success or failure
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1e2a47] text-yellow-100 p-auto w-full">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-full w-1/2 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 w-1/2 mx-auto">
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg font-semibold text-yellow-100"
                >
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-3 mt-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-semibold text-yellow-100"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 mt-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-4 bg-purple-400 text-yellow-100 rounded-lg hover:bg-purple-700 transition"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
