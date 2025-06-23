import React, { useState } from "react";
import AuthForm from "../AuthForm/AuthForm";

// Login Page Component
const Login = ({ onSuccess, loading: parentLoading }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // field-level errors
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async () => {
    if (onSuccess) {
      const result = await onSuccess(formData);
      if (result?.errors) {
        setErrors(result.errors);
      }
    }
  };

  return (
    <AuthForm
      isLogin={true}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading || parentLoading}
      errors={errors}
      showPassword={showPassword}
      togglePassword={() => setShowPassword(!showPassword)}
    />
  );
};


export default Login;
