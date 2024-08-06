import { useFormik } from "formik";
import { FaUserEdit } from "react-icons/fa";

interface Props {
  profileData: any,
  isEditing: boolean,
  setIsEditing: (data: any) => void,
  onSave: (data: any) => void
}
const Index: React.FC<Props> = ({
  profileData,
  isEditing,
  setIsEditing,
  onSave
}) => {

  // Initial values
  const initialValues = {
    firstName: profileData?.firstName ?? "",
    secondName: profileData?.secondName ?? "",
    salutation: profileData?.salutation ?? "",
    gender: profileData?.gender ?? "",
    email: profileData?.email ?? "",
    currentGarageName: profileData?.currentGarageName ?? "",
    mechanicName: profileData?.mechanicName ?? "",
    mechanicPhone: profileData?.mechanicPhone ?? "",
    userId: profileData?.userId ?? "",
    phoneNumber: profileData?.phoneNumber ?? "",
  }

  // useform 
  const formik = useFormik({
    initialValues,
    onSubmit: onSave,
  });

  return (
    <div>
      {/* Mechanic information  edit  */}
      <form onSubmit={formik.handleSubmit}>
        {
          isEditing && <div className="w-full p-5 mt-5 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold font-body">Mechanic Details</h4>
            </div>
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* Current garage Name  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body">Current Garage name</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={ profileData?.currentGarageName ?? "enter the garage name"}
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps('currentGarageName')}
                  />
                </div>
              </div>
              {/* mechanic Name  */}
              <div className="w-full md:w-2/5 ">
                <h4 className="font-body">Mechanic name</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={profileData?.mechanicName ?? "set your mechanic name"}
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps('mechanicName')}
                  />
                </div>
              </div>
            </div>
            {/* mechanic phone and recommendation  */}
            <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
              {/* phonenumber  */}
              <div className="w-full md:w-2/5 ">
                <h4 className=" font-body"> Mechanic phone number</h4>
                <div className="w-full border rounded-md border-secondary-50">
                  <input
                    className="w-full p-2 outline-none font-body placeholder:font-body"
                    type="text"
                    placeholder={ profileData.mechanicPhone ?? "set mechanic number"}
                    disabled={isEditing ? false : true}
                    {...formik.getFieldProps("mechanicPhone")}
                  />
                </div>
              </div>
              {/* recommendation  */}
              {/* <div className="w-full md:w-2/5 ">
                  <h4 className="font-body">Would you recommendate</h4>
                  <div className="w-full border rounded-md border-secondary-50">
                    <input className="w-full p-2 outline-none font-body placeholder:font-body" type="email" placeholder={profileData.length ? profileData.email : "set your email"} name="email" disabled={isEditContact ? false : true} />
                  </div>
                </div> */}
            </div>
            <button
              type="submit"
              className={`${isEditing ? 'block' : 'hidden'} text-white bg-primary-500 rounded-md p-1 font-body mt-3`}
            >
              Save changes
            </button>
          </div>
        }
      </form>
      {/* Mechanic information  display  */}
      {
        !isEditing && <div className="w-full p-5 mt-5 rounded-md">
          <div className="flex justify-between">
            <h4 className="text-lg font-semibold font-body">Mechanic Details</h4>
            <span>
              <FaUserEdit size={20} className="cursor-pointer" onClick={() => setIsEditing(true)} />
            </span>
          </div>
          <div className="flex flex-col w-full mt-3 md:flex-row md:justify-between">
            {/* current garage name  */}
            <div className="w-full md:w-2/5 ">
              <h1 className=" font-body">Current Garage Name</h1>
              <h4 className="font-body text-secondary-300">{ profileData?.currentGarageName ?? "Not provided"}</h4>
            </div>
            {/* mechanic name */}
            <div className="w-full md:w-2/5 ">
              <h4 className="font-body">Mechanic name</h4>
              <h4 className="font-body text-secondary-300">{ profileData?.mechanicName ?? "Not provided"}</h4>
            </div>
            {/* mechanic phone number*/}
            <div className="w-full md:w-2/5 ">
              <h4 className="font-body">Mechanic phone number</h4>
              <h4 className="font-body text-secondary-300">{ profileData?.mechanicPhone ?? "Not provided"}</h4>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Index;