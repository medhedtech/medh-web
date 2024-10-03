import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import usePostQuery from '@/hooks/postQuery.hook';
import { apiUrls } from '@/apis';

const schema = yup
  .object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email().required('Email is required'),
    phone_number: yup
      .string()
      .min(10, 'At least 10 digits required')
      .max(10, 'must be at most 10 characters')
      .required('Phone number is required'),
    password: yup
      .string()
      .min(8, 'At least 8 character required')
      .required('Password is required'),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  })
  .required();

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { postQuery, loading } = usePostQuery();

  const onSubmit = async (data) => {
    const { confirm_password, ...rest } = data;
    await postQuery({
      url: apiUrls.register,
      onSuccess: (res) => {
        console.log(res);
      },
      onFail: (error) => {
        console.log(error);
      },
      postData: rest,
    });
  };

  return (
    <div className="transition-opacity duration-150 ease-linear">
      {/* heading   */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Sing Up
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          Already have an account?
          <a
            href="login.html"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Log In
          </a>
        </p>
      </div>

      <form
        className="pt-25px"
        data-aos="fade-up"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              First Name
            </label>
            <input
              {...register('first_name')}
              type="text"
              placeholder="First Name"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.first_name && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.first_name?.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Last Name
            </label>
            <input
              {...register('last_name')}
              type="text"
              placeholder="Last Name"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.last_name && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.last_name?.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Phone Number
            </label>
            <input
              {...register('phone_number')}
              type="text"
              placeholder="Phone number"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.phone_number?.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="Your Email"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.password && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.password?.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Re-Enter Password
            </label>
            <input
              {...register('confirm_password')}
              type="password"
              placeholder="Re-Enter Password"
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-500 font-normal mt-1">
                {errors.confirm_password?.message}
              </p>
            )}
          </div>
        </div>

        <div className="text-contentColor dark:text-contentColor-dark flex items-center">
          <input
            type="checkbox"
            id="accept-pp"
            className="w-18px h-18px mr-2 block box-content"
          />
          <label htmlFor="accept-pp">Accept the Terms and Privacy Policy</label>
        </div>
        <div className="mt-25px text-center">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
