import React from "react";
import Image from "next/image";
import avatar from "@/assets/images/avatar.jpeg";
import { BsStarFill, BsStar } from "react-icons/bs";
import { parseISO, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface customerRatingsProps {
  name: string;
  avatarUrl: string;
  value: number;
  comment: string;
  date: string;
  status: string;
  id: string;
}

const Index: React.FC<customerRatingsProps> = ({
  name,
  avatarUrl,
  value,
  comment,
  date,
  status,
  id,
}) => {
  const router = useRouter();
  return (
    <section className="w-full pb-2 px-2 cursor-pointer mb-2 border-b-[0.5px] border-secondary-700 flex flex-col gap-y-1">
      <div className="flex justify-between items-end w-full">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-x-1.5">
            <div className="h-12 w-12 rounded-full overflow-hidden flex justify-center items-center font-body text-h2 bg-secondary-50 text-secondary-600">
              {avatarUrl ? (
                <Image src={avatar} alt="logo" className="w-full" />
              ) : (
                name?.[0] ?? ""
              )}
            </div>
            <div className="py-2 flex flex-col justify-between">
              <h2 className="text-base font-body font-medium">
                {name && name?.length > 0 ? name.split(" ")[0] : "N/A"}
              </h2>
              <div className="flex gap-x-1">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <>
                      {index < value ? (
                        <BsStarFill className="text-warning-500" size={15} />
                      ) : (
                        <BsStar className="text-warning-500" size={15} />
                      )}
                    </>
                  ))}
              </div>
            </div>
          </div>
          <span className="text-xs font-regular font-body text-secondary-500 capitalize">
            {date
              ? formatDistanceToNow(parseISO(date), { addSuffix: true })
              : "N/A"}
          </span>
        </div>
      </div>
      <p
        className={`font-body text-sm truncate hover:overflow-visible hover:whitespace-normal`}
      >
        {comment}
      </p>
      <button
        className="w-fit py-1 rounded-full border capitalize border-primary-500 text-primary-500 px-2 font-medium"
        onClick={(event) => {
          event.preventDefault();
          router.push("/admin/ratings");

          /**
           * TODO: Navigate to review route with the params set to the id of the review the details of the full rating
           */
        }}
      >
        review
      </button>
    </section>
  );
};

export default Index;
