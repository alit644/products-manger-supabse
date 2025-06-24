import ErrorMsg from "../../error/ErrorMsg";

interface FormGroupProps {
  children: React.ReactNode
  label: string,
  error: string | undefined
}
const FormGroup = ({children , label , error}: FormGroupProps) => {
  return (
    <div className="flex flex-col space-y-1.5 mb-2">
      <label>{label}</label>
      {children}
      {error && <ErrorMsg msg={error} />}
    </div>
  );
};

export default FormGroup;
