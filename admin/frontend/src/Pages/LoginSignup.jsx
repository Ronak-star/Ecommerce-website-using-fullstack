import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",   // FIX: "passoword" typo fixed
    email: ""
  })

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const login = async () => {
    console.log("Login Function Executed", formData);

    try {
      const response = await fetch('https://ecommerce-website-using-fullstack-lwrn.onrender.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        alert("Login Successful!");
        window.location.replace("/");  // Home page pe redirect
      } else {
        alert(data.errors || "Login failed. Please try again.");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Server se connect nahi ho pa raha. Please try again.");
    }
  }

  const signup = async () => {
    console.log("Signup Function Executed", formData);

    try {
      const response = await fetch('https://ecommerce-website-using-fullstack-lwrn.onrender.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        alert("Account created successfully!");
        window.location.replace("/");  // Home page pe redirect
      } else {
        alert(data.errors || "Signup failed. Please try again.");
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("Server se connect nahi ho pa raha. Please try again.");
    }
  }

  return (

    <div className='loginsignup'>

      <div className='loginsignup-container'>

        <h1>{state}</h1>

        <div className='loginsignup-fields'>

          {state === "Sign Up"
            ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />
            : <></>
          }

          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />

          {/* FIX: value={formData.password} — typo fix */}
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />

        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

        {state === "Sign Up"
          ? <p className="loginsignup-login">
              Already have an account? <span onClick={() => { setState("Login") }}>Login here</span>
            </p>
          : <p className="loginsignup-login">
              Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span>
            </p>
        }

        <div className='loginsignup-agree'>
          <input type="checkbox" name='' id='' />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

      </div>

    </div>
  )
}

export default LoginSignup
