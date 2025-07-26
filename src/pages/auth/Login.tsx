import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { AppDispatch, RootState } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { LoginCredentials } from '../../types/auth';

// Type assertions for Heroicons compatibility
const ShowPasswordIcon = EyeIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const HidePasswordIcon = EyeOffIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Login successful!');

      // Redirect to intended page or dashboard
      const from = (location.state as any)?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
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
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link to='/register' className='font-medium text-primary-600 hover:text-primary-500'>
              create a new account
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <input
                {...register('email')}
                type='email'
                autoComplete='email'
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm'
                placeholder='Enter your email'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1 relative'>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  className='appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm'
                  placeholder='Enter your password'
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
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <Link
                to='/forgot-password'
                className='font-medium text-primary-600 hover:text-primary-500'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
