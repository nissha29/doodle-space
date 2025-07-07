import { verifyUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useGuard() {
  const router = useRouter();
  const [verified, setVerified] = useState<null | boolean>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      setVerified(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await verifyUser(token);
        const user = response.user;
        setUserData({
          name: user.name,
          email: user.email,
          avatar: user.avatar
        });
        setVerified(true);
      } catch (error) {
        setVerified(false);
        router.push('/signin');
      }
    };

    fetchUser();
  }, [router]);

  return { verified, userData };
}
