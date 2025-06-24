interface IFormSectionProps {
  title: string,
  children: React.ReactNode
}
const FormSection = ({title, children}: IFormSectionProps) => {
  return (
    <div className="border  border-zinc-700 p-4 rounded-md">
      <h3 className="sm:text-lg text-md font-semibold text-white mb-3">
        {title} 
      </h3>
      {children}
    </div>
  );
};

export default FormSection;
