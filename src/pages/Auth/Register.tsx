import { SiSalla } from "react-icons/si";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiGithub } from "react-icons/fi";
import { TbBrandGoogle } from "react-icons/tb";
import REGISTER_DATA from "../../data";
import Input from "../../components/ui/Input";
import ErrorMsg from "../../components/error/ErrorMsg";
import { useAuthStore } from "../../store/useAuthStore";
import { registerSchema } from "../../validations";
import { Link } from "react-router";

interface IFormInput {
  userName: string;
  email: string;
  password: string;
}
export function Register() {
  const { signUp, isLoading, signUpWithGoogle, signUpWithGithub } =
    useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) =>
    await signUp(data);

  //! Render
  const renderInputs = REGISTER_DATA.map((input) => (
    <div key={input.name} className="flex flex-col space-y-1.5 mb-2">
      <label
        htmlFor={input.name}
        className="text-sm text-neutral-700 dark:text-neutral-300"
      >
        {input.label}
      </label>
      <Input
        type={input.type}
        {...register(input.name, input.validatin)}
        placeholder={input.placeholder}
      />
      <ErrorMsg msg={errors[input.name]?.message} />
    </div>
  ));

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="shadow-input  w-full max-w-md rounded-none  p-4 md:rounded-2xl  bg-black">
        <div className="flex items-center justify-center space-x-4">
          <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Salla
          </h2>
          <SiSalla className="w-8 h-8 text-[#1DCD9F]" />
        </div>
        <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
          {renderInputs}

          <button
            disabled={isLoading}
            className="mt-4 cursor-pointer group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              disabled={isLoading}
              onClick={signUpWithGithub}
              className="group/btn cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
            >
              <FiGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />

              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              onClick={signUpWithGoogle}
              disabled={isLoading}
              className="group/btn cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
            >
              <TbBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
          <p className="text-center mt-2 text-sm text-neutral-300 dark:text-neutral-300">You already have an account? 
            <Link to="/login" className="text-[#1DCD9F]"> Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#1DCD9F] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
