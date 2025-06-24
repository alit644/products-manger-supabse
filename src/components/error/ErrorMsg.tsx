interface IErrorMsg {
  msg: string | undefined
}
const ErrorMsg = ({ msg }: IErrorMsg) => {
  return msg ? <span className="text-red-500 text-sm">{msg}</span> : null;
};

export default ErrorMsg;
