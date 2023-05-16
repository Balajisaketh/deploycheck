import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import {faGoogleLogo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FcGoogle } from 'react-icons/fa';
function Home() {
  const[email,setEmail]=useState(""); 
	const[passw,setPassw]=useState("");
  const[regdata,setregdata]=useState()
  const handlelogin=(e)=>
  {
    e.preventDefault()
    console.log("hi")
    
    console.log("i m db",email,passw);
     const body={
      "email": email,
      "password": passw
     }
       axios.post("http://localhost:3001/login",body).then((response)=>
       {
        console.log(response,"i am response");
           if(response.status='success')
           {

             console.log(response.data.token,"success");
             localStorage.setItem("token",response.data.token);
           }
           else{
                 console.log("error ")
           }
       }).catch ((error)=>
       {
          console.log(error,"i m error: ")
       })
  }
  const handleRegister=(e)=>
  {
    e.preventDefault()
    console.log("i m db",email,passw);
     const body={
      "email": email,
      "password": passw
     }
       axios.post("http://localhost:3001/register",body).then((response)=>
       {
            console.log(response,"success");
            
            
       }).catch ((error)=>
       {
          console.log(error,"i m error: ")
       })      
  }
    return (
    
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
            <label htmlFor="email" className="block text-sm  text-left font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e)=>setEmail(e.target.value)}  />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               onChange={(e)=>setPassw(e.target.value)} />
              </div>
            </div>

            <div className='flex space-x-10'>
              <button
                type="submit"
                className="flex w-40 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             onClick={(e)=>handleRegister(e)} >
                Regsiter
              </button>
              <button
                type="submit"
                className="flex w-40 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             onClick={(e)=>handlelogin(e)}>
                Login
              </button>
            </div>
 </form>
        </div>
      </div>
    </>
  )
}

   

  

export default Home