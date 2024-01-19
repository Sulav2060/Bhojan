import React, { useState } from 'react'
import avater from '../assets/default.jpg'
import profilepic from '../assets/profilepic.jpg'
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
  const { register, handleSubmit,formState } = useForm();
  const params = useParams();
  const navigate=useNavigate();
  const [error, setError] = useState('');
  // const [userUpload,setUserUpload]=useState(avater);
  const registerUser = async ({ name, address, contactno, profilepic }) => {
    // console.log("name, address, contactno, profilepic", name, address, contactno, profilepic);
    console.log("registerUser function called");
    try {
      const formData = new FormData();
      formData.append('userId', params.userId);
      formData.append('name', name);
      if (!profilepic || !profilepic[0]) {
        formData.append('avatar', avater); // Provide the default image
      } else {
        formData.append('avatar', profilepic[0]);
      }      formData.append('address', address);
      formData.append('contact', contactno);
      formData.append('isOrganization', true);

      const response = await axios.post('http://localhost:9005/api/v1/users/complete-registration', formData,
      {
        withCredentials: true, // Include credentials (cookies) in the request
      });
      
      console.log(response);
      setError('');
      console.log(response.data.data.isDonor);
      if (response.data.data.isDonor)
      {
        navigate('/donor');
      }
      else {
        navigate('/volunteer');
      }

    } catch (error) {
      console.log("Error:",error);
      // console.log("Error message:", error.response.data.message);
      // setError(error.response.data.message);
    }

  };





  const resetError = () => {
    // Reset the error state
    setError('');
  };

  const onSubmit = async (data) => {
    console.log("At first step");
    // Check if there's an error before calling registerUser
    if (formState.isValid) {   //what does .isValid do??
      resetError();
      try {
        await handleSubmit(registerUser)(data);
      } catch (error) {
        // Handle any errors here
        console.error("Form submission error:", error);
      }
    }
  };
  

  





  return (
    <div className="flex justify-center items-center h-screen bg-[#f8c9c9]">
      <div className="w-[20rem] md:w-[30rem] p-7 h-auto md:h-auto md:p-20 shadow-xl bg-white rounded-3xl">

        <h1 className="text-center text-3xl font-semibold ">Register to Khana</h1>
        <hr className="border w-full h-1 bg-black my-4" />
        <form action=""  onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            resetError();
            handleSubmit(onSubmit)(e);
          }}>
          <div>
            <img
            //  src={userUpload}
            src={profilepic}
              alt="profilepic" id="profilepic" className="w-40 h-40 mx-auto rounded-full  " />
            <label for="image" className="block align-middle select-none font-sans font-bold items-center mx-auto text-center uppercase transition-all  pt-2 disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-full  h-8 w-44 cursor-pointer"
            >Upload Image</label>



            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              id="image"
              // name="image" 
              className="hidden"
              onChange={(e)=>{
                console.log(e.target.value);
                // setUserUpload(e.target.value)
              }}
              {...register('profilepic', {
                validate: {
                  validFileFormat: (value) => {
                    // Custom validation logic for file format
                    if (value && value.length > 0) {
                      const allowedFormats = ['jpg', 'jpeg', 'png'];
                      const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                      return allowedFormats.includes(fileExtension) || 'Invalid file format';
                    }
                    return true; // No file provided, so no validation needed
                  },
                  maxFileSize: (value) => {
                    // Custom validation logic for file size (in bytes)
                    if (value && value.length > 0) {
                      const maxSize = 1024 * 1024 * 5; // 5 MB
                      return value[0]?.size <= maxSize || 'File size exceeds the limit (5 MB)';
                    }
                    return true; // No file provided, so no validation needed
                  },
                },
              })}
            />
          </div>
          <div>
            <label for="username" className="font-normal text-sm ml-2">Username:</label>

            <input
              type="text"
              value={params.username}
              readOnly
              className="border-2 w-full h-10 px-2 pl-2  border-[#01cc65]  mb-1 rounded-xl  p-2 text-sm focus:outline-none focus:ring-0  focus:border-gray-300 focus:text-gray-900 focus:border-4"
              id="username" />
          </div>

          <div>
            <label for="email" className="font-normal text-sm ml-2">Email:</label>

            <input type=""
              value={params.email}
              readOnly
              className="border-2 w-full h-10 px-2 pl-2  border-[#01cc65]  mb-1 rounded-xl  p-2 text-sm focus:outline-none focus:ring-0  focus:border-gray-300 focus:text-gray-900 focus:border-4"
              id="username" required />
          </div>

          <div>
            <label for="name" className="font-normal text-sm ml-2"> Name:</label>

            <input type="text"
              className="border-2 w-full h-10 px-2 pl-2  border-[#01cc65]  mb-1 rounded-xl  p-2 text-sm focus:outline-none focus:ring-0  focus:border-gray-300 focus:text-gray-900 focus:border-4"
              id="name " name="name" placeholder="Enter your Name" required
              {...register('name', {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[A-Z][a-zA-Z ]*$/.test(value) || setError("Name should start with capital and shouldn't contain any special characters")
                }
              })}
            />

          </div>

          <div>
            <label for="address" className="font-normal text-sm ml-2">Address:</label>
            <input type="text"
              className="border-2 w-full h-10 px-2 pl-2  border-[#01cc65] mb-1 rounded-xl p-2 text-sm focus:outline-none focus:ring-0  focus:border-gray-300 focus:text-gray-900 focus:border-4"
              id="address" placeholder="Enter your Address" required
              {...register('address', {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[a-zA-Z0-9 ,.-]*$/.test(value) || setError("Address should be valid")
                }
              })}
            />
          </div>

          <div>
            <label for="contno" className="font-normal text-sm ml-2"> Contact Number:</label>
            <input type="number"
              className="border-2 w-full h-10 px-2 pl-2 border-[#01cc65] mb-1 rounded-xl focus:outline-none focus:ring-0  focus:border-gray-300 focus:text-gray-900 focus:border-4 p-2 text-sm"
              id="contactno" placeholder="Enter your Contact No" required
              {...register('contactno', {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^9\d{9}$/.test(value) || setError("Please enter a valid phone number")
                }
              })}
            />
          </div>






          <div>
            <button
              type="submit"
              value="Register"
              className="align-middle select-none font-sans font-bold  text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-full  h-10 w-full mt-6 cursor-pointer" >
              Register</button>

          </div>
        </form>




      </div>
      <div>
        Error:{error}
      </div>


    </div>
  )
}
export default Register