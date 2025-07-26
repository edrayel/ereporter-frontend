import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { AppDispatch, RootState } from '../../store';
import { registerUser } from '../../store/slices/authSlice';
import { RegisterData } from '../../types/auth';

// Type assertions for Heroicons compatibility
const ShowPasswordIcon = EyeIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const HidePasswordIcon = EyeOffIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['agent', 'supervisor'], 'Invalid role').required('Role is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required(),
});

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'agent' | 'supervisor';
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const registerData: RegisterData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        password: data.password,
        confirmPassword: data.confirmPassword,
        agreeToTerms: data.agreeToTerms,
      };
      await dispatch(registerUser(registerData)).unwrap();
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : error?.message || 'Registration failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100'>
            <span className='text-2xl font-bold text-primary-600'>E</span>
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link to='/login' className='font-medium text-primary-600 hover:text-primary-500'>
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  type='text'
                  autoComplete='given-name'
                  className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  placeholder='First name'
                />
                {errors.firstName && (
                  <p className='mt-1 text-sm text-red-600'>{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  type='text'
                  autoComplete='family-name'
                  className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  placeholder='Last name'
                />
                {errors.lastName && (
                  <p className='mt-1 text-sm text-red-600'>{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <input
                {...register('email')}
                type='email'
                autoComplete='email'
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                placeholder='Enter your email'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                type='tel'
                autoComplete='tel'
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                placeholder='Enter your phone number'
              />
              {errors.phoneNumber && (
                <p className='mt-1 text-sm text-red-600'>{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <select
                {...register('role')}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              >
                <option value=''>Select your role</option>
                <option value='agent'>Agent</option>
                <option value='supervisor'>Supervisor</option>
              </select>
              {errors.role && <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1 relative'>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  placeholder='Create a password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HidePasswordIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <ShowPasswordIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <div className='mt-1 relative'>
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  placeholder='Confirm your password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <HidePasswordIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <ShowPasswordIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            <input
              {...register('agreeToTerms')}
              id='agreeToTerms'
              type='checkbox'
              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
            />
            <label htmlFor='agreeToTerms' className='ml-2 block text-sm text-gray-900'>
              I agree to the{' '}
              <Link to='/terms' className='text-primary-600 hover:text-primary-500'>
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to='/privacy' className='text-primary-600 hover:text-primary-500'>
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className='text-sm text-red-600'>{errors.agreeToTerms.message}</p>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <p className='text-sm text-red-600'>
                {typeof error === 'string'
                  ? error
                  : (error as any)?.message || 'An unexpected error occurred'}
              </p>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? <div className='spinner h-4 w-4 mr-2' /> : null}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
