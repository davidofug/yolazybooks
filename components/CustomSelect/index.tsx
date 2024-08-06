import Image from "next/image"; // Replace with your image library import
import { components } from "react-select";

interface CustomOptionProps {
  innerProps: React.HTMLProps<HTMLDivElement>;
  data: any;
}

const CustomOption: React.FC<CustomOptionProps> = ({ innerProps, data }) => {
  return (
    <div
      className="flex flex-row items-center gap-3 mt-5 cursor-pointer"
      {...innerProps}
    >
      <Image src={data.logoUrl} width={30} height={10} alt="" className="" />
      <h6 className="text-lg font-heading">{data.name}</h6>
    </div>
  );
};

export default CustomOption;
