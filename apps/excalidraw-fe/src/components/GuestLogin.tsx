import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useRouter } from "next/navigation";

export const GuestLoginButton = ({ setLoading }: { setLoading: any }) => {
  const router = useRouter();
  return (
    <div className="mt-3 text-center text-gray-400">
      <button
        onClick={async () => {
          try {
            setLoading(true);
            const res = await axios.post(BACKEND_URL + "/auth/login", {
              email: "guestuser@gmail.com",
              password: "guestuser",
            });

            setLoading(false);
            if (res.status === 200) {
              router.push("/");
              localStorage.setItem("token", res.data.token);
            }
          } catch (error) {
            setLoading(false);
            console.error(error);
          }
        }}
        className="text-sky-400 hover:text-sky-300 font-medium"
      >
        Guest Login
      </button>
    </div>
  );
};
