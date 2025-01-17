import CommonForm from "@/components/common/form";
import * as Yup from 'yup';
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
    userName : '',
    email : '',
    password : ''
};

const validationSchema = Yup.object({
    userName: Yup.string().required('User name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
  });

function AuthRegister() {

    const [formData,setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const{toast} = useToast();
    
    const onSubmit = async (event) => {
        event.preventDefault();
        
        try {
          await validationSchema.validate(formData);
        } catch (error) {
          return toast({
            title: error.message,
            variant: 'destructive',
          });
        }
      
        try {
          const data = await dispatch(registerUser(formData));
      
          if (data?.payload?.success) {
            toast({
              title: data?.payload?.message,
              style: {
                backgroundColor: '#28a745',
                color: 'white',
              },
            });
            navigate('/auth/login');
          } else {
            toast({
              title: data?.payload?.message,
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error during registration:', error);
          toast({
            title: 'Registration failed. Please try again.',
            variant: 'destructive',
          });
        }
      };
      

    console.log(formData);

    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight tetx-foreground">Create New Account</h1>
                <p className="mt-2">Already have an account?
                    <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>Login</Link>
                </p>
            </div>
            <CommonForm 
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthRegister;