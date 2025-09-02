import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [errors, setErrors] = useState(false);
  const { navigate, setToken, token, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginInputData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let schema;
      let newURL = backendUrl;

      if (currState === "Sign Up") {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message);
        }

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message);
        }

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary-500 to-accent-500"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-secondary-400 to-primary-400"></div>
      </div>

  <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-[#f15feb]/15 to-primary-50/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-primary-100">
        <div className="text-center">
          {/* Segmented toggle */}
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl mb-3 shadow-inner">
            <button
              type="button"
              onClick={() => setCurrState("Login")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${currState === 'Login' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setCurrState("Sign Up")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${currState === 'Sign Up' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sign Up
            </button>
          </div>

          <h1 className='font-display text-3xl text-gray-900'>{currState}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currState === "Login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 text-gray-600 font-arial'>
          {currState === "Sign Up" && (
            <div className="mb-1">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                name='name'
                type='text'
                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-colors'
                placeholder='Full Name'
              />
              {errors.name && (
                <p className='text-accent text-start text-xs font-semibold mt-1'>
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="mb-1">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name='email'
              type='email'
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-colors'
              placeholder='Email Address'
            />
            {errors.email && (
              <p className='text-accent text-xs text-start font-semibold mt-1'>
                {errors.email}
              </p>
            )}
          </div>
          
          <div className="mb-1">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name='password'
              type='password'
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-colors'
              placeholder='Password'
            />
            {errors.password && (
              <p className='text-accent text-xs text-start font-semibold mt-1'>
                {errors.password}
              </p>
            )}
          </div>

          <div className='w-full flex justify-between text-sm my-2'>
            <p className='cursor-pointer text-secondary hover:text-secondary-dark transition-colors'>Forgot your password?</p>
            {currState === "Sign Up" ? (
              <p onClick={() => setCurrState("Login")} className='cursor-pointer text-primary hover:text-primary-dark transition-colors'>
                Login here
              </p>
            ) : (
              <p onClick={() => setCurrState("Sign Up")} className='cursor-pointer text-primary hover:text-primary-dark transition-colors'>
                Create account
              </p>
            )}
          </div>

          <button className='btn btn-gradient-primary btn-large w-full mt-2'>
            {currState === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </form>
        {/* Divider */}
        <div className="divider"><span>or</span></div>

        {/* Subtext */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {currState === "Login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")} 
                  className="text-primary cursor-pointer hover:underline">
              {currState === "Login" ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
