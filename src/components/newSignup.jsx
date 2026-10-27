import React,{useState,useEffect} from "react";
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useNavigate,Link } from "react-router-dom";
import { User, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';

import Navbar from "./Navbar";

const signupValidateSchema=Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .min(2,'First name must be at least 2chars')
        .max(30,"Only 30 chars allowed")
        .matches(/^[a-zA-Z\s]+$/,'Only letters allowed')
        .required('First name is required'),
    lastName: Yup.string()
        .trim()
        .min(2,'Must be at least 2 chars')
        .max(30,'Only 30 chars allowed')
        .matches(/^[a-zA-Z\s]+$/,'Only letters allowed')
        .required('Last name is required'),
    email: Yup.string()
        .trim()
        .email('please enter valid email')
        .required('Email is required'),
    password:Yup.string()
        .min(8,'Password must 8 chars')
        .matches(/[A-Za-z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'),null],'Passwords dont match')
        .required('Please confirm password'),
        agreeTerms: Yup.boolean()
        .oneOf([Yup.ref('password'),null],'Passwords dont match')
        .required('Password oauthorixed'
        )
    })

    function Signup(){
        const navigate=useNavigate();
        const [showPassword,setShowPassword]=useState(false);
        const [showConfirmPassword,setshowConfirmPassword]=useState(false)
        const [currentUser,setCurrentUser]=useState('');
        const [successMessage,setSuccessMessage]=useState('');
   
        useEffect(()=>{
            try {
                const stored=localStorage.getItem('current_user');
                if(stored){
                    setCurrentUser(JSON.parse(stored))
                }
            } catch (e) {
                console.error(e);
            }
        },[]);

        const handleLogout=()=>{
            localStorage.removeItem('current_user');
            setCurrentUser(null);
            setSuccessMessage('');
            window.dispatchEvent(new Event('authchange'));
        }

        const handleSubmit=(values,{setSubmitting,resetForm})=>{
            const userData={
                id:Date.now().toString(),
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim().toLowerCase(),
                registeredAt:new Date().toLocaleDateString('en-IN',{
                    year:'numeric',
                    month:'short',
                    day:'numeric',
                    hour:'2-digit',
                    minute:'2-digit'
                })
            };

            try{
                localStorage.setItem('current_user',JSON.stringify(userData));
                const existingList=JSON.parse(localStorage.getItem('all_registered_users')||'[]');
                const filtered=existingList.filter(u=>u.email!==userData.email);
                filtered.push(userData);
                localStorage.setItem('all_registered_users',JSON.stringify(filtered));

                setCurrentUser(userData);
                setSuccessMessage(`Account created Successfully, welcome ${userData.firstName}`)
                window.dispatchEvent(new Event('authChange'));
                resetForm();
            }catch(err){
                console.error("Storage error:",err);
            }finally{
                setSubmitting(false);
            }
        };

        return(
            <Formik initialValues={{
                firstName:'',
                lastName:'',
                email:'',
                password:'',
                confirmPassword:'',
                agreeTerms:false
            }}
            validationSchema={signupValidateSchema}
            onSubmit={handleSubmit}
            >
               {({isSubmitting,errors,touched})=>(
                <Form className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold">
                                First Name
                            </label>
                            <div className="relative">
                                <Field 
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    
                                />
                            </div>
                            <ErrorMessage name="firstName" component="div" className="text-red-500"></ErrorMessage>
                        </div>

                        <div>
                            <label className="block text-xs">Last Name</label>
                            <Field 
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="RAJ"
                                
                            />
                            <ErrorMessage name="lastName" component="div" className="text-red-500"/>
                        </div>

                        <div>
                            <label className="block text-xs">Email Address</label>
                            <div className="relative">
                                <Field 
                                 id="email"
                                 name="email"
                                 type="email"
                                 placeholder="azim@huptechweb.com"
                                />
                                <Mail className="w-4 h-4 text-slate-400"> </Mail>
                            </div>
                            <ErrorMessage name="email" component="div" className="text-red-500"></ErrorMessage>
                        </div>

                        <div>
                            <label className="block text-xs">Password</label>
                            <div className="relative">
                                <Field 
                                 id="password"
                                 name="password"
                                 type={showPassword?'text':'password'}
                                 placeholder="Min 6 char pass"

                                />
                                <button 
                                type="button"
                                tabIndex={-1}
                                onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            <ErrorMessage name="password" component="div" className="text-red-500" />
                        </div>
                    </div>
                </Form>
               )} 
            </Formik>
        )
    }